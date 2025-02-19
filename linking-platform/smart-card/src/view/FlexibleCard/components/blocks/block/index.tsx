/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { type BlockProps } from '../types';
import { renderChildren } from '../utils';

import BlockOld from './indexOld';

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const BaseBlockStylesOld = css({
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1rem',
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
	'&:empty': {
		display: 'none',
	},
	'& > *': {
		minWidth: 0,
	},
	'& > [data-fit-to-content]': {
		minWidth: 'fit-content',
	},
	justifyContent: 'flex-start',
	'[data-separator] + [data-separator]::before': {
		content: "'•'",
	},
	"[data-smart-element='SourceBranch'] + [data-smart-element='TargetBranch']::before": {
		content: "'→'",
	},
	"[data-smart-element='TargetBranch'] + [data-smart-element='SourceBranch']::before": {
		content: "'←'",
	},
});

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

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const gapsStylesOld = cssMap({
	xlarge: {
		gap: `1.25rem`,
		'[data-separator] + [data-separator]::before': {
			marginRight: `1.25rem`,
		},
	},
	large: {
		gap: `1rem`,
		'[data-separator] + [data-separator]::before': {
			marginRight: `1rem`,
		},
	},
	medium: {
		gap: `0.5rem`,
		'[data-separator] + [data-separator]::before': {
			marginRight: `0.5rem`,
		},
	},
	small: {
		gap: `0.25rem`,
		'[data-separator] + [data-separator]::before': {
			marginRight: `0.25rem`,
		},
	},
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
const BlockNew = ({
	children,
	direction = SmartLinkDirection.Horizontal,
	size = SmartLinkSize.Medium,
	testId = 'smart-block',
	className,
	blockRef,
	onRender,
	onTransitionEnd,
	style,
}: BlockProps) => {
	useEffect(() => {
		onRender && onRender();
	}, [onRender]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			css={[
				!fg('platform-linking-visual-refresh-v1') && BaseBlockStylesOld,
				fg('platform-linking-visual-refresh-v1') && baseBlockStyles,
				highlightRemoveStyles,
				directionStyles[direction],
				!fg('platform-linking-visual-refresh-v1') && gapsStylesOld[size],
				fg('platform-linking-visual-refresh-v1') && gapStyles[size],
			]}
			data-smart-block
			data-testid={testId}
			onTransitionEnd={onTransitionEnd}
			ref={blockRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
		>
			{renderChildren(children, size)}
		</div>
	);
};

const Block = (props: BlockProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <BlockNew {...props} />;
	} else {
		return <BlockOld {...props} />;
	}
};

export default Block;
