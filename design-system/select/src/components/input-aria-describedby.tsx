import React from 'react';

import { components, InputProps } from 'react-select';

export const Input = (props: InputProps) => {
  let ariaDescribedByAttribute;
  const passed_describedby = props.selectProps['aria-describedby'];

  if (props['aria-describedby'] && passed_describedby) {
    ariaDescribedByAttribute =
      props['aria-describedby'] + ' ' + passed_describedby;
  } else {
    ariaDescribedByAttribute = props['aria-describedby'] || passed_describedby;
  }

  return (
    <components.Input {...props} aria-describedby={ariaDescribedByAttribute} />
  );
};
