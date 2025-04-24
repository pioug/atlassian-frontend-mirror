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
import { css, jsx } from '@compiled/react';
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

import { useCloseManager } from '../hooks/useCloseManager';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { messages } from '../shared/i18n';
import { type ReactionSource } from '../types';
import { PickerRender } from '../ufo';
import { Selector, type SelectorProps } from './Selector';
import { Trigger, type TriggerProps } from './Trigger';

import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const pickerStyle = css({
	verticalAlign: 'middle',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.miniMode': {
		display: 'inline-block',
	},
});

const contentStyle = css({
	display: 'flex',
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
		marginTop: token('space.050', '4px'),
		marginBottom: token('space.050', '4px'),
	},
});

import { RepositionOnUpdate } from './RepositionOnUpdate';

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
	 * Optional prop for controlling if the picker hover border will be rounded
	 */
	showRoundTrigger?: boolean;
	/**
	 * Optional prop for controlling the picker location, gets overrided by showRoundTrigger
	 */
	reactionPickerPlacement?: Placement;
	/**
	 * Optional prop for controlling the overflow of the reaction picker
	 */
	reactionsPickerPreventOverflowOptions?: Record<string, any>;
	/**
	 * Optional prop for controlling icon inside Trigger
	 */
	reactionPickerTriggerIcon?: React.ReactNode;
	/**
	 * Optional prop for controlling text of the trigger button
	 */
	reactionPickerTriggerText?: string;
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
		showRoundTrigger = false,
		reactionPickerTriggerIcon,
		reactionPickerTriggerText,
		reactionPickerPlacement,
		reactionsPickerPreventOverflowOptions,
	} = props;

	const [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

	/**
	 * Container <div /> reference (used by custom hook to detect click outside)
	 */
	const wrapperRef = useRef<HTMLDivElement>(null);

	const updatePopper = useRef<PopperChildrenProps['update']>();

	const popperPlacement = showRoundTrigger ? 'left' : reactionPickerPlacement || 'bottom-start';

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
				offset: [0, 0],
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
		{
			name: 'preventOverflow',
			enabled: true,
			...(reactionsPickerPreventOverflowOptions && {
				options: reactionsPickerPreventOverflowOptions,
			}),
		},
	];

	const [settings, setSettings] = useState({
		/**
		 * Show the picker floating panel
		 */
		isOpen: false,
		/**
		 * Show the full custom emoji list picker or the default list of emojis
		 */
		showFullPicker:
			!!allowAllEmojis &&
			Array.isArray(pickerQuickReactionEmojiIds) &&
			pickerQuickReactionEmojiIds.length === 0,
		/**
		 * Use left placement for popper - using value based on showRoundTrigger for now since it needs the left placement
		 */
		popperPlacement,
	});

	/**
	 * Custom hook triggers when user clicks outside the reactions picker
	 */
	useCloseManager(
		wrapperRef,
		(callbackType) => {
			close();
			onCancel();
			if (triggerRef && callbackType === 'ESCAPE') {
				requestAnimationFrame(() => triggerRef.focus());
			}
		},
		true,
		settings.isOpen,
	);

	/**
	 * Event callback when the picker is closed
	 * @param _id Optional id if an emoji button was selected or undefineed if was clicked outside the picker
	 */
	const close = useCallback(
		(_id?: string) => {
			setSettings({
				...settings,
				isOpen: false,
			});
			// ufo abort reaction experience
			PickerRender.abort({
				metadata: {
					emojiId: _id,
					source: 'ReactionPicker',
					reason: 'close dialog',
				},
			});
		},
		[settings],
	);

	/**
	 * Event handle rwhen selecting to show the custom emoji icons picker
	 * @param e event param
	 */
	const onSelectMoreClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			setSettings({
				isOpen: true,
				showFullPicker: true,
				popperPlacement,
			});
			onShowMore();
		},
		[onShowMore, popperPlacement],
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
			onSelection(item.id, settings.showFullPicker ? 'emojiPicker' : 'quickSelector');
			close(item.id);
		},
		[close, onSelection, settings.showFullPicker],
	);

	/**
	 * Event handler when the emoji icon to open the custom picker is selected
	 */
	const onTriggerClick = () => {
		// ufo start reactions picker open experience
		PickerRender.start();

		setSettings({
			isOpen: !settings.isOpen,
			showFullPicker:
				!!allowAllEmojis &&
				Array.isArray(pickerQuickReactionEmojiIds) &&
				pickerQuickReactionEmojiIds.length === 0,
			popperPlacement,
		});

		onOpen();
		// ufo reactions picker opened success
		PickerRender.success();
	};

	const wrapperClassName = ` ${settings.isOpen ? 'isOpen' : ''} ${
		miniMode ? 'miniMode' : ''
	} ${className}`;

	useLayoutEffect(() => {
		updatePopper.current?.();
	}, [settings]);

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
						<Trigger
							ariaAttributes={{
								'aria-expanded': settings.isOpen,
								'aria-controls': PICKER_CONTROL_ID,
							}}
							ref={(node: HTMLButtonElement | null) => {
								if (node && settings.isOpen) {
									if (typeof ref === 'function') {
										ref(node);
									} else {
										(ref as React.MutableRefObject<HTMLButtonElement>).current = node;
									}
									setTriggerRef(node);
								}
							}}
							isSelected={settings.isOpen}
							onClick={onTriggerClick}
							miniMode={miniMode}
							disabled={disabled}
							tooltipContent={settings.isOpen ? null : tooltipContent}
							showOpaqueBackground={showOpaqueBackground}
							showAddReactionText={showAddReactionText}
							subtleReactionsSummaryAndPicker={subtleReactionsSummaryAndPicker}
							showRoundTrigger={showRoundTrigger}
							reactionPickerTriggerIcon={reactionPickerTriggerIcon}
							reactionPickerTriggerText={reactionPickerTriggerText}
						/>
					)}
				</Reference>
				{settings.isOpen && (
					<PopperWrapper settings={settings} popperModifiers={popperModifiers}>
						{settings.showFullPicker ? (
							<EmojiPicker
								emojiProvider={emojiProvider}
								onSelection={onEmojiSelected}
								size={emojiPickerSize}
							/>
						) : (
							<div css={contentStyle}>
								<Selector
									emojiProvider={emojiProvider}
									onSelection={onEmojiSelected}
									showMore={allowAllEmojis}
									onMoreClick={onSelectMoreClick}
									pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
								/>
							</div>
						)}
					</PopperWrapper>
				)}
			</Manager>
		</div>
	);
});

export interface PopperWrapperProps {
	settings: {
		isOpen: boolean;
		showFullPicker: boolean;
		popperPlacement: Placement;
	};
	popperModifiers?: PopperProps<{}>['modifiers'];
}

export const PopperWrapper = (props: PropsWithChildren<PopperWrapperProps>) => {
	const { settings, children, popperModifiers } = props;
	const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);
	const { formatMessage } = useIntl();
	/**
	 * add focus lock to popup
	 */
	useFocusTrap({ initialFocusRef: null, targetRef: popupRef });
	return (
		<Popper placement={settings.popperPlacement} modifiers={popperModifiers} strategy="absolute">
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
							<div css={popupStyle}>{children}</div>
						</RepositionOnUpdate>
					</div>
				);
			}}
		</Popper>
	);
};
