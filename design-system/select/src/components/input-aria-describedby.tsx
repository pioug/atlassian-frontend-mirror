import React from 'react';

import { components, InputProps } from 'react-select';

export const Input = (props: InputProps) => {
  const passed_describedby = props.selectProps['aria-describedby'];
  const describedby =
    props['aria-describedby'] +
    (passed_describedby ? ' ' + passed_describedby : '');
  return <components.Input {...props} aria-describedby={describedby} />;
};
