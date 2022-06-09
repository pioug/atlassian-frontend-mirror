import React, {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useRef,
} from 'react';

import { ErrorMessage, Field } from '@atlaskit/form';
import Tooltip from '@atlaskit/tooltip';
import Textfield, { TextFieldProps } from '@atlaskit/textfield';

import Selectclear from '@atlaskit/icon/glyph/select-clear';
import { ClearText, FieldWrapper } from '../styles';
import { isRedoEvent, isUndoEvent } from '../utils';
export interface Props
  extends Omit<
    TextFieldProps,
    'value' | 'onChange' | 'autoFocus' | 'onSubmit'
  > {
  name: string;
  label?: string;
  autoFocus?: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  // overrides default browser undo behaviour (cmd/ctrl + z) with that function
  onUndo?: Function;
  // overrides default browser redo behaviour (cm + shift + z / ctrl + y) with that function
  onRedo?: Function;
  onClear?: () => void;
  clearLabel?: string;
  error?: string | null;
}

const PanelTextInput = (props: Props) => {
  const {
    name,
    label,
    autoFocus,
    onSubmit,
    onRedo,
    onUndo,
    onChange,
    onKeyDown,
    onClear,
    clearLabel,
    error,
    ...restProps
  } = props;

  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef<
    HTMLInputElement
  >(null);

  const handleRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) {
        inputRef.current = input;
        if (autoFocus) {
          // Need this to prevent jumping when we render TextInput inside Portal @see ED-2992
          input.focus({ preventScroll: true });
        }
      }
    },
    [autoFocus],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange],
  );

  const handleKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      if (e.keyCode === 13 && onSubmit) {
        e.preventDefault(); // Prevent from submitting if an editor is inside a form.
        onSubmit(value);
      } else if (typeof onUndo === 'function' && isUndoEvent(e)) {
        e.preventDefault();
        onUndo();
      } else if (typeof onRedo === 'function' && isRedoEvent(e)) {
        e.preventDefault();
        onRedo();
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    },
    [onSubmit, onUndo, onRedo, onKeyDown],
  );

  const handleClear = useCallback(() => {
    if (inputRef.current && onClear) {
      inputRef.current.focus();
      onClear();
    }
  }, [onClear]);

  const clearText = restProps.value !== '' && (
    <Tooltip content={clearLabel}>
      <ClearText onClick={handleClear} data-testid="clear-text">
        <Selectclear size="medium" label={clearLabel || ''} />
      </ClearText>
    </Tooltip>
  );

  return (
    <FieldWrapper>
      <Field label={label} name={name}>
        {({ fieldProps }) => {
          return (
            <>
              <Textfield
                {...fieldProps}
                {...restProps}
                onKeyDown={handleKeydown}
                onChange={handleChange}
                ref={handleRef}
                elemAfterInput={clearText}
                isInvalid={!!error}
              />
              {error && (
                <ErrorMessage testId="link-error">{error}</ErrorMessage>
              )}
            </>
          );
        }}
      </Field>
    </FieldWrapper>
  );
};

export default PanelTextInput;
