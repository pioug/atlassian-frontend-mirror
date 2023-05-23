import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import InlineDialog from '@atlaskit/inline-dialog';
import TextField from '@atlaskit/textfield';
import { R400 } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

interface Props {
  isCompact?: boolean;
}

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
const ReadViewContainer = styled.div<Props>`
  display: flex;
  font-size: ${fontSize()}px;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${(props) =>
      props.isCompact ? token('space.050', '4px') : token('space.100', '8px')}
    ${token('space.075', '6px')};
  word-break: break-word;
`;

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field Value');

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
            resolve({ value, error: 'Enter a value longer than 6 characters' });
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
    <div
      style={{
        padding: `${token('space.100', '8px')} ${token('space.100', '8px')}`,
        width: '50%',
      }}
    >
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
                      paddingRight: token('space.075', '6px'),
                      lineHeight: '100%',
                    }}
                  >
                    <ErrorIcon
                      label="error"
                      primaryColor={token('color.icon.danger', R400)}
                    />
                  </div>
                )
              }
              autoFocus
            />
          </InlineDialog>
        )}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={(value) => setEditValue(value)}
        validate={validate}
      />
    </div>
  );
};

export default InlineEditExample;
