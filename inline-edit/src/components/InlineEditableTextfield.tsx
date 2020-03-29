import React from 'react';
import Textfield from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { R400 } from '@atlaskit/theme/colors';

import InlineEdit from './InlineEdit';
import ReadViewContainer from '../styled/ReadViewContainer';
import ErrorIconContainer from '../styled/ErrorIconContainer';
import { InlineEditableTextfieldProps } from '../types';

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
