/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import TextField from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
import {
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../../src';

const fontSize = getFontSize();
const gridSize = getGridSize();

const ReadViewContainer = css({
  display: 'flex',
  fontSize: `${fontSize}px`,
  lineHeight: `${(gridSize * 2.5) / fontSize}`,
  maxWidth: '100%',
  minHeight: `${(gridSize * 2.5) / fontSize}em`,
  padding: `${gridSize}px ${gridSize - 2}px`,
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
              error: 'Enter a value greater than 6 characters',
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
    <div style={{ padding: `${gridSize}px ${gridSize}px`, width: '50%' }}>
      <button data-testid="clear-button" onClick={clearInlineEditContent}>
        Click to clear
      </button>
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit validation"
        editView={({ errorMessage, ...fieldProps }) => (
          <InlineDialog
            isOpen={fieldProps.isInvalid}
            content={<div id="error-message">{errorMessage}</div>}
            placement="right"
          >
            <TextField
              testId="edit-view"
              {...fieldProps}
              elemAfterInput={
                fieldProps.isInvalid && (
                  <div
                    style={{
                      paddingRight: `${gridSize - 2}px`,
                      lineHeight: '100%',
                    }}
                  >
                    <ErrorIcon
                      label="error"
                      primaryColor={token('color.iconBorder.danger', R400)}
                    />
                  </div>
                )
              }
              autoFocus
            />
          </InlineDialog>
        )}
        readView={() => (
          <div css={ReadViewContainer} data-testid="read-view">
            {editValue || 'Click to enter value'}
          </div>
        )}
        onConfirm={(value) => setEditValue(value)}
        validate={validate}
      />
    </div>
  );
};

export default InlineEditValidationExample;
