import React from 'react';

import Toggle from '../src';

export default () => {
  const ref = React.createRef<HTMLInputElement>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (ref.current) {
      console.log(ref.current.checked);
    }
  };

  return <Toggle defaultChecked onChange={onChange} ref={ref} />;
};
