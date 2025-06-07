/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	type PropsWithChildren,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { css, cssMap, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { type OnEmojiEvent, type PickerSize } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import {
	Manager,
	Popper,
	Reference,
	type PopperProps,
	type PopperChildrenProps,
	type Placement,
} from '@atlaskit/popper';
import { layers } from '@atlaskit/theme/constants';
import { Box } from '@atlaskit/primitives/compiled';
import { fg } from '@atlaskit/platform-feature-flags';

import { useCloseManagerV2 } from '../hooks/useCloseManager';
import { useDelayedState } from '../hooks/useDelayedState';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { messages } from '../shared/i18n';
import { type ReactionSource } from '../types';
import { PickerRender } from '../ufo';
import { Selector, type SelectorProps } from './Selector';
import { Trigger, type TriggerProps } from './Trigger';
import { RepositionOnUpdate } from './RepositionOnUpdate';

import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Portal from '@atlaskit/portal';

const pickerStyle = css({
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.miniMode': {
		display: 'inline-block',
	},
});

const popupWrapperStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
});

const popupStyle = css({
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&> div': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: undefined,
		marginBottom: token('space.050', '4px'),
	},
});
const popupStyleWithMarginTop = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&> div': {
		marginTop: token('space.050', '4px'),
	},
});

const additionalStyles = cssMap({
	selectorContainer: {
		display: 'flex',
	},
});

/**
 * Test id for wrapper ReactionPicker div
 */
export const RENDER_REACTIONPICKER_TESTID = 'reactionPicker-testid';

/**
 * Test id for ReactionPicker panel div
 */
export const RENDER_REACTIONPICKERPANEL_TESTID = 'reactionPickerPanel-testid';

/**
 * Emoji Picker Controller Id for Accessibility Labels
 */
const PICKER_CONTROL_ID = 'emoji-picker';

export interface ReactionPickerProps
	extends Pick<SelectorProps, 'pickerQuickReactionEmojiIds'>,
		Partial<Pick<TriggerProps, 'tooltipContent' | 'miniMode'>> {
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
	/**
	 * Event callback when an emoji button is selected
	 * @param emojiId emoji unique id
	 * @param source source where the reaction was picked (either the initial default reactions or the custom reactions picker)
	 */
	onSelection: (emojiId: string, source: ReactionSource) => void;
	/**
	 * Optional class name
	 */
	className?: string;
	/**
	 * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
	 */
	allowAllEmojis?: boolean;
	/**
	 * Enable/Disable the button to be clickable (defaults to false)
	 */
	disabled?: boolean;
	/**
	 * Optional event handler when the emoji picker is opened
	 */
	onOpen?: () => void;
	/**
	 * Optional event handler when the emoji picker is clicked outside and closed
	 */
	onCancel?: () => void;
	/**
	 * Optional event handler when the custom emoji picker icon is selected
	 */
	onShowMore?: () => void;
	/**
	 * Optional emoji picker size to control the size of emoji picker
	 */
	emojiPickerSize?: PickerSize;
	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;
	/**
	 * Optional prop for applying subtle styling to reaction summary and picker
	 */
	subtleReactionsSummaryAndPicker?: boolean;
	/**
	 * Optional prop for displaying text to add a reaction
	 */
	showAddReactionText?: boolean;
	/**
	 * Optional prop for controlling the picker location
	 */
	reactionPickerPlacement?: Placement;
	/**
	 * Optional prop for controlling icon inside Trigger
	 */
	reactionPickerTriggerIcon?: React.ReactNode;
	/**
	 * Optional prop for controlling text of the trigger button
	 */
	reactionPickerTriggerText?: string;
	/**
	 * Optional prop to say if the reactions component is in a list
	 */
	isListItem?: boolean;
	/**
	 * Optional prop for hoverable reaction picker
	 */
	hoverableReactionPicker?: boolean;
	/**
	 * Optional prop to set a delay for the reaction picker when it opens/closes on hover
	 */
	hoverableReactionPickerDelay?: number;
	/**
	 * Optional prop to set the strategy of the reaction picker popup
	 */
	reactionPickerStrategy?: PopperProps<{}>['strategy'];
}

/**
 * Picker component for adding reactions
 */
export const ReactionPicker = React.memo((props: ReactionPickerProps) => {
	const {
		miniMode,
		className,
		emojiProvider,
		onSelection,
		allowAllEmojis,
		disabled,
		pickerQuickReactionEmojiIds,
		onShowMore = () => {},
		onOpen = () => {},
		onCancel = () => {},
		tooltipContent = <FormattedMessage {...messages.addReaction} />,
		emojiPickerSize,
		showOpaqueBackground = false,
		subtleReactionsSummaryAndPicker = false,
		showAddReactionText = false,
		reactionPickerTriggerIcon,
		reactionPickerTriggerText,
		reactionPickerPlacement,
		isListItem = false,
		hoverableReactionPicker = false,
		hoverableReactionPickerDelay = 0,
	} = props;

	const [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);
	const [isHoverableReactionPickerEmojiPickerOpen, setIsHoverableReactionPickerEmojiPickerOpen] =
		useState(false);
	const [isHoveringTrigger, setIsHoveringTrigger] = useState(false);
	const [isHoveringPopup, setIsHoveringPopup] = useState(false);
	const [isTriggerClicked, setIsTriggerClicked] = useState(false);
	const [isPopupTrayOpen, setIsPopupTrayOpen] = useDelayedState<boolean>(
		false,
		hoverableReactionPickerDelay,
	);

	/**
	 * Container <div /> reference (used by custom hook to detect click outside)
	 */
	const wrapperRef = useRef<HTMLDivElement>(null);

	const updatePopper = useRef<PopperChildrenProps['update']>();

	const popperPlacement = reactionPickerPlacement || 'bottom-start';

	const popperModifiers: PopperProps<{}>['modifiers'] = [
		/**
	   Removing this applyStyle modifier as it throws client errors ref:
	  https://popper.js.org/docs/v1/#modifiers
	  https://popper.js.org/docs/v1/#modifiers..applyStyle
	  { name: 'applyStyle', enabled: false },
	   */
		{
			name: 'hide',
			enabled: false,
		},
		{
			name: 'offset',
			enabled: true,
			options: {
				offset: [0, fg('platform-reactions-offset-based-popper') ? 4 : 0],
			},
		},
		{
			name: 'flip',
			enabled: true,
			options: {
				flipVariations: true,
				boundariesElement: 'scrollParent',
			},
		},
	];

	const [settings, setSettings] = useState({
		/**
		 * Show the full custom emoji list picker or the default list of emojis
		 */
		showFullPicker:
			!!allowAllEmojis &&
			Array.isArray(pickerQuickReactionEmojiIds) &&
			pickerQuickReactionEmojiIds.length === 0,
		/**
		 * Use placement for popper based on reactionPickerPlacement prop
		 */
		popperPlacement,
	});

	/**
	 * Event callback when the picker is closed
	 * @param _id Optional id if an emoji button was selected or undefineed if was clicked outside the picker
	 */
	const close = useCallback(
		(_id?: string) => {
			setIsPopupTrayOpen(false, true);
			// ufo abort reaction experience
			PickerRender.abort({
				metadata: {
					emojiId: _id,
					source: 'ReactionPicker',
					reason: 'close dialog',
				},
			});
			if (hoverableReactionPicker) {
				setIsHoverableReactionPickerEmojiPickerOpen(false);
				setIsTriggerClicked(false);
				setIsHoveringTrigger(false);
				setIsHoveringPopup(false);
			}
		},
		[
			setIsPopupTrayOpen,
			setIsHoverableReactionPickerEmojiPickerOpen,
			hoverableReactionPicker,
			setIsTriggerClicked,
			setIsHoveringTrigger,
			setIsHoveringPopup,
		],
	);

	/**
	 * Event handle rwhen selecting to show the custom emoji icons picker
	 * @param e event param
	 */
	const onSelectMoreClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			setSettings({
				showFullPicker: hoverableReactionPicker ? settings.showFullPicker : true,
				popperPlacement,
			});
			setIsPopupTrayOpen(true);
			if (hoverableReactionPicker) {
				setIsHoverableReactionPickerEmojiPickerOpen(!isHoverableReactionPickerEmojiPickerOpen);
				setIsTriggerClicked(false);
			}
			onShowMore();
		},
		[
			settings.showFullPicker,
			setIsPopupTrayOpen,
			onShowMore,
			popperPlacement,
			hoverableReactionPicker,
			setIsHoverableReactionPickerEmojiPickerOpen,
			isHoverableReactionPickerEmojiPickerOpen,
		],
	);

	/**
	 * Event callback when an emoji icon is selected
	 * @param item selected item
	 */
	const onEmojiSelected: OnEmojiEvent = useCallback(
		(item) => {
			// no emoji was selected
			if (!item.id) {
				return;
			}
			onSelection(
				item.id,
				settings.showFullPicker ||
					(hoverableReactionPicker && isHoverableReactionPickerEmojiPickerOpen)
					? 'emojiPicker'
					: 'quickSelector',
			);
			close(item.id);
		},
		[
			close,
			onSelection,
			settings.showFullPicker,
			hoverableReactionPicker,
			isHoverableReactionPickerEmojiPickerOpen,
		],
	);

	/**
	 * Event handler when the emoji icon to open the custom picker is selected
	 */
	const onTriggerClick = useCallback(() => {
		// ufo start reactions picker open experience
		PickerRender.start();

		setSettings({
			...settings,
			popperPlacement,
		});

		if (hoverableReactionPicker) {
			if (isHoverableReactionPickerEmojiPickerOpen || isTriggerClicked) {
				// if either the emoji picker is open or the trigger was clicked, close the popup and reset the state
				setIsTriggerClicked(false);
				setIsPopupTrayOpen(false, true);
			} else {
				// if neither condition is true, open the popup and set the state
				setIsTriggerClicked(true);
				setIsPopupTrayOpen(true, true);
			}
			// close the emoji picker
			setIsHoverableReactionPickerEmojiPickerOpen(false);
		} else {
			setIsPopupTrayOpen(!isPopupTrayOpen);
		}

		onOpen();
		// ufo reactions picker opened success
		PickerRender.success();
	}, [
		hoverableReactionPicker,
		isPopupTrayOpen,
		setIsPopupTrayOpen,
		isTriggerClicked,
		setIsTriggerClicked,
		isHoverableReactionPickerEmojiPickerOpen,
		onOpen,
		settings,
		popperPlacement,
	]);

	const handleTriggerMouseEnter = useCallback(() => {
		if (hoverableReactionPicker) {
			setIsHoveringTrigger(true);
			if (!isHoverableReactionPickerEmojiPickerOpen) {
				setIsPopupTrayOpen(true);
			}
		}
	}, [hoverableReactionPicker, isHoverableReactionPickerEmojiPickerOpen, setIsPopupTrayOpen]);

	const handleTriggerMouseLeave = useCallback(() => {
		if (hoverableReactionPicker) {
			setIsHoveringTrigger(false);
			if (!isHoveringPopup && !isHoverableReactionPickerEmojiPickerOpen && !isTriggerClicked) {
				setIsPopupTrayOpen(false);
			}
		}
	}, [
		hoverableReactionPicker,
		isHoveringPopup,
		isHoverableReactionPickerEmojiPickerOpen,
		setIsPopupTrayOpen,
		isTriggerClicked,
	]);

	const handlePopupMouseEnter = useCallback(() => {
		if (hoverableReactionPicker) {
			setIsHoveringPopup(true);
			if (!isHoverableReactionPickerEmojiPickerOpen) {
				setIsPopupTrayOpen(true);
			}
		}
	}, [hoverableReactionPicker, isHoverableReactionPickerEmojiPickerOpen, setIsPopupTrayOpen]);

	const handlePopupMouseLeave = useCallback(() => {
		if (hoverableReactionPicker) {
			setIsHoveringPopup(false);
			if (!isHoveringTrigger && !isHoverableReactionPickerEmojiPickerOpen && !isTriggerClicked) {
				setIsPopupTrayOpen(false);
			}
		}
	}, [
		hoverableReactionPicker,
		isHoveringTrigger,
		isHoverableReactionPickerEmojiPickerOpen,
		setIsPopupTrayOpen,
		isTriggerClicked,
	]);

	const wrapperClassName = ` ${isPopupTrayOpen ? 'isOpen' : ''} ${
		miniMode ? 'miniMode' : ''
	} ${className}`;

	useLayoutEffect(() => {
		updatePopper.current?.();
	}, [settings]);

	const onClose = () => {
		close();
		onCancel();
	};

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={wrapperClassName}
			css={pickerStyle}
			data-testid={RENDER_REACTIONPICKER_TESTID}
			ref={wrapperRef}
		>
			<Manager>
				<Reference>
					{({ ref }) => (
						// Render a button to open the <Selector /> panel
						<Box onMouseEnter={handleTriggerMouseEnter} onMouseLeave={handleTriggerMouseLeave}>
							<Trigger
								ariaAttributes={{
									'aria-expanded': isPopupTrayOpen,
									'aria-controls': PICKER_CONTROL_ID,
								}}
								ref={(node: HTMLButtonElement | null) => {
									if (node && isPopupTrayOpen) {
										if (typeof ref === 'function') {
											ref(node);
										} else {
											(ref as React.MutableRefObject<HTMLButtonElement>).current = node;
										}
										setTriggerRef(node);
									}
								}}
								isSelected={isPopupTrayOpen}
								onClick={onTriggerClick}
								miniMode={miniMode}
								disabled={disabled}
								tooltipContent={isPopupTrayOpen ? null : tooltipContent}
								showOpaqueBackground={showOpaqueBackground}
								showAddReactionText={showAddReactionText}
								subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
								reactionPickerTriggerIcon={reactionPickerTriggerIcon}
								reactionPickerTriggerText={reactionPickerTriggerText}
								isListItem={isListItem}
							/>
						</Box>
					)}
				</Reference>
				{isPopupTrayOpen && (
					<Portal zIndex={layers.layer()}>
						<PopperWrapper
							settings={settings}
							popperModifiers={popperModifiers}
							isOpen={isPopupTrayOpen}
							onClose={onClose}
							triggerRef={triggerRef}
						>
							{settings.showFullPicker ||
							(hoverableReactionPicker && isHoverableReactionPickerEmojiPickerOpen) ? (
								<EmojiPicker
									emojiProvider={emojiProvider}
									onSelection={onEmojiSelected}
									size={emojiPickerSize}
								/>
							) : (
								<Box
									xcss={additionalStyles.selectorContainer}
									onMouseEnter={handlePopupMouseEnter}
									onMouseLeave={handlePopupMouseLeave}
								>
									<Selector
										emojiProvider={emojiProvider}
										onSelection={onEmojiSelected}
										showMore={allowAllEmojis}
										onMoreClick={onSelectMoreClick}
										pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
										hoverableReactionPickerSelector={hoverableReactionPicker}
									/>
								</Box>
							)}
						</PopperWrapper>
					</Portal>
				)}
			</Manager>
		</div>
	);
});

export interface PopperWrapperProps {
	triggerRef: HTMLDivElement | HTMLButtonElement | null;
	settings: {
		showFullPicker: boolean;
		popperPlacement: Placement;
	};
	isOpen: boolean;
	onClose: () => void;
	popperModifiers?: PopperProps<{}>['modifiers'];
}

export const PopperWrapper = (props: PropsWithChildren<PopperWrapperProps>) => {
	const { triggerRef, settings, isOpen, onClose, children, popperModifiers } = props;
	const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
	const { formatMessage } = useIntl();
	/**
	 * add focus lock to popup
	 */
	useFocusTrap({ initialFocusRef: null, targetRef: popupRef });

	/**
	 * Custom hook triggers when user clicks outside the reactions picker
	 */
	useCloseManagerV2(
		popupRef,
		triggerRef,
		(callbackType) => {
			onClose();
			if (popupRef && callbackType === 'ESCAPE') {
				requestAnimationFrame(() => triggerRef?.focus());
			}
		},
		true,
		isOpen,
	);
	return (
		<Popper placement={settings.popperPlacement} modifiers={popperModifiers}>
			{({ ref, style, update }) => {
				return (
					<div
						role="group"
						aria-label={formatMessage(messages.popperWrapperLabel)}
						id={PICKER_CONTROL_ID}
						data-testid={RENDER_REACTIONPICKERPANEL_TESTID}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ zIndex: layers.layer(), ...style }}
						ref={(node: HTMLDivElement) => {
							if (node) {
								if (typeof ref === 'function') {
									ref(node);
								} else {
									(ref as React.MutableRefObject<HTMLElement>).current = node;
								}
								setPopupRef(node);
							}
						}}
						css={popupWrapperStyle}
						// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
						tabIndex={0}
					>
						<RepositionOnUpdate update={update} settings={settings}>
							<div
								css={[
									popupStyle,
									!fg('platform-reactions-offset-based-popper') && popupStyleWithMarginTop,
								]}
							>
								{children}
							</div>
						</RepositionOnUpdate>
					</div>
				);
			}}
		</Popper>
	);
};
