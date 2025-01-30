/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, KeyboardEvent } from 'react';
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import EditIcon from '@atlaskit/icon/core/edit';
import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const buttonContainerStyles = css({
	opacity: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	position: 'absolute',
	width: 'max-content',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-28px',
	display: 'inline-flex',
	justifyContent: 'flex-end',
	color: token('color.text.subtle'),
});

const buttonStyles = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	boxShadow: `0 0 0 1px ${token('color.border')}`,
	minHeight: token('space.300'),
	borderRadius: token('border.radius'),
	paddingLeft: token('space.150'),
	paddingRight: token('space.150'),
	font: token('font.body'),
	'&:hover': {
		backgroundColor: token('color.background.input.hovered'),
	},
	outlineColor: token('color.border.focused'),
	border: 'none',
	backgroundColor: token('color.background.input'),
	color: token('color.text.subtle'),
});

const showButtonContainerStyle = css({
	opacity: 1,
});

const iconStyles = xcss({
	marginRight: 'space.075',
});

const i18n = defineMessages({
	doneEditing: {
		id: 'editor-common-extensibility-extension-lozenge-editToggle.done.editing',
		defaultMessage: 'Done editing',
		description: 'Text in button when on click switches back to view mode of a macro',
	},
	makeEdits: {
		id: 'editor-common-extensibility-extension-lozenge-editToggle.make.edits',
		defaultMessage: 'Make edits',
		description: 'Text in button when on click switches back to edit mode of a macro',
	},
});

type EditToggleProps = {
	isNodeHovered?: boolean;
	customContainerStyles?: CSSProperties;
	setIsNodeHovered?: (isNodeHovered: boolean) => void;
	showBodiedExtensionRendererView?: boolean;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
};

// Used to toggle between edit and renderer mode for bodied macros in live pages
export const EditToggle = ({
	isNodeHovered,
	customContainerStyles,
	setIsNodeHovered,
	showBodiedExtensionRendererView,
	setShowBodiedExtensionRendererView,
}: EditToggleProps) => {
	const intl = useIntl();

	const text = showBodiedExtensionRendererView
		? intl.formatMessage(i18n.makeEdits)
		: intl.formatMessage(i18n.doneEditing);
	const icon = showBodiedExtensionRendererView ? (
		<EditIcon testId="edit-icon" label="" />
	) : (
		<CheckMarkIcon testId="check-mark-icon" label="" />
	);

	const handleClick = useCallback(() => {
		setShowBodiedExtensionRendererView?.(!showBodiedExtensionRendererView);
	}, [showBodiedExtensionRendererView, setShowBodiedExtensionRendererView]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				handleClick();
			}
		},
		[handleClick],
	);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			data-testid="extension-edit-toggle-container"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			css={
				isNodeHovered ? [buttonContainerStyles, showButtonContainerStyle] : buttonContainerStyles
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={customContainerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="extension-edit-toggle-container"
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			onMouseOver={() => setIsNodeHovered?.(true)}
			onMouseLeave={() => setIsNodeHovered?.(false)}
			tabIndex={-1}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-button */}
			<button
				type="button"
				data-testid="edit-toggle"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				css={buttonStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="extension-edit-toggle"
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsNodeHovered?.(true)}
				onBlur={() => setIsNodeHovered?.(false)}
			>
				<Flex as="span" xcss={iconStyles}>
					{icon}
				</Flex>
				{text}
			</button>
		</div>
	);
};
