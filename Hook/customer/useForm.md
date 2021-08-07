## useForm

### 简版

```js
import { useState, useCallback } from 'react';

const useForm = (initValue = {}, validators) => {
  const [values, setValue] = useState(initValue);
  const [validateErr, setValidateErr] = useState(null);
  const setFiledValue = useCallback(
    (filedName, filedValue) => {
      setValue({ ...values, [filedName]: filedValue });
      // 该字段是否有验证器
      if (validators[filedName]) {
        // 将值传入看看会不会产生错误
        const errMsg = validators[filedName](filedValue);
        setValidateErr({ ...validateErr, [filedName]: errMsg || null });
      }
    },

    [validators]
  );
  return [values, setFiledValue];
};

```
