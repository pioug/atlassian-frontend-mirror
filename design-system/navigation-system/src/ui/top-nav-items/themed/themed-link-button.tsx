/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import forwardRefWithGeneric from '@atlaskit/ds-lib/forward-ref-with-generic';
import type { AnchorProps } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ThemedAnchor } from './themed-anchor';
import type { CommonProps, OverriddenPrimitiveProps, TextButtonCommonProps } from './types';

const textButtonStyles = cssMap({
	iconBefore: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
	text: {
		fontWeight: token('font.weight.medium'),
	},
});

/**
 * Props that are common between link buttons.
 */
interface LinkVariantCommonProps<RouterLinkConfig extends Record<string, any> = never>
	extends CommonProps,
		Omit<AnchorProps<RouterLinkConfig>, OverriddenPrimitiveProps> {}

export interface ThemedLinkButtonProps<RouterLinkConfig extends Record<string, any> = never>
	extends LinkVariantCommonProps<RouterLinkConfig>,
		TextButtonCommonProps {}

function ThemedLinkButtonFn<RouterLinkConfig extends Record<string, any> = never>(
	{ iconBefore: IconBefore, children, ...props }: ThemedLinkButtonProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
) {
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<ThemedAnchor {...props} ref={ref}>
			{IconBefore && (
				<span css={textButtonStyles.iconBefore}>
					<IconBefore label="" color="currentColor" />
				</span>
			)}
			<span css={textButtonStyles.text}>{children}</span>
		</ThemedAnchor>
	);
}

export const ThemedLinkButton: <RouterLinkConfig extends Record<string, any> = never>(
	props: ThemedLinkButtonProps<RouterLinkConfig> & React.RefAttributes<HTMLAnchorElement>,
) => React.ReactElement | null = forwardRefWithGeneric(ThemedLinkButtonFn);
