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
import { PIXELENTRY_MIGRATION_BUTTON_TESTID } from './constants';

export const PixelEntry = ({
  width,
  mediaWidth,
  mediaHeight,
  onSubmit,
  validate,
  minWidth,
  maxWidth,
  intl: { formatMessage },
  showMigration,
  onMigrate,
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
      let widthToBeSumitted = data.inputWidth;
      let isInvalidInput = false;

      if (data.inputWidth < minWidth) {
        widthToBeSumitted = minWidth;
        isInvalidInput = true;
      }

      if (data.inputWidth > maxWidth) {
        widthToBeSumitted = maxWidth;
        isInvalidInput = true;
      }

      // If user keeps submitting an invalid input, node width attribute will be updated with the same value
      // and won't upadte the state in useEffect (since width is the same)
      // Thus, we set the state here to always display the correct dimension
      if (isInvalidInput) {
        setComputedWidth(widthToBeSumitted);
        setComputedHeight(Math.round(ratioWidth * widthToBeSumitted));
      }

      onSubmit({ width: widthToBeSumitted });
    }
  };

  // Syncronous validation returning undefined for valid and string for invalid
  const handleValidateWidth = useCallback(
    (value?: number | '') => {
      if (!validate || value === undefined) {
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
          if (newInputValue) {
            setComputedHeight(Math.round(ratioWidth * value));
          } else {
            setComputedHeight('');
          }
          break;
        }

        case 'inputHeight': {
          setComputedHeight(newInputValue);
          if (newInputValue) {
            setComputedWidth(Math.round(ratioHeight * value));
          } else {
            setComputedWidth('');
          }
          break;
        }
      }
    },
    [ratioHeight, ratioWidth],
  );

  if (showMigration) {
    return (
      <Tooltip content={formatMessage(messages.migrationButtonTooltip)}>
        <Button
          appearance="warning"
          spacing="compact"
          onClick={onMigrate}
          testId={PIXELENTRY_MIGRATION_BUTTON_TESTID}
        >
          {formatMessage(messages.migrationButtonText)}
        </Button>
      </Tooltip>
    );
  }

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
                      content={formatMessage(messages.inputWidthTooltip, {
                        maxWidth,
                      })}
                      position="top"
                    >
                      <Textfield
                        {...fieldProps}
                        css={[pixelSizingWidthInput, pixelSizingInput]}
                        appearance="none"
                        isCompact
                        onChange={handleOnChange('inputWidth')}
                        pattern="\d*"
                        aria-label={formatMessage(
                          messages.inputWidthAriaLabel,
                          { maxWidth },
                        )}
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
