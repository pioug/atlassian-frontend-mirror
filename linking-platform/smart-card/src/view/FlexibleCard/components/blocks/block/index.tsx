/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { type BlockProps } from '../types';
import { renderChildren } from '../utils';

import BlockOld from './indexOld';

const BaseBlockStyles = css({
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1rem',
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
	'&:empty': {
		display: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		minWidth: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-fit-to-content]': {
		minWidth: 'fit-content',
	},
	justifyContent: 'flex-start',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-separator] + [data-separator]::before': {
		content: "'•'",
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='SourceBranch'] + [data-smart-element='TargetBranch']::before": {
		content: "'→'",
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	"[data-smart-element='TargetBranch'] + [data-smart-element='SourceBranch']::before": {
		content: "'←'",
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

const gapsStyles = cssMap({
	xlarge: {
		gap: `1.25rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-separator] + [data-separator]::before': {
			marginRight: `1.25rem`,
		},
	},
	large: {
		gap: `1rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-separator] + [data-separator]::before': {
			marginRight: `1rem`,
		},
	},
	medium: {
		gap: `0.5rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-separator] + [data-separator]::before': {
			marginRight: `0.5rem`,
		},
	},
	small: {
		gap: `0.25rem`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-separator] + [data-separator]::before': {
			marginRight: `0.25rem`,
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
			css={[BaseBlockStyles, highlightRemoveStyles, directionStyles[direction], gapsStyles[size]]}
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
