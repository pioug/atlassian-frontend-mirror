/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { type BlockProps } from '../types';
import { renderChildren } from '../utils';

const baseBlockStyles = css({
	alignItems: 'center',
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
	'&:empty': {
		display: 'none',
	},
	justifyContent: 'flex-start',
	'[data-separator] + [data-separator]::before': {
		content: "'•'",
		color: token('color.border'),
	},
	"[data-separator][data-smart-element='SourceBranch'] + [data-separator][data-smart-element='TargetBranch']::before":
		{
			content: "'→'",
			color: token('color.icon.subtle'),
		},
	"[data-separator][data-smart-element='TargetBranch'] + [data-separator][data-smart-element='SourceBranch']::before":
		{
			content: "'←'",
			color: token('color.icon.subtle'),
		},
});

const highlightRemoveStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
	outline: 'none !important',
	outlineColor: 'inherit',
	color: 'inherit',
	'-webkit-tap-highlight-color': 'transparent',
	'-webkit-touch-callout': 'none',
	'-webkit-user-select': 'none',
	'-moz-user-select': 'none',
	'-ms-user-select': 'none',
	userSelect: 'none',
});

const gapStyles = cssMap({
	xlarge: {
		gap: token('space.250'),
		'[data-separator] + [data-separator]::before': {
			marginRight: token('space.250'),
		},
	},
	large: {
		gap: token('space.200'),
		'[data-separator] + [data-separator]::before': {
			marginRight: token('space.200'),
		},
	},
	medium: {
		gap: token('space.100'),
		'[data-separator] + [data-separator]::before': {
			marginRight: token('space.100'),
		},
	},
	small: {
		gap: token('space.050'),
		'[data-separator] + [data-separator]::before': {
			marginRight: token('space.050'),
		},
	},
});

const directionStyles = cssMap({
	vertical: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	horizontal: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

/**
 * A block represents a collection of elements and actions that are arranged
 * in a row. All elements and actions should be contained within a Block.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const Block = ({
	children,
	direction = SmartLinkDirection.Horizontal,
	size = SmartLinkSize.Medium,
	testId = 'smart-block',
	className,
	blockRef,
	onRender,
	onTransitionEnd,
	style,
	placeholderId,
}: BlockProps) => {
	useEffect(() => {
		onRender && onRender();
	}, [onRender]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			css={[baseBlockStyles, highlightRemoveStyles, directionStyles[direction], gapStyles[size]]}
			data-smart-block
			data-testid={testId}
			onTransitionEnd={onTransitionEnd}
			ref={blockRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
			data-ssr-placeholder={placeholderId}
			data-ssr-placeholder-replace={placeholderId}
		>
			{renderChildren(children, size)}
		</div>
	);
};

export default Block;
