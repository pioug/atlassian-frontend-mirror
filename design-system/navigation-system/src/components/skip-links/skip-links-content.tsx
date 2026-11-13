/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
		zIndex: 'calc(infinity)',
	},
	skipLinkList: {
		display: 'flex',
		flexDirection: 'column',
		listStylePosition: 'outside',
		listStyleType: 'none',
		marginBlockStart: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	label: {
		font: token('font.heading.xxsmall'),
		color: token('color.text.subtle'),
		paddingBlock: token('space.100'),
	},
});

export function SkipLinksContent({
	label,
	titleId,
	testId,
	children,
}: {
	label?: string;
	titleId?: string;
	testId?: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<div css={contentStyles.root}>
			{label !== undefined && (
				<div
					css={contentStyles.label}
					data-testid={testId ? `${testId}--skip-links-container--label` : undefined}
					id={titleId}
				>
					{label}
				</div>
			)}
			<ol css={contentStyles.skipLinkList}>{children}</ol>
		</div>
	);
}
