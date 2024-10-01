/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { withReactEditorViewOuterListeners } from '@atlaskit/editor-common/ui-react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiId } from '@atlaskit/emoji';
import { EmojiPicker } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';

import { type FloatingToolbarPlugin } from '../types';

import EditorEmojiAddIcon from './EditorEmojiAddIcon';

// helps adjusts position of popup
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const emojiPickerButtonWrapper = css({
	position: 'relative',
});

const EmojiPickerWithListener = withReactEditorViewOuterListeners(EmojiPicker);

export const EmojiPickerButton = (props: {
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
}) => {
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const [isPopupOpen, setIsPopupOpen] = React.useState(false);

	React.useEffect(() => {
		if (props.setDisableParentScroll) {
			props.setDisableParentScroll(isPopupOpen);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPopupOpen]);

	const togglePopup = () => {
		setIsPopupOpen(!isPopupOpen);
	};

	const updateEmoji = (emoji: EmojiId) => {
		setIsPopupOpen(false);
		props.onChange && props.onChange(emoji);
		requestAnimationFrame(() => {
			props.editorView?.focus();
		});
	};

	const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);

	const handleEmojiClickOutside = (e: MouseEvent) => {
		// Ignore click events for detached elements.
		// Workaround for CETI-240 - where two onClicks fire - one when the upload button is
		// still in the document, and one once it's detached. Does not always occur, and
		// may be a side effect of a react render optimisation
		if (e && e.target && !isDetachedElement(e.target as HTMLElement)) {
			togglePopup();
		}
	};

	const handleEmojiPressEscape = () => {
		setIsPopupOpen(false);
		buttonRef.current?.focus();
	};

	const EmojiPickerWithProvider = () => {
		const { emojiState } = useSharedPluginState(props.pluginInjectionApi, ['emoji']);
		const emojiProvider = emojiState?.emojiProvider
			? Promise.resolve(emojiState?.emojiProvider)
			: undefined;

		if (!emojiProvider) {
			return null;
		}

		return (
			<EmojiPickerWithListener
				emojiProvider={emojiProvider}
				onSelection={updateEmoji}
				onPickerRef={() => {}}
				handleClickOutside={handleEmojiClickOutside}
				handleEscapeKeydown={handleEmojiPressEscape}
			/>
		);
	};

	const renderPopup = () => {
		if (!buttonRef.current || !isPopupOpen) {
			return;
		}

		return (
			<Popup
				target={buttonRef.current}
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
				<EmojiPickerWithProvider />
			</Popup>
		);
	};

	const title = props.title || '';

	return (
		<div css={emojiPickerButtonWrapper}>
			<Tooltip content={title} position="top">
				<Button
					appearance={'subtle'}
					key={props.idx}
					// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						margin: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'flex',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						height: '24px',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						width: '24px',
					}}
					onClick={togglePopup}
					ref={buttonRef}
					isSelected={props.isSelected}
					aria-label={title}
					iconBefore={<EditorEmojiAddIcon />}
				/>
			</Tooltip>
			{renderPopup()}
		</div>
	);
};
