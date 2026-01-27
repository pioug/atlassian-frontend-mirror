/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';
import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss, Inline } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { ColorPickerAEP } from '../../analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	editorAnalyticsChannel,
	EVENT_TYPE,
} from '../../analytics';
import { colorPickerButtonMessages } from '../../messages/color-picker-button';
import type { PaletteColor, PaletteTooltipMessages } from '../../ui-color';
import {
	ColorPalette,
	DEFAULT_BORDER_COLOR,
	getSelectedRowAndColumnFromPalette,
} from '../../ui-color';
import { withReactEditorViewOuterListeners } from '../../ui-react';
import { default as Popup } from '../../ui/Popup';
import type { Position as PopupPosition } from '../../ui/Popup/utils';
import { ArrowKeyNavigationProvider } from '../ArrowKeyNavigationProvider';
import { ArrowKeyNavigationType } from '../ArrowKeyNavigationProvider/types';

// helps adjusts position of popup
const colorPickerButtonWrapper = css({
	position: 'relative',
});

const colorPickerExpandContainerVisualRefresh = xcss({
	marginTop: 'space.negative.025',
	marginRight: 'space.negative.050',
});
const colorPickerButtonStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		'&::after': {
			border: 'none',
		},
		'&:hover': {
			backgroundColor: `${token('color.background.selected')}`,
		},
	},
});

// Control the size of color picker buttons and preview
// TODO: DSP-4134 - Color picking UI
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const colorPickerWrapper = () =>
	css({
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		padding: `${token('space.100', '8px')} 0px`,
	});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

type Props = WithAnalyticsEventsProps & {
	absoluteOffset?: PopupPosition;
	alignX?: 'left' | 'right' | 'center' | 'end';
	colorPalette: PaletteColor[];
	cols?: number;
	currentColor?: string;
	hexToPaletteColor?: (hexColor: string) => string | undefined;
	isAriaExpanded?: boolean;
	mountPoint?: HTMLElement;
	onChange?: (color: PaletteColor) => void;
	paletteColorTooltipMessages?: PaletteTooltipMessages;
	placement: string;
	returnEscToButton?: boolean;
	setDisableParentScroll?: (disable: boolean) => void;

	size?: {
		height: string;
		width: string;
	};
	/**
	 * After picking the color the default behaviour is to focus the color picker button.
	 * To prevent this use skipFocusButtonAfterPick.
	 */
	skipFocusButtonAfterPick?: boolean;
	title?: string;
};

const ColorPaletteWithReactViewListeners = withReactEditorViewOuterListeners(ColorPalette);

const ColorPickerButton = (props: Props) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);
	const [isPopupPositioned, setIsPopupPositioned] = React.useState(false);
	const [isOpenedByKeyboard, setIsOpenedByKeyboard] = React.useState(false);
	const { formatMessage } = useIntl();

	const togglePopup = () => {
		setIsPopupOpen(!isPopupOpen);
		if (!isPopupOpen) {
			setIsOpenedByKeyboard(false);
			setIsPopupPositioned(false);
		}
	};

	React.useEffect(() => {
		if (props.setDisableParentScroll) {
			props.setDisableParentScroll(isPopupOpen);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPopupOpen]);

	const focusButton = () => {
		buttonRef.current?.focus();
	};

	const handleEsc = React.useCallback(() => {
		setIsOpenedByKeyboard(false);
		setIsPopupPositioned(false);
		setIsPopupOpen(false);
		focusButton();
	}, []);

	const onPositionCalculated = React.useCallback((position: PopupPosition) => {
		setIsPopupPositioned(true);
		return position;
	}, []);

	const { onChange, createAnalyticsEvent, colorPalette, placement, skipFocusButtonAfterPick } =
		props;

	const onColorSelected = React.useCallback(
		(color: string, label: string) => {
			setIsOpenedByKeyboard(false);
			setIsPopupOpen(false);
			setIsPopupPositioned(false);
			if (onChange) {
				if (createAnalyticsEvent) {
					// fire analytics
					const payload: ColorPickerAEP = {
						action: ACTION.UPDATED,
						actionSubject: ACTION_SUBJECT.PICKER,
						actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
						attributes: {
							color,
							label,
							placement: placement,
						},
						eventType: EVENT_TYPE.TRACK,
					};
					createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
				}

				const newPalette = colorPalette.find((colorPalette) => colorPalette.value === color);
				newPalette && onChange(newPalette);
			}
			if (!skipFocusButtonAfterPick) {
				focusButton();
			}
		},
		[colorPalette, onChange, createAnalyticsEvent, placement, skipFocusButtonAfterPick],
	);

	const renderPopup = () => {
		if (!isPopupOpen || !buttonRef.current) {
			return;
		}

		const selectedColor = props.currentColor || null;
		const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
			props.colorPalette,
			selectedColor,
			props.cols,
		);

		return (
			<Popup
				target={buttonRef.current}
				fitHeight={350}
				fitWidth={350}
				offset={[0, 10]}
				alignX={props.alignX}
				mountTo={props.setDisableParentScroll ? props.mountPoint : undefined}
				absoluteOffset={props.absoluteOffset}
				// Confluence inline comment editor has z-index: 500
				// if the toolbar is scrollable, this will be mounted in the root editor
				// we need an index of > 500 to display over it
				zIndex={props.setDisableParentScroll ? 600 : undefined}
				ariaLabel={
					fg('_editor_a11y_aria_label_removal_popup')
						? formatMessage(colorPickerButtonMessages.colorPickerMenuLabel)
						: 'Color picker popup'
				}
				onPositionCalculated={onPositionCalculated}
			>
				<div css={colorPickerWrapper} data-test-id="color-picker-menu">
					<ArrowKeyNavigationProvider
						type={ArrowKeyNavigationType.COLOR}
						selectedRowIndex={selectedRowIndex}
						selectedColumnIndex={selectedColumnIndex}
						closeOnTab={true}
						handleClose={() => setIsPopupOpen(false)}
						isOpenedByKeyboard={isOpenedByKeyboard}
						isPopupPositioned={isPopupPositioned}
						ignoreEscapeKey={props.returnEscToButton}
					>
						<ColorPaletteWithReactViewListeners
							cols={props.cols}
							selectedColor={selectedColor}
							onClick={onColorSelected}
							handleClickOutside={togglePopup}
							handleEscapeKeydown={handleEsc}
							paletteOptions={{
								palette: props.colorPalette,
								hexToPaletteColor: props.hexToPaletteColor,
								paletteColorTooltipMessages: props.paletteColorTooltipMessages,
							}}
						/>
					</ArrowKeyNavigationProvider>
				</div>
			</Popup>
		);
	};

	const title = props.title || '';
	const currentColor =
		props.currentColor && props.hexToPaletteColor
			? props.hexToPaletteColor(props.currentColor)
			: props.currentColor;
	const buttonStyleVisualRefresh = () =>
		css({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			height: `${!!props.size?.height ? 'inherit' : ''}`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:before': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				alignSelf: 'center',
				content: "''",
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				border: `${token('border.width')} solid ${DEFAULT_BORDER_COLOR}`,
				borderRadius: token('radius.small', '3px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: currentColor || 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				width: props.size?.width || '14px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				height: props.size?.height || '14px',
				marginTop: `${token('space.025', '2px')}`,
			},
		});
	return (
		<div css={colorPickerButtonWrapper}>
			<Tooltip content={title} position="top">
				<div css={colorPickerButtonStyle}>
					<Button
						appearance={'subtle'}
						ref={buttonRef}
						aria-label={title}
						aria-expanded={props.isAriaExpanded ? isPopupOpen : undefined}
						spacing={
							editorExperiment('platform_editor_controls', 'variant1') ? 'default' : 'compact'
						}
						onClick={togglePopup}
						onKeyDown={(event: React.KeyboardEvent) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								togglePopup();
								setIsOpenedByKeyboard(true);
							}
						}}
						data-selected-color={props.currentColor}
						isSelected={isPopupOpen}
					>
						<Inline alignBlock="start">
							<span
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
								css={buttonStyleVisualRefresh}
							/>
							<Box xcss={colorPickerExpandContainerVisualRefresh}>
								<ChevronDownIcon
									color="currentColor"
									spacing="spacious"
									label="color-picker-chevron-down"
									size="small"
								/>
							</Box>
						</Inline>
					</Button>
				</div>
			</Tooltip>
			{renderPopup()}
		</div>
	);
};

export default withAnalyticsContext({ source: 'ConfigPanel' })(
	withAnalyticsEvents()(ColorPickerButton),
);
