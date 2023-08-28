/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IntlShape } from 'react-intl-next';
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
  pixelSizingFullWidthLabelStyles,
} from './styles';
import type { PixelEntryFormValues, PixelEntryProps } from './types';
import { messages } from './messages';
import { PIXELENTRY_MIGRATION_BUTTON_TESTID } from './constants';

export const PixelEntry = ({
  width,
  mediaWidth,
  mediaHeight,
  onSubmit,
  minWidth,
  maxWidth,
  onChange,
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
    if (data.inputWidth === '' || data.inputHeight === '') {
      return;
    }

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

  // Handle updating computed fields based on
  const handleOnChange = useCallback(
    (type: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.currentTarget.value);
      const newInputValue = isNaN(value) ? '' : value;

      let newWidth: number | '' = '';

      switch (type) {
        case 'inputWidth': {
          newWidth = newInputValue;
          setComputedWidth(newInputValue);
          const newHeight =
            newInputValue !== '' ? Math.round(ratioWidth * newInputValue) : '';
          setComputedHeight(newHeight);
          break;
        }

        case 'inputHeight': {
          setComputedHeight(newInputValue);
          newWidth =
            newInputValue !== '' ? Math.round(ratioHeight * newInputValue) : '';
          setComputedWidth(newWidth);
          break;
        }
      }

      const isInvalidInputValid =
        newWidth !== '' && (newWidth < minWidth || newWidth > maxWidth);
      onChange && onChange(isInvalidInputValid);
    },
    [minWidth, maxWidth, onChange, ratioWidth, ratioHeight],
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

export const FullWidthDisplay: React.FC<{ intl: IntlShape }> = ({
  intl: { formatMessage },
}) => {
  return (
    <div css={pixelSizingFullWidthLabelStyles}>
      <span>{formatMessage(messages.fullWidthLabel)}</span>
    </div>
  );
};
