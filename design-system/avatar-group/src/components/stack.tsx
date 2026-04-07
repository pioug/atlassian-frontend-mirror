/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { ExitingPersistence } from '@atlaskit/motion';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type AvatarGroupSize } from './types';

const listStyles = css({
	display: 'flex',
	isolation: 'isolate',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	listStyleType: 'none !important',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.100'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

const listSmallStyles = css({
	marginInlineEnd: token('space.050'),
});

const listItemStyles = css({
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.negative.100'),
	marginInlineStart: token('space.0'),
});

const listItemSmallStyles = css({
	marginInlineEnd: token('space.negative.050'),
});

const Stack: FC<{
	children: ReactNode;
	testId?: string;
	'aria-label': string;
	size: AvatarGroupSize;
	id?: string;
}> = ({ id, children, testId, 'aria-label': label, size }) => (
	<ul
		id={id}
		data-testid={testId}
		aria-label={label}
		css={[
			listStyles,
			size === 'small' && fg('platform-avatar-group-spacing-fix') && listSmallStyles,
		]}
	>
		{fg('platform-dst-motion-uplift') ? (
			<ExitingPersistence exitThenEnter>
				{Children.map(
					children,
					(child) =>
						child && (
							<li
								css={[
									listItemStyles,
									size === 'small' &&
										fg('platform-avatar-group-spacing-fix') &&
										listItemSmallStyles,
								]}
							>
								{child}
							</li>
						),
				)}
			</ExitingPersistence>
		) : (
			Children.map(
				children,
				(child) =>
					child && (
						<li
							css={[
								listItemStyles,
								size === 'small' && fg('platform-avatar-group-spacing-fix') && listItemSmallStyles,
							]}
						>
							{child}
						</li>
					),
			)
		)}
	</ul>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Stack;
