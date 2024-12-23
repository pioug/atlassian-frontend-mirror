/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { Ref } from 'react';
import React, { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { defineMessages } from 'react-intl-next';

import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const messages = defineMessages({
	collapseNode: {
		id: 'fabric.editor.collapseNode',
		defaultMessage: 'Collapse content',
		description: 'Collapse the node',
	},
	expandDefaultTitle: {
		id: 'fabric.editor.expandDefaultTitle',
		defaultMessage: 'Click here to expand...',
		description: 'Placeholder text for an expand node',
	},
	expandNode: {
		id: 'fabric.editor.expandNode',
		defaultMessage: 'Expand content',
		description: 'Expand the node',
	},
	expandPlaceholderText: {
		id: 'fabric.editor.expandPlaceholder',
		defaultMessage: 'Give this expand a title...',
		description: 'Placeholder text for an expand node title input field',
	},
});

export const ExpandIconWrapper = ({
	children,
	expanded,
}: React.HTMLAttributes<HTMLDivElement> & { expanded: boolean }) => {
	return (
		<div
			css={() =>
				expanded
					? [expandIconWrapperStyle(), expandIconWrapperExpandedStyle]
					: expandIconWrapperStyle()
			}
		>
			{children}
		</div>
	);
};

const expandIconWrapperStyle = () =>
	css({
		cursor: 'pointer',
		display: 'flex',
		color: token('color.icon'),
		borderRadius: token('border.radius.100', '4px'),
		width: '24px',
		height: '24px',
		'&:hover': {
			background: token('color.background.neutral.subtle.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		svg: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			transition: `transform 0.2s ${akEditorSwoopCubicBezier}`,
		},
	});

const expandIconWrapperExpandedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	svg: {
		transform: 'rotate(90deg)',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const expandLayoutWrapperStyle = css({
	width: token('space.300', '24px'),
	height: token('space.300', '24px'),
});

export const ExpandLayoutWrapperWithRef = forwardRef(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(props: React.HTMLAttributes<HTMLDivElement>, ref: Ref<any>) => {
		const { children, ...rest } = props;
		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<div css={expandLayoutWrapperStyle} {...rest} ref={ref}>
				{children}
			</div>
		);
	},
);
