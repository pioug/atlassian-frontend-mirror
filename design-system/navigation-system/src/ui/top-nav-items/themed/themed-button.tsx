/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import type { PressableProps } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import IconRenderer from '../icon-renderer';

import { ThemedPressable } from './themed-pressable';
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

export interface ThemedButtonProps
	extends CommonProps,
		Omit<PressableProps, OverriddenPrimitiveProps>,
		TextButtonCommonProps {}

export const ThemedButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedButtonProps>(function ThemedButton(
	{ iconBefore: IconBefore, children, ...props },
	ref,
) {
	return (
		<ThemedPressable {...props} ref={ref}>
			{IconBefore && (
				<span css={textButtonStyles.iconBefore}>
					{fg('platform_themed_button_use_icon_renderer') ? (
						<IconRenderer icon={IconBefore} />
					) : (
						<IconBefore label="" color="currentColor" />
					)}
				</span>
			)}
			<span css={textButtonStyles.text}>{children}</span>
		</ThemedPressable>
	);
});
