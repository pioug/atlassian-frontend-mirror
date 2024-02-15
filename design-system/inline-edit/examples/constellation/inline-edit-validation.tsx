/** @jsx jsx */
import { useEffect, useState } from 'react';

import { jsx } from '@emotion/react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import { Box, xcss } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import {
  fontSize as getFontSize,
  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../../src';

const containerStyles = xcss({
  paddingBlockStart: 'space.100',
  paddingInlineEnd: 'space.100',
  paddingBlockEnd: 'space.600',
  width: '50%',
});

const errorIconContainerStyles = xcss({
  paddingInlineEnd: 'space.075',
  lineHeight: '100%',
});

const fontSize = getFontSize();
const gridSize = getGridSize();

const readViewContainerStyles = xcss({
  display: 'flex',
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  paddingBlock: 'space.100',
  paddingInline: 'space.075',
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
  wordBreak: `break-word`,
});

const InlineEditValidationExample = () => {
  const [editValue, setEditValue] = useState('');

  let validateValue = '';
  let validateTimeoutId: number | undefined;

  useEffect(() => {
    return () => {
      if (validateTimeoutId) {
        window.clearTimeout(validateTimeoutId);
      }
    };
  });

  const validate = (value: string) => {
    validateValue = value;
    return new Promise<{ value: string; error: string } | undefined>(
      (resolve) => {
        validateTimeoutId = window.setTimeout(() => {
          if (value.length <= 6) {
            resolve({
              value,
              error: 'Enter a description greater than 6 characters',
            });
          }
          resolve(undefined);
        }, 100);
      },
    ).then((validateObject) => {
      if (validateObject && validateObject.value === validateValue) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  const clearInlineEditContent = () => {
    setEditValue('');
  };

  return (
    <Box xcss={containerStyles}>
      <button data-testid="clear-button" onClick={clearInlineEditContent}>
        Click to clear
      </button>
      <InlineEdit
        defaultValue={editValue}
        label="Description"
        editView={({ errorMessage, ...fieldProps }) => (
          <InlineDialog
            isOpen={fieldProps.isInvalid}
            content={<Box id="error-message">{errorMessage}</Box>}
            placement="right"
          >
            <TextField
              testId="edit-view"
              {...fieldProps}
              elemAfterInput={
                fieldProps.isInvalid && (
                  <Box xcss={errorIconContainerStyles}>
                    <ErrorIcon
                      label="error"
                      primaryColor={token('color.icon.danger', R400)}
                    />
                  </Box>
                )
              }
              autoFocus
            />
          </InlineDialog>
        )}
        readView={() => (
          <Box xcss={readViewContainerStyles} testId="read-view">
            {editValue || 'Add a description'}
          </Box>
        )}
        onConfirm={(value) => setEditValue(value)}
        validate={validate}
      />
    </Box>
  );
};

export default InlineEditValidationExample;
