/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';

import type { BorderMarkAttributes } from '@atlaskit/adf-schema';
import { BorderIcon as LegacyBorderIcon } from '@atlaskit/editor-common/icons';
import { imageBorderMessages as messages } from '@atlaskit/editor-common/media';
import { DropdownMenuSharedCssClassName } from '@atlaskit/editor-common/styles';
import { type Icon } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	borderColorPalette,
	borderPaletteTooltipMessages,
	ColorPalette,
} from '@atlaskit/editor-common/ui-color';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	ArrowKeyNavigationProvider,
	ArrowKeyNavigationType,
	DropdownMenu,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';
import BorderIcon from '@atlaskit/icon/core/border';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import StrokeWeightMediumIcon from '@atlaskit/icon/core/stroke-weight-medium';
import StrokeWeightSmallIcon from '@atlaskit/icon/core/stroke-weight-small';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	buttonStyle,
	buttonWrapperStyle,
	contextualMenuArrow,
	contextualMenuColorIcon,
	contextualSubMenu,
	dropdownOptionButton,
	dropdownWrapper,
	itemSpacing,
	line,
	menuItemDimensions,
	toolbarButtonWrapper,
} from './styles';

export interface ImageBorderProps {
	borderMark?: BorderMarkAttributes;
	intl: IntlShape;
	setBorder: (attrs: Partial<BorderMarkAttributes>) => void;
	toggleBorder: () => void;
}

const ImageBorder = ({
	intl: { formatMessage },
	toggleBorder,
	borderMark,
	setBorder,
}: ImageBorderProps) => {
	const popupTarget = useRef<HTMLDivElement>(null);
	const dropDownColorOptionButton = useRef<HTMLButtonElement>(null);
	const dropDownSizeOptionButton = useRef<HTMLButtonElement>(null);
	const colorSubmenuRef = useRef<HTMLDivElement>(null);
	const sizeSubmenuRef = useRef<HTMLDivElement>(null);
	const openDropdownButtonRef = useRef<HTMLButtonElement>(null);
	const enabled = !!borderMark;
	const color = borderMark?.color;
	const size = borderMark?.size;
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenByKeyboard, setIsOpenedByKeyboard] = useState(false);
	const [isColorSubmenuOpen, setIsColorSubmenuOpen] = useState(false);
	const [isSizeSubmenuOpen, setIsSizeSubmenuOpen] = useState(false);

	const handleColorSubmenuEsc = useCallback(() => {
		setIsOpenedByKeyboard(false);
		setIsColorSubmenuOpen(false);
		dropDownColorOptionButton?.current?.focus();
	}, []);

	const handleSizeSubmenuEsc = useCallback(() => {
		setIsOpenedByKeyboard(false);
		setIsSizeSubmenuOpen(false);
		dropDownSizeOptionButton?.current?.focus();
	}, []);

	const handleSubMenuRef = (ref: HTMLDivElement | null) => {
		if (!ref) {
			return;
		}
		const rect = ref.getBoundingClientRect();
		if (rect.left + rect.width > window.innerWidth) {
			ref.style.left = `-${rect.width}px`;
		}
	};

	const handleTriggerByKeyboard = (event: React.KeyboardEvent, callback: () => void) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			callback();
			setIsOpenedByKeyboard(true);
		}
	};

	useEffect(() => {
		const focusFirstOption = (submenuRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
			if (!isOpenByKeyboard) {
				return;
			}
			if (isOpen && submenuRef.current) {
				const firstOption = submenuRef.current.querySelector('button');

				if (!firstOption) {
					return;
				}

				firstOption.focus();

				const keyboardEvent = new KeyboardEvent('keydown', {
					key: 'ArrowDown',
					bubbles: true,
				});

				firstOption.dispatchEvent(keyboardEvent);
			}
		};
		focusFirstOption(colorSubmenuRef, isColorSubmenuOpen);
		focusFirstOption(sizeSubmenuRef, isSizeSubmenuOpen);
	}, [isColorSubmenuOpen, isSizeSubmenuOpen, isOpenByKeyboard]);

	const borderSizeOptions: { icon: Icon; name: string; value: number }[] = [
		{
			name: formatMessage(messages.borderSizeSubtle),
			value: 1,
			icon: StrokeWeightSmallIcon,
		},
		{
			name: formatMessage(messages.borderSizeMedium),
			value: 2,
			icon: StrokeWeightMediumIcon,
		},
		{
			name: formatMessage(messages.borderSizeBold),
			value: 3,
			icon: StrokeWeightLargeIcon,
		},
	];

	const borderColorSelectStyles = () =>
		!fg('platform-visual-refresh-icons')
			? contextualMenuColorIcon(color && hexToEditorBorderPaletteColor(color))
			: contextualMenuArrow;

	const items: MenuItem[] = [
		{
			content: (
				<div>
					<button
						ref={dropDownColorOptionButton}
						type="button"
						aria-label={formatMessage(messages.borderColorDropdownAriaLabel)}
						data-testid="image-border-dropdown-button-color"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={[dropdownOptionButton]}
						aria-expanded={isColorSubmenuOpen}
						onKeyDown={(e) =>
							handleTriggerByKeyboard(e, () => setIsColorSubmenuOpen(!isColorSubmenuOpen))
						}
					>
						<Text>{formatMessage(messages.borderColor)}</Text>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<div css={borderColorSelectStyles} />
					</button>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={DropdownMenuSharedCssClassName.SUBMENU}
						ref={colorSubmenuRef}
					>
						{isColorSubmenuOpen && (
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							<div css={contextualSubMenu(0)} ref={handleSubMenuRef}>
								<ArrowKeyNavigationProvider
									type={ArrowKeyNavigationType.MENU}
									handleClose={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleColorSubmenuEsc();
									}}
									disableCloseOnArrowClick={true}
								>
									<ColorPalette
										onClick={(color: string) => {
											setBorder({ color });
											setIsOpen(!isOpen);
										}}
										onKeyDown={(color, _, event) => {
											if (event.key === 'Enter' || event.key === ' ') {
												setBorder({ color });
												setIsOpen(!isOpen);
												setIsColorSubmenuOpen(false);
												setIsSizeSubmenuOpen(false);
												openDropdownButtonRef.current?.focus();
											}
										}}
										selectedColor={color ?? null}
										paletteOptions={{
											palette: borderColorPalette,
											paletteColorTooltipMessages: borderPaletteTooltipMessages,
											hexToPaletteColor: hexToEditorBorderPaletteColor,
										}}
									/>
								</ArrowKeyNavigationProvider>
							</div>
						)}
					</div>
				</div>
			),
			'data-testid': 'dropdown-item__Color',
			key: 'dropdown-menu-image-border-color-button',
			value: { name: 'color' },
			'aria-label': '',
			wrapperTabIndex: null,
		},
		{
			content: (
				<div>
					<button
						type="button"
						aria-label={formatMessage(messages.borderSizeDropdownAriaLabel)}
						data-testid="image-border-dropdown-button-size"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={[dropdownOptionButton]}
						aria-expanded={isSizeSubmenuOpen}
						ref={dropDownSizeOptionButton}
						onKeyDown={(e) =>
							handleTriggerByKeyboard(e, () => setIsSizeSubmenuOpen(!isSizeSubmenuOpen))
						}
					>
						<Text>{formatMessage(messages.borderSize)}</Text>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<div css={contextualMenuArrow} />
					</button>

					<div
						//eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={DropdownMenuSharedCssClassName.SUBMENU}
						ref={sizeSubmenuRef}
					>
						{isSizeSubmenuOpen && (
							<ArrowKeyNavigationProvider
								type={ArrowKeyNavigationType.MENU}
								handleClose={(e) => {
									e.preventDefault();
									handleSizeSubmenuEsc();
								}}
								disableCloseOnArrowClick={true}
							>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<div css={contextualSubMenu(1)} ref={handleSubMenuRef}>
									{borderSizeOptions.map(({ name, value, icon }, idx) => {
										// Ignored via go/ees005
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										const ButtonIcon = icon as React.ComponentClass<any>;
										return (
											// Ignored via go/ees005
											// eslint-disable-next-line react/no-array-index-key
											<Tooltip key={idx} content={name}>
												{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
												<span css={buttonWrapperStyle}>
													<button
														type="button"
														/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */
														css={buttonStyle(value === size)}
														aria-label={name}
														role="radio"
														aria-checked={value === size}
														onClick={() => {
															setBorder({ size: value });
															setIsOpen(false);
														}}
														onKeyDown={(event) => {
															if (event.key === 'Enter' || event.key === ' ') {
																setBorder({ size: value });
																setIsOpen(false);
																setIsColorSubmenuOpen(false);
																setIsSizeSubmenuOpen(false);
																openDropdownButtonRef.current?.focus();
															}
														}}
														onMouseDown={(e) => {
															e.preventDefault();
														}}
													>
														{!fg('platform-visual-refresh-icons') ? (
															//eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
															<div css={line(value, value === size)} role="presentation" />
														) : (
															<ButtonIcon
																color={
																	value === size ? token('color.icon.inverse') : 'currentColor'
																}
																spacing="spacious"
																label={name}
															/>
														)}
													</button>
												</span>
											</Tooltip>
										);
									})}
								</div>
							</ArrowKeyNavigationProvider>
						)}
					</div>
				</div>
			),
			'data-testid': 'dropdown-item__Size',
			key: 'dropdown-menu-image-border-size-button',
			value: { name: 'size' },
			'aria-label': '',
			wrapperTabIndex: null,
		},
	];

	/**
	 * We want to change direction of our dropdowns a bit early,
	 * not exactly when it hits the boundary.
	 */
	const fitTolerance = 10;
	const fitWidth = menuItemDimensions.width;
	const fitHeight = items.length * (menuItemDimensions.height + itemSpacing);

	const isAnySubMenuOpen = isSizeSubmenuOpen || isColorSubmenuOpen;

	return (
		<div>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={toolbarButtonWrapper({
					enabled,
					isOpen,
				})}
			>
				<ToolbarButton
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className="image-border-toolbar-btn"
					selected={enabled}
					onClick={toggleBorder}
					spacing="compact"
					aria-label={
						enabled ? formatMessage(messages.removeBorder) : formatMessage(messages.addBorder)
					}
					iconBefore={
						<BorderIcon
							color="currentColor"
							label=""
							spacing="spacious"
							LEGACY_fallbackIcon={LegacyBorderIcon}
						/>
					}
					title={enabled ? formatMessage(messages.removeBorder) : formatMessage(messages.addBorder)}
				/>
				<div ref={popupTarget}>
					<ToolbarButton
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="image-border-toolbar-dropdown"
						ref={openDropdownButtonRef}
						selected={enabled || isOpen}
						aria-expanded={isOpen}
						aria-label={formatMessage(messages.borderOptions)}
						title={formatMessage(messages.borderOptions)}
						spacing="compact"
						iconBefore={
							<ChevronDownIcon
								color="currentColor"
								spacing="spacious"
								label=""
								LEGACY_fallbackIcon={ExpandIcon}
								size="small"
							/>
						}
						onClick={() => {
							setIsOpen(!isOpen);
							setIsOpenedByKeyboard(false);
						}}
						onKeyDown={(e) => handleTriggerByKeyboard(e, () => setIsOpen(!isOpen))}
					/>
				</div>
			</div>
			<Popup
				target={popupTarget.current ? popupTarget.current : undefined}
				fitWidth={fitWidth + fitTolerance}
				fitHeight={fitHeight + fitTolerance}
				forcePlacement={true}
				stick={true}
			>
				{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
				<div
					// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
					onMouseLeave={() => {
						setIsColorSubmenuOpen(false);
						setIsSizeSubmenuOpen(false);
					}}
					/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */
					css={dropdownWrapper}
				>
					<DropdownMenu
						//This needs be removed when the a11y is completely handled
						//Disabling key navigation now as it works only partially
						//Same with packages/editor/editor-plugin-table/src/plugins/table/ui/FloatingContextualMenu/ContextualMenu.tsx
						arrowKeyNavigationProviderOptions={{
							type: ArrowKeyNavigationType.MENU,
							disableArrowKeyNavigation: isAnySubMenuOpen,
						}}
						allowEnterDefaultBehavior={isAnySubMenuOpen}
						handleEscapeKeydown={
							isAnySubMenuOpen
								? () => {
										return;
									}
								: () => {
										openDropdownButtonRef.current?.focus();
									}
						}
						items={[{ items }]}
						isOpen={isOpen}
						shouldFocusFirstItem={() => isOpenByKeyboard}
						onOpenChange={() => {
							setIsOpen(false);
							setIsColorSubmenuOpen(false);
							setIsSizeSubmenuOpen(false);
							setIsOpenedByKeyboard(false);
						}}
						onItemActivated={({ item }) => {
							if (item.value.name === 'color') {
								setIsColorSubmenuOpen(!isColorSubmenuOpen);
							}
							if (item.value.name === 'size') {
								setIsSizeSubmenuOpen(!isSizeSubmenuOpen);
							}
						}}
						onMouseEnter={({ item }) => {
							if (item.value.name === 'color') {
								setIsColorSubmenuOpen(true);
								setIsOpenedByKeyboard(false);
							}
							if (item.value.name === 'size') {
								setIsSizeSubmenuOpen(true);
								setIsOpenedByKeyboard(false);
							}
						}}
						onMouseLeave={({ item }) => {
							if (item.value.name === 'color') {
								setIsColorSubmenuOpen(false);
							}
							if (item.value.name === 'size') {
								setIsSizeSubmenuOpen(false);
							}
						}}
						fitWidth={fitWidth + fitTolerance}
						fitHeight={fitHeight + fitTolerance}
					/>
				</div>
			</Popup>
		</div>
	);
};

export default ImageBorder;
