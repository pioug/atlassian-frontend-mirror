/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useMemo, useState, useRef, Fragment } from 'react';
import type { ChangeEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import Button from '@atlaskit/button';
import { IconButton } from '@atlaskit/button/new';
import { pixelEntryMessages as messages } from '@atlaskit/editor-common/media';
import Form, { Field } from '@atlaskit/form';
import CloseIcon from '@atlaskit/icon/core/close';
import { Inline, Box, Text, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	PIXEL_RESIZING_TOOLBAR_WIDTH,
	PIXEL_VIEW_MODE_TOOLBAR_WIDTH,
	PIXELENTRY_MIGRATION_BUTTON_TESTID,
} from './constants';
import {
	pixelEntryForm,
	pixelEntryHiddenSubmit,
	pixelSizingHeightInput,
	pixelSizingInput,
	pixelSizingWidthInput,
	pixelSizingWrapper,
} from './styles';
import type {
	PixelEntryComponentNextProps,
	PixelEntryFormValues,
	PixelEntryProps,
	PixelEntryValidation,
} from './types';

const pixelSizingLabel = xcss({
	gridArea: 'label',
	lineHeight: token('space.300'),
});

export const PixelEntryComponent = ({
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
	onCloseAndSave,
	isViewMode,
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

	// Handle submit when user presses enter or click close button in PixelEntryComponentNext
	const handleCloseAndSave = useCallback(
		(data: PixelEntryFormValues) => {
			if (data.inputWidth === '' || data.inputHeight === '') {
				return;
			}

			if (onCloseAndSave) {
				let widthToBeSubmitted = data.inputWidth;
				let validation: PixelEntryValidation = 'valid';

				if (data.inputWidth < minWidth) {
					widthToBeSubmitted = minWidth;
					validation = 'less-than-min';
				}

				if (data.inputWidth > maxWidth) {
					widthToBeSubmitted = maxWidth;
					validation = 'greater-than-max';
				}

				// If user keeps submitting an invalid input, node width attribute will be updated with the same value
				// and won't upadte the state in useEffect (since width is the same)
				// Thus, we set the state here to always display the correct dimension
				if (validation !== 'valid') {
					setComputedWidth(widthToBeSubmitted);
					setComputedHeight(Math.round(ratioWidth * widthToBeSubmitted));
				}

				onCloseAndSave({ width: widthToBeSubmitted, validation });
			}
		},
		[maxWidth, minWidth, onCloseAndSave, ratioWidth],
	);

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

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		return (
			<PixelEntryComponentNext
				maxWidth={maxWidth}
				formatMessage={formatMessage}
				handleFieldChange={handleOnChange}
				computedWidth={computedWidth}
				computedHeight={computedHeight}
				handleCloseAndSave={handleCloseAndSave}
				isViewMode={isViewMode}
			/>
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
												// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
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
												// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
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
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766 */}
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

const pixelEntryWrapperStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${PIXEL_RESIZING_TOOLBAR_WIDTH}px`,
});

const pixelEntryWrapperViewModeStyles = xcss({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${PIXEL_VIEW_MODE_TOOLBAR_WIDTH}px`,
});

const fieldStyles = css({
	// eslint-disable-next-line  @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-ds--text-field--input]': {
		paddingBlock: token('space.0'),
		paddingInline: token('space.100'),
	},

	flex: '1',
});

const dividerStyles = xcss({
	width: '1px',
	height: token('space.500'),
	background: token('color.border'),
	marginInlineEnd: 'space.050',
});

export const PixelEntryComponentNext = ({
	maxWidth,
	formatMessage,
	handleFieldChange,
	computedWidth,
	computedHeight,
	handleCloseAndSave,
	isViewMode,
}: PixelEntryComponentNextProps) => {
	const widthInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (widthInputRef.current) {
			if (isViewMode) {
				widthInputRef.current.blur();
			} else {
				widthInputRef.current.focus();
			}
		}
	}, [isViewMode, widthInputRef]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleCloseAndSave({ inputWidth: computedWidth, inputHeight: computedHeight });
			}
		},
		[computedWidth, computedHeight, handleCloseAndSave],
	);

	return (
		<Box xcss={[pixelEntryWrapperStyles, isViewMode && pixelEntryWrapperViewModeStyles]}>
			<Inline alignBlock="center" spread="space-between">
				<Box paddingInlineStart="space.100">
					<Text color="color.text.subtlest">{formatMessage(messages.inputWidthLabel)}</Text>
				</Box>
				<div css={fieldStyles}>
					<Tooltip
						hideTooltipOnMouseDown
						hideTooltipOnClick
						position="top"
						content={formatMessage(messages.inputWidthTooltip, { maxWidth })}
					>
						<Textfield
							name="inputWidth"
							value={computedWidth}
							ref={widthInputRef}
							height={token('space.250')}
							appearance="none"
							pattern="\d*"
							aria-label={formatMessage(messages.inputWidthAriaLabel, { maxWidth })}
							onChange={handleFieldChange('inputWidth')}
							onKeyDown={handleKeyDown}
						/>
					</Tooltip>
				</div>

				<Box paddingInlineStart="space.100">
					<Text color="color.text.subtlest">{formatMessage(messages.inputHeightTooltip)}</Text>
				</Box>
				<div css={fieldStyles}>
					<Tooltip
						hideTooltipOnMouseDown
						hideTooltipOnClick
						content={formatMessage(messages.inputHeightTooltip)}
						position="top"
					>
						<Textfield
							name="inputHeight"
							value={computedHeight}
							height={token('space.250')}
							appearance="none"
							pattern="\d*"
							aria-label={formatMessage(messages.inputHeightAriaLabel)}
							onChange={handleFieldChange('inputHeight')}
							onKeyDown={handleKeyDown}
						/>
					</Tooltip>
				</div>
				{!isViewMode && (
					<Fragment>
						<Box xcss={dividerStyles}></Box>
						<IconButton
							icon={() => <CloseIcon label="" color={token('color.icon.subtlest')} />}
							label={formatMessage(messages.closePixelEntry)}
							appearance="subtle"
							onClick={() => {
								handleCloseAndSave({ inputWidth: computedWidth, inputHeight: computedHeight });
							}}
						/>
					</Fragment>
				)}
			</Inline>
		</Box>
	);
};
