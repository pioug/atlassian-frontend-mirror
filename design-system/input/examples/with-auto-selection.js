import React from 'react';
import SingleLineTextInput from '../src';

const containerStyle = {
  padding: 20,
  backgroundColor: 'white',
  width: 500,
};

const createSingleLineTextInput = (props) => (
  <SingleLineTextInput
    value="Lorem ipsum dolor sit amet"
    onChange={console.log('onChange')}
    onConfirm={console.log('onConfirm')}
    isEditing={false}
    {...props}
  />
);

export default () => (
  <div>
    <h3>with auto selection</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({
        isEditing: true,
        isInitiallySelected: true,
      })}
    </div>
  </div>
);
