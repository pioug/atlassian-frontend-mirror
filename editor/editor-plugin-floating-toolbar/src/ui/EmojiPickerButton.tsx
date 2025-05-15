/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiId } from '@atlaskit/emoji';
import { EmojiPicker } from '@atlaskit/emoji';
import EmojiAddIcon from '@atlaskit/icon/core/emoji-add';
import { fg } from '@atlaskit/platform-feature-flags';
import Tooltip from '@atlaskit/tooltip';

import { type FloatingToolbarPlugin } from '../floatingToolbarPluginType';

import EditorEmojiAddIcon from './EditorEmojiAddIcon';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const emojiPickerButtonWrapper = css({
	position: 'relative', // helps adjusts position of popup
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		top: '-1px', // adjust position of emoji icon when using the IconButtom component
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when picker has been selected
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	svg: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		path: {
			// adjust size of emoji icon when using the IconButtom component, otherwise it's too small
			transformOrigin: '50% 50%',
			transform: 'scale(1.14)',
		},
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const emojiPickerButtonWrapperVisualRefresh = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when picker has been selected
		},
	},
});

type EmojiPickerWithProviderProps = {
	pluginInjectionApi?: ExtractInjectionAPI<FloatingToolbarPlugin>;
	updateEmoji: (emoji: EmojiId) => void;
};

const useEmojiProvider = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<FloatingToolbarPlugin> | undefined) => {
		const emojiProvider = useSharedPluginStateSelector(api, 'emoji.emojiProvider');
		return emojiProvider ? Promise.resolve(emojiProvider) : undefined;
	},
	(api: ExtractInjectionAPI<FloatingToolbarPlugin> | undefined) => {
		const { emojiState } = useSharedPluginState(api, ['emoji']);
		return emojiState?.emojiProvider ? Promise.resolve(emojiState.emojiProvider) : undefined;
	},
);

const EmojiPickerWithProvider = (props: EmojiPickerWithProviderProps) => {
	const emojiProvider = useEmojiProvider(props.pluginInjectionApi);
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	if (!emojiProvider) {
		return null;
	}

	return (
		<EmojiPicker
			emojiProvider={emojiProvider}
			onSelection={props.updateEmoji}
			onPickerRef={setOutsideClickTargetRef}
		/>
	);
};

const EmojiPickerWithListener = withReactEditorViewOuterListeners(EmojiPickerWithProvider);

type EmojiPickerButtonReturnType = (props: {
	className?: string;
	editorView?: EditorView;
	idx?: number;
	providerFactory?: ProviderFactory;
	title?: string;
	onChange?: (emoji: EmojiId) => void;
	isSelected?: boolean;
	mountPoint?: HTMLElement;
	setDisableParentScroll?: (disable: boolean) => void;
	pluginInjectionApi?: ExtractInjectionAPI<FloatingToolbarPlugin>;
}) => JSX.Element;

export const EmojiPickerButton: EmojiPickerButtonReturnType = (props) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);

	React.useEffect(() => {
		if (props.setDisableParentScroll) {
			props.setDisableParentScroll(isPopupOpen);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPopupOpen]);

	const togglePopup = useCallback(() => {
		setIsPopupOpen(!isPopupOpen);
	}, [setIsPopupOpen, isPopupOpen]);

	const updateEmoji = (emoji: EmojiId) => {
		setIsPopupOpen(false);
		props.onChange && props.onChange(emoji);
		requestAnimationFrame(() => {
			props.editorView?.focus();
		});
	};

	const isDetachedElement = useCallback((el: HTMLElement) => !document.body.contains(el), []);

	const handleEmojiClickOutside = useCallback(
		(e: MouseEvent) => {
			// Ignore click events for detached elements.
			// Workaround for CETI-240 - where two onClicks fire - one when the upload button is
			// still in the document, and one once it's detached. Does not always occur, and
			// may be a side effect of a react render optimisation
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			if (e && e.target && !isDetachedElement(e.target as HTMLElement)) {
				togglePopup();
			}
		},
		[isDetachedElement, togglePopup],
	);

	const handleEmojiPressEscape = useCallback(() => {
		setIsPopupOpen(false);
		buttonRef.current?.focus();
	}, [setIsPopupOpen, buttonRef]);

	const renderPopup = () => {
		if (!buttonRef.current || !isPopupOpen) {
			return;
		}

		return (
			<Popup
				target={buttonRef.current}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				mountTo={props.setDisableParentScroll ? props.mountPoint : buttonRef.current.parentElement!}
				fitHeight={350}
				fitWidth={350}
				offset={[0, 10]}
				// Confluence inline comment editor has z-index: 500
				// if the toolbar is scrollable, this will be mounted in the root editor
				// we need an index of > 500 to display over it
				zIndex={props.setDisableParentScroll ? 600 : undefined}
				focusTrap
			>
				<EmojiPickerWithListener
					handleEscapeKeydown={handleEmojiPressEscape}
					handleClickOutside={handleEmojiClickOutside}
					pluginInjectionApi={props.pluginInjectionApi}
					updateEmoji={updateEmoji}
				/>
			</Popup>
		);
	};

	const title = props.title || '';

	return (
		<div
			css={
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('platform-visual-refresh-icons')
					? emojiPickerButtonWrapperVisualRefresh
					: emojiPickerButtonWrapper
			}
		>
			<Tooltip content={title} position="top">
				{
					<IconButton
						appearance="subtle"
						key={props.idx}
						onClick={togglePopup}
						ref={buttonRef}
						isSelected={props.isSelected}
						label={title}
						spacing="compact"
						icon={() => (
							<EmojiAddIcon
								color="currentColor"
								LEGACY_fallbackIcon={EditorEmojiAddIcon}
								label="emoji-picker-button"
								spacing="spacious"
							/>
						)}
					/>
				}
			</Tooltip>
			{renderPopup()}
		</div>
	);
};
