/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';
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
	lineHeight: 1,
	position: 'absolute',
	width: 'max-content',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-19px',
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
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},
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

	return (
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
			onMouseOver={() => setIsNodeHovered?.(true)}
			onMouseLeave={() => setIsNodeHovered?.(false)}
		>
			<span
				data-testid="edit-toggle"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				css={buttonStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="extension-edit-toggle"
				onClick={handleClick}
			>
				<Flex as="span" xcss={iconStyles}>
					{icon}
				</Flex>
				{text}
			</span>
		</div>
	);
};
