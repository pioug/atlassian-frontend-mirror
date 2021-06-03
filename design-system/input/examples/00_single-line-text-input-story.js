import React from 'react';
import FieldBase from '@atlaskit/field-base';
import SingleLineTextInput from '../src';

const containerStyle = {
  padding: 20,
  backgroundColor: 'white',
  width: 500,
};

const customTextStyle = {
  fontSize: 28,
};

const createSingleLineTextInput = (props) => (
  <SingleLineTextInput
    readOnly={false}
    onChange={console.log('onChange')}
    onConfirm={console.log('onConfirm')}
    isEditing={false}
    {...props}
  />
);

export default () => (
  <div>
    <h3>with default font size</h3>
    <div style={containerStyle}>{createSingleLineTextInput()}</div>
    <h3>with default font size in edit mode</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({ isEditing: true })}
    </div>
    <h3>with custom font size</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({ style: customTextStyle })}
    </div>
    <h3>with custom font size in edit mode</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({ style: customTextStyle, isEditing: true })}
    </div>
    <h3>with lots of text in read mode</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({
        value:
          'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
      })}
    </div>
    <h3>with lots of text in edit mode</h3>
    <div style={containerStyle}>
      {createSingleLineTextInput({
        isEditing: true,
        value:
          'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
      })}
    </div>
    <h3>with field base</h3>
    <div style={containerStyle}>
      <FieldBase>
        {createSingleLineTextInput({
          value:
            'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
          autoFocus: true,
          isEditing: false,
        })}
      </FieldBase>
    </div>
  </div>
);
