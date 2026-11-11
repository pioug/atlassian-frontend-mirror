/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type JSX } from 'react';

import { css, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../get-style-props';
import type { GroupBase, NoticeProps } from '../types';

const noticeStyles = css({
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.150'),
	paddingInlineStart: token('space.150'),
	textAlign: 'center',
});

const semanticNoticeStyles = css({
	paddingBlockEnd: token('space.inset.medium'),
	paddingBlockStart: token('space.inset.medium'),
	paddingInlineEnd: token('space.inset.large'),
	paddingInlineStart: token('space.inset.large'),
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const LoadingMessage: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>({
	children,
	innerProps,
	xcss,
	...restProps
}: NoticeProps<Option, IsMulti, Group>) => JSX.Element = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	children = 'Loading...',
	innerProps,
	xcss,
	...restProps
}: NoticeProps<Option, IsMulti, Group>) => {
	const { css, className } = getStyleProps(
		{ ...restProps, children, innerProps },
		'loadingMessage',
		{
			'menu-notice': true,
			'menu-notice--loading': true,
		},
	);
	return (
		<div
			css={[noticeStyles, fg('platform-semantic-spacing') && semanticNoticeStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-LoadingMessage')}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			{...innerProps}
			// eslint-disable-next-line @atlassian/a11y/role-has-required-aria-props
			role="option"
		>
			<Text color="color.text.subtle">{children}</Text>
		</div>
	);
};
