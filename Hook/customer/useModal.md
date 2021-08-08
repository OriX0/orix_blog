## modal组件

### 核心思路

1. 将modal组件独立开来
2. 用唯一 modalId进行管理

### 实现思路

#### 全局状态管理 对话框

##### modal state 的数据结构

```json
{
	modalId1:args, //外部传入modal1的数据
	modalId2:true, // 外部往modal2传入数据 但是modal显示了 默认为true
	modalId3:false, // modalId3的modal 关闭了
	// 各个id 是否在 hiding 状态
	hiding:{modalId1:true,modalId2:false,modalId3:false}
}
```

##### **reducer实现方案**

> hiding用于处理对话框关闭过程的动画

```js
export const modalReducer = (state = { hiding: false }, action) => {
  switch (action.type) {
    case 'nice-modal/show':
      // 从payload中解析数据
      const { modalId, args } = action.payload;
      //
      return {
        ...state,
        // 如果存在modalId对应的状态  就把args传入 或者显示这个对话框
        [modalId]: args || true,
        // hiding状态用于处理对话框关闭动画
        hiding: {
          ...state.hiding,
          [modalId]: false,
        },
      };
    case 'nice-modal/hide':
      const { modalId, args } = action.payload;
      // 如果 payload 里面传入了 force 则真正移除  否则 隐藏modal
      return action.payload.force
        ? {
            ...state,
            [modalId]: false,
            hiding: { [modalId]: false },
          }
        : { ...state, hiding: { [modalId]: true } };
    default:
      return state;
  }
};

```

##### 设计相关action

```js
function showModal(modalId, args) {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  };
}

function hideModal(modalId, force) {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
      force,
    },
  };
}
```

### 封装 useXXModal hook

#### 基础版

```js
import { showModal, hideModal } from './action';
import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
export const useNiceModal = (modalId) => {
  const dispatch = useDispatch();
  // 封装show方法
  const show = useCallback(
    (args) => {
      dispatch(showModal(modalId, args));
    },
    [dispatch, modalId]
  );
  // 封装hide方法
  const hide = useCallback(
    (force) => {
      dispatch(hideModal(modalId, force));
    },
    [dispatch, modalId]
  );
  // 获取args 和hiding 参数
  const args = useSelector((state) => state[modalId]);
  const hiding = useSelector((state) => state.hiding[modalId]);
  return useMemo(() => {
    show, hide, args, hiding;
  }, [args, hide, show, hiding]);
};

```

#### 增加需求  给调用者返回对话框填入值

> // 实现一个 promise API 来处理返回值
>
> modal.show(args).then(result => {});

```js
import { showModal, hideModal } from './action';
import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// 用一个object 缓存promise的resolve 回调函数
const modalCallbacks = {};
export const useNiceModal = (modalId) => {
  const dispatch = useDispatch();
  // 封装show方法
  const show = useCallback(
    (args) => {
        // 新增+++
      return new Promise((resolve) => {
        // 缓存resolve 方法
        modalCallbacks[modalId] = resolve;
          // 新增+++
        dispatch(showModal(modalId, args));
      });
    },
    [dispatch, modalId]
  );
  // 这里是新增的    封装resolve方法
  const resolve = useCallback(
    (args) => {
      // 如果该modalId 有对应的callback方法
      if (modalCallbacks[modalId]) {
        // 调用对应的callback方法
        modalCallbacks[modalId](args);
        // 调用完 删除
        delete modalCallbacks[modalId];
      }
    },
    [modalId]
  );
  // 封装hide方法
  const hide = useCallback(
    (force) => {
      dispatch(hideModal(modalId, force));
    },
    [dispatch, modalId]
  );
  // 获取args 和hiding 参数
  const args = useSelector((state) => state[modalId]);
  const hiding = useSelector((state) => state.hiding[modalId]);
  return useMemo(() => {
    show, hide, args, hiding, resolve;
  }, [args, hide, show, hiding, resolve]);
};

```

### NiceModal 组件及create方法

```jsx
import { useNiceModal } from './useNiceModal';
import { Modal } from 'antd';
function NiceModal({ id, children, ...rest }) {
  const modal = useNiceModal(id);
  return (
    <Modal
      visible={!modal.hiding}
      onOk={() => modal.hide()}
      onCancel={() => modal.hide()}
      // close动画完成后才真正关闭对
      afterClose={() => modal.hide(true)}
      // 透传参数
      {...rest}
    >
      {children}
    </Modal>
  );
}

export const createNiceModal = (modalId, Comp) => {
  return (props) => {
    const { visible, args } = useNiceModal(modalId);
    if (!visible) return null;
    // 往子组件里传入 args 和props
    return <Comp {...args} {...props} />;
  };
};
NiceModal.create = createNiceModal;
NiceModal.useModal = useNiceModal;
export default NiceModal;
```

### 最终使用

> 记得 进行 **状态传递** 

#### 简单例子-不使用resolve

```jsx
const MyModal = createNiceModal('orix-modal', () => {
  return (
    <NiceModal id={'orix-modal'} title="nice-modal">
      modal 内的内容 填充填充填充...
    </NiceModal>
  );
});

function MyModalContainer() {
  const modal = useNiceModal('orix-modal');
  return (
    <>
      <Button type="primary" onClick={() => modal.show()}>
        Show Modal
      </Button>
      <MyModal />
    </>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <h1>Nice Modal</h1>
      <MyModalContainer />
    </Provider>
  );
```

#### 使用resolve

```jsx
export default createNiceModal("user-info-modal", ({ user }) => {
  const [form] = Form.useForm();
  const meta = {
    initialValues: user,
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "job", label: "Job Title", required: true }
    ]
  };
  const modal = useNiceModal("user-info-modal");

  const handleSubmit = useCallback(() => {
    form.validateFields().then(() => {
      /*
       * user 如果当前是编辑user 则返回suer的信息
       * form.getFieldsValue() 将内部表单的值返回
       */
      modal.resolve({ ...user, ...form.getFieldsValue() });
      modal.hide();
    });
  }, [modal, user, form]);
  return (
    <NiceModal
      id="user-info-modal"
      title={user ? "Edit User" : "New User"}
      okText={user ? "Update" : "Create"}
      onOk={handleSubmit}
    >
      <Form form={form}>
        <FormBuilder meta={meta} form={form} />
      </Form>
    </NiceModal>
  );
});

```

