/** @jsx jsx */
import { jsx } from '@emotion/core';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';

import InlineEdit from './inline-edit';
import {
  errorIconContainerStyles,
  readViewContainerStyles,
} from './internal/styles';
import { InlineEditableTextfieldProps } from './types';

const InlineEditableTextfield = (props: InlineEditableTextfieldProps) => {
  const { isCompact = false, defaultValue, placeholder, testId } = props;

  return (
    <InlineEdit
      {...props}
      defaultValue={defaultValue}
      editView={({ errorMessage, isInvalid, ...props }) => (
        <InlineDialog
          isOpen={isInvalid}
          content={<div id="error-message">{errorMessage}</div>}
          placement="right"
        >
          <Textfield
            {...props}
            elemAfterInput={
              isInvalid && (
                <div css={errorIconContainerStyles}>
                  <ErrorIcon label="error" primaryColor={R400} />
                </div>
              )
            }
            testId={testId}
            isCompact={isCompact}
            autoFocus
          />
        </InlineDialog>
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
