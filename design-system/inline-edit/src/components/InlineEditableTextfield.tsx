/** @jsx jsx */
import { jsx } from '@emotion/core';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';

import { InlineEditableTextfieldProps } from '../types';

import InlineEdit from './InlineEdit';
import {
  errorIconContainerStyles,
  readViewContainerStyles,
} from './internal/styles';

const InlineEditableTextfield = (props: InlineEditableTextfieldProps) => {
  const { isCompact = false, defaultValue, placeholder, testId } = props;

  return (
    <InlineEdit
      {...props}
      defaultValue={defaultValue}
      editView={fieldProps => (
        <Textfield
          {...fieldProps}
          testId={testId}
          elemAfterInput={
            fieldProps.isInvalid && (
              <div css={errorIconContainerStyles}>
                <ErrorIcon label="error" primaryColor={R400} />
              </div>
            )
          }
          isCompact={isCompact}
          autoFocus
        />
      )}
      readView={() => (
        <div
          css={readViewContainerStyles}
          data-compact={isCompact}
          data-testid={testId && `read-view-${testId}`}
        >
          {defaultValue || placeholder}
        </div>
      )}
    />
  );
};

export default InlineEditableTextfield;
