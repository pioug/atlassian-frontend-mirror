/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import Textfield from '@atlaskit/textfield';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import Form, { Field } from '@atlaskit/form';
import {
  pixelSizingInput,
  pixelSizingLabel,
  pixelSizingWidthInput,
  pixelSizingHeightInput,
  pixelSizingWrapper,
  pixelEntryForm,
  pixelEntryHiddenSubmit,
} from './styles';
import type { PixelEntryFormValues, PixelEntryProps } from './types';
import { messages } from './messages';

export const PixelEntry = ({
  width,
  mediaWidth,
  mediaHeight,
  onSubmit,
  validate,
  intl: { formatMessage },
}: PixelEntryProps) => {
  const ratioWidth = useMemo(() => {
    return mediaHeight / mediaWidth;
  }, [mediaHeight, mediaWidth]);

  const ratioHeight = useMemo(() => {
    return mediaWidth / mediaHeight;
  }, [mediaHeight, mediaWidth]);

  const [computedWidth, setComputedWidth] = useState<number | ''>(width);
  const [computedHeight, setComputedHeight] = useState<number | ''>(
    Math.round(ratioWidth * width),
  );

  // Handle update to width from outside component
  useEffect(() => {
    setComputedWidth(width);
    setComputedHeight(Math.round(ratioWidth * width));
  }, [width, ratioWidth]);

  // Handle submit when user presses enter in form
  const handleOnSubmit = (data: PixelEntryFormValues) => {
    if (onSubmit) {
      if (data.inputWidth === '') {
        return;
      }
      onSubmit({ width: data.inputWidth });
    }
  };

  // Syncronous validation returning undefined for valid and string for invalid
  const handleValidateWidth = useCallback(
    (value?: number | '') => {
      if (!value || !validate) {
        return;
      }
      if (validate) {
        return validate(value) === true
          ? undefined
          : formatMessage(messages.validationFailedMessage);
      }
      return;
    },
    [validate, formatMessage],
  );

  // Handle updating computed fields based on
  const handleOnChange = useCallback(
    (type: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.currentTarget.value);
      const newInputValue = isNaN(value)
        ? ''
        : parseInt(event.currentTarget.value);

      switch (type) {
        case 'inputWidth': {
          setComputedWidth(newInputValue);
          if (!isNaN(value)) {
            setComputedHeight(Math.round(ratioWidth * value));
          }
          break;
        }

        case 'inputHeight': {
          setComputedHeight(newInputValue);
          if (!isNaN(value)) {
            setComputedWidth(Math.round(ratioHeight * value));
          }
          break;
        }
      }
    },
    [ratioHeight, ratioWidth],
  );

  return (
    <div css={pixelEntryForm}>
      <Form<PixelEntryFormValues> onSubmit={handleOnSubmit}>
        {({ formProps }) => {
          return (
            <form {...formProps}>
              <div css={pixelSizingWrapper}>
                <Field
                  key="inputWidth"
                  name="inputWidth"
                  validate={handleValidateWidth}
                  defaultValue={computedWidth}
                >
                  {({ fieldProps }) => (
                    <Tooltip
                      hideTooltipOnMouseDown
                      content={formatMessage(messages.inputWidthTooltip)}
                      position="top"
                    >
                      <Textfield
                        {...fieldProps}
                        css={[pixelSizingWidthInput, pixelSizingInput]}
                        appearance="none"
                        isCompact
                        onChange={handleOnChange('inputWidth')}
                        pattern="\d*"
                        aria-label={formatMessage(messages.inputWidthAriaLabel)}
                      />
                    </Tooltip>
                  )}
                </Field>
                <span css={pixelSizingLabel}>x</span>
                <Field
                  key="inputHeight"
                  name="inputHeight"
                  defaultValue={computedHeight}
                >
                  {({ fieldProps }) => (
                    <Tooltip
                      hideTooltipOnMouseDown
                      content={formatMessage(messages.inputHeightTooltip)}
                      position="top"
                    >
                      <Textfield
                        {...fieldProps}
                        css={[pixelSizingHeightInput, pixelSizingInput]}
                        appearance="none"
                        isCompact
                        onChange={handleOnChange('inputHeight')}
                        pattern="\d*"
                        aria-label={formatMessage(
                          messages.inputHeightAriaLabel,
                        )}
                      />
                    </Tooltip>
                  )}
                </Field>
                <Button css={pixelEntryHiddenSubmit} type="submit">
                  {formatMessage(messages.submitButtonText)}
                </Button>
              </div>
            </form>
          );
        }}
      </Form>
    </div>
  );
};
