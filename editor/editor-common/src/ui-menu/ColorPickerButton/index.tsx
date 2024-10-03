/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';
import Button from '@atlaskit/button/standard-button';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
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

const colorPickerExpandContainer = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

// Control the size of color picker buttons and preview
// TODO: https://product-fabric.atlassian.net/browse/DSP-4134
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const colorPickerWrapper = () =>
	css({
		borderRadius: token('border.radius', '3px'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		padding: `${token('space.100', '8px')} 0px`,
	});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

type Props = WithAnalyticsEventsProps & {
	currentColor?: string;
	title?: string;
	isAriaExpanded?: boolean;
	onChange?: (color: PaletteColor) => void;
	colorPalette: PaletteColor[];
	placement: string;
	cols?: number;
	alignX?: 'left' | 'right' | 'center' | 'end';
	size?: {
		width: string;
		height: string;
	};
	mountPoint?: HTMLElement;
	setDisableParentScroll?: (disable: boolean) => void;
	hexToPaletteColor?: (hexColor: string) => string | undefined;
	paletteColorTooltipMessages?: PaletteTooltipMessages;

	/**
	 * After picking the color the default behaviour is to focus the color picker button.
	 * To prevent this use skipFocusButtonAfterPick.
	 */
	skipFocusButtonAfterPick?: boolean;
	absoluteOffset?: PopupPosition;
	returnEscToButton?: boolean;
};

const ColorPaletteWithReactViewListeners = withReactEditorViewOuterListeners(ColorPalette);

const ColorPickerButton = (props: Props) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);
	const [isPopupPositioned, setIsPopupPositioned] = React.useState(false);
	const [isOpenedByKeyboard, setIsOpenedByKeyboard] = React.useState(false);

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
				ariaLabel="Color picker popup"
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
	const buttonStyle = () =>
		css({
			padding: `${token('space.075', '6px')} 10px`,
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
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
				border: `1px solid ${DEFAULT_BORDER_COLOR}`,
				borderRadius: token('border.radius', '3px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: currentColor || 'transparent',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				width: props.size?.width || '14px',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				height: props.size?.height || '14px',
				padding: 0,
				margin: `0px ${token('space.025', '2px')}`,
			},
			'&:hover': {
				background: token('color.background.neutral.subtle.hovered'),
			},
		});
	return (
		<div css={colorPickerButtonWrapper}>
			<Tooltip content={title} position="top">
				<Button
					ref={buttonRef}
					aria-label={title}
					aria-expanded={props.isAriaExpanded ? isPopupOpen : undefined}
					spacing="compact"
					onClick={togglePopup}
					onKeyDown={(event: React.KeyboardEvent) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							togglePopup();
							setIsOpenedByKeyboard(true);
						}
					}}
					// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
					css={buttonStyle}
					iconAfter={
						<span css={colorPickerExpandContainer}>
							<ExpandIcon label="" />
						</span>
					}
					data-selected-color={props.currentColor}
				/>
			</Tooltip>
			{renderPopup()}
		</div>
	);
};

export default withAnalyticsContext({ source: 'ConfigPanel' })(
	withAnalyticsEvents()(ColorPickerButton),
);
