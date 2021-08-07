## useModal

### 简版

```js
import { useState, useCallback } from 'react';

const useAsync = (asyncFunction) => {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  // 请求开始的时候
  setValue(null);
  setLoading(true);
  setError(null);
  const run = useCallback(
    asyncFunction()
      .then((response) => {
        setValue(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false)),
    [asyncFunction]
  );
  return [run, value, loading, error];
};
```

### 完整版

#### 完善功能

1. 刷新功能
2. 判断当前的组件是否卸载  如果卸载就不挂载了
3. 用TS进行约束
4. 使用useReducer

#### code

> useMountedRef

```ts
/**
 * 返回组件的挂载状态 如果还没挂在或者已经卸载了 就返回false  否则返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    // 加载完了
    mountedRef.current = true;
    // 卸载
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};

```

> 主函数


```ts
import { useCallback, useState, useReducer } from "react";
import { useMountedRef } from "utils";
// 1.先定义接口类型
interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
// 2.定义默认状态
const defaultInitState: State<null> = {
  stat: "idle",
  error: null,
  data: null,
};
// 定义默认配置
const defaultConfig = {
  throwOnError: false,
};
// 将dispatch 和 useMounter 结合
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

// 3.定义customerHook
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  // 初始化状态
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitState,
      ...initialState,
    }
  );
  // 初始化配置
  const config = { ...defaultConfig, ...initialConfig };
  // 状态 ---刷新函数 及 设置刷新函数   使用
  const [retry, setRetry] = useState(() => () => {});
  // 使用safe dispatch
  const safeDispatch = useSafeDispatch(dispatch);
  // 定义内部关于各个状态的处理函数 用useCallback对 返回值为函数的进行包裹
  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: "error",
        data: null,
      }),
    [safeDispatch]
  );
  // 定义主执行函数 run
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      // 判断参数是否为promise类型
      if (!promise || !promise.then) {
        throw new Error("请传入Promise类型的数据");
      }
      // 设置 retry函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig.retry(), runConfig);
        }
      });
      // 设置当前状态为 loading
      // useCallback 里面使用setState直接赋值 会触犯无限渲染 应该使用函数式
      // setState({ ...state, stat: "loading" });
      safeDispatch({ stat: "loading" });
      // 进行处理
      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((error) => {
          setError(error);
          if (config.throwOnError) {
            return Promise.reject(error);
          } else {
            return error;
          }
        });
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );
  return {
    // 返回状态标识
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    // 返回处理函数
    run,
    setData,
    setError,
    // 将retry函数返回 以便外部调用
    retry,
    // 返回当前状态
    ...state,
  };
};

```

