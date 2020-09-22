import React from 'react';
import SingleLineTextInput from '../src';

export default () => (
  <SingleLineTextInput
    value="Lorem ipsum dolor sit amet"
    onChange={console.log('onChange')}
    onConfirm={console.log('onConfirm')}
    isEditing={false}
  />
);
