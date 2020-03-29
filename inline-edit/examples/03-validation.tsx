import React from 'react';
import TextField from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors, gridSize } from '@atlaskit/theme';

import InlineEdit from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field Value',
  };

  validateValue = '';

  private validateTimeoutId: number | undefined;

  componentWillUnmount() {
    window.clearTimeout(this.validateTimeoutId);
  }

  validate = (value: string) => {
    this.validateValue = value;
    return new Promise<{ value: string; error: string } | undefined>(
      resolve => {
        this.validateTimeoutId = window.setTimeout(() => {
          if (value.length <= 6) {
            resolve({ value, error: 'Enter a value longer than 6 characters' });
          }
          resolve(undefined);
        }, 500);
      },
    ).then(validateObject => {
      if (validateObject && validateObject.value === this.validateValue) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  onConfirm = (value: string) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div style={{ padding: `${gridSize()}px ${gridSize()}px`, width: '50%' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit validation"
          editView={fieldProps => (
            <TextField
              {...fieldProps}
              elemAfterInput={
                fieldProps.isInvalid && (
                  <div
                    style={{
                      paddingRight: `${gridSize() - 2}px`,
                      lineHeight: '100%',
                    }}
                  >
                    <ErrorIcon label="error" primaryColor={colors.R400} />
                  </div>
                )
              }
              autoFocus
            />
          )}
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
          validate={this.validate}
        />
      </div>
    );
  }
}
