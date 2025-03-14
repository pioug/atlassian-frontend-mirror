/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import Button from '@atlaskit/button';
import { pixelEntryMessages as messages } from '@atlaskit/editor-common/media';
import Form, { Field } from '@atlaskit/form';
import { Box, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { PIXELENTRY_MIGRATION_BUTTON_TESTID } from './constants';
import {
	pixelEntryForm,
	pixelEntryHiddenSubmit,
	pixelSizingFullWidthLabelStyles,
	pixelSizingHeightInput,
	pixelSizingInput,
	pixelSizingWidthInput,
	pixelSizingWrapper,
} from './styles';
import type { PixelEntryFormValues, PixelEntryProps, PixelEntryValidation } from './types';

const pixelSizingLabel = xcss({
	gridArea: 'label',
	lineHeight: token('space.300'),
});

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
	const [computedHeight, setComputedHeight] = useState<number | ''>(Math.round(ratioWidth * width));

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
			let validation: PixelEntryValidation = 'valid';

			if (data.inputWidth < minWidth) {
				widthToBeSumitted = minWidth;
				validation = 'less-than-min';
			}

			if (data.inputWidth > maxWidth) {
				widthToBeSumitted = maxWidth;
				validation = 'greater-than-max';
			}

			// If user keeps submitting an invalid input, node width attribute will be updated with the same value
			// and won't upadte the state in useEffect (since width is the same)
			// Thus, we set the state here to always display the correct dimension
			if (validation !== 'valid') {
				setComputedWidth(widthToBeSumitted);
				setComputedHeight(Math.round(ratioWidth * widthToBeSumitted));
			}

			onSubmit({ width: widthToBeSumitted, validation });
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
					const newHeight = newInputValue !== '' ? Math.round(ratioWidth * newInputValue) : '';
					setComputedHeight(newHeight);
					break;
				}

				case 'inputHeight': {
					setComputedHeight(newInputValue);
					newWidth = newInputValue !== '' ? Math.round(ratioHeight * newInputValue) : '';
					setComputedWidth(newWidth);
					break;
				}
			}

			const isInvalidInputValid = newWidth !== '' && (newWidth < minWidth || newWidth > maxWidth);
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={pixelEntryForm}>
			<Form<PixelEntryFormValues> onSubmit={handleOnSubmit}>
				{({ formProps }) => {
					return (
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						<form {...formProps}>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<div css={pixelSizingWrapper}>
								<Field key="inputWidth" name="inputWidth" defaultValue={computedWidth}>
									{({ fieldProps }) => (
										<Tooltip
											hideTooltipOnMouseDown
											content={formatMessage(messages.inputWidthTooltip, {
												maxWidth,
											})}
											position="top"
										>
											<Textfield
												// Ignored via go/ees005
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...fieldProps}
												// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
												css={[pixelSizingWidthInput, pixelSizingInput]}
												appearance="none"
												isCompact
												onChange={handleOnChange('inputWidth')}
												pattern="\d*"
												aria-label={formatMessage(messages.inputWidthAriaLabel, { maxWidth })}
											/>
										</Tooltip>
									)}
								</Field>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<Box as="span" xcss={pixelSizingLabel}>
									×
								</Box>
								<Field key="inputHeight" name="inputHeight" defaultValue={computedHeight}>
									{({ fieldProps }) => (
										<Tooltip
											hideTooltipOnMouseDown
											content={formatMessage(messages.inputHeightTooltip)}
											position="top"
										>
											<Textfield
												// Ignored via go/ees005
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...fieldProps}
												// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
												css={[pixelSizingHeightInput, pixelSizingInput]}
												appearance="none"
												isCompact
												onChange={handleOnChange('inputHeight')}
												pattern="\d*"
												aria-label={formatMessage(messages.inputHeightAriaLabel)}
											/>
										</Tooltip>
									)}
								</Field>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
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

export const FullWidthDisplay = ({ intl: { formatMessage } }: { intl: IntlShape }) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={pixelSizingFullWidthLabelStyles}>
			<Text>{formatMessage(messages.fullWidthLabel)}</Text>
		</div>
	);
};
