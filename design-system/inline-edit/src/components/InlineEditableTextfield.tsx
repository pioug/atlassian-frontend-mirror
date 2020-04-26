import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';

import ErrorIconContainer from '../styled/ErrorIconContainer';
import ReadViewContainer from '../styled/ReadViewContainer';
import { InlineEditableTextfieldProps } from '../types';

import InlineEdit from './InlineEdit';

class InlineEditableTextfield extends React.Component<
  InlineEditableTextfieldProps,
  {}
> {
  static defaultProps = {
    isCompact: false,
  };

  render() {
    const { defaultValue, isCompact, placeholder } = this.props;
    return (
      <InlineEdit
        {...this.props}
        defaultValue={defaultValue}
        editView={fieldProps => (
          <Textfield
            {...fieldProps}
            elemAfterInput={
              fieldProps.isInvalid && (
                <ErrorIconContainer>
                  <ErrorIcon label="error" primaryColor={R400} />
                </ErrorIconContainer>
              )
            }
            isCompact={isCompact}
            autoFocus
          />
        )}
        readView={() => (
          <ReadViewContainer isCompact={isCompact}>
            {defaultValue || placeholder}
          </ReadViewContainer>
        )}
      />
    );
  }
}

export default InlineEditableTextfield;
