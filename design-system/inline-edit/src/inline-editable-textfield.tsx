/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import Textfield from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import InlineEdit from './inline-edit';
import { fontSize, gridSize } from './internal/constants';
import { InlineEditableTextfieldProps } from './types';

const errorIconContainerStyles = css({
  paddingRight: gridSize - 2,
  lineHeight: '100%',
});

const readViewForTextFieldStyles = css({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${gridSize}px ${gridSize - 2}px`,
  fontSize: fontSize,
  lineHeight: (gridSize * 2.5) / fontSize,
  wordBreak: 'break-word',
});

const compactStyles = css({
  padding: `${gridSize / 2}px ${gridSize - 2}px`,
});

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
                  <ErrorIcon
                    label="error"
                    primaryColor={token('color.icon.danger', R400)}
                  />
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
          css={[readViewForTextFieldStyles, isCompact && compactStyles]}
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
