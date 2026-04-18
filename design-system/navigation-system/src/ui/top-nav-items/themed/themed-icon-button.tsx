/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import type { PressableProps } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import IconRenderer from '../icon-renderer';

import { ThemedPressable } from './themed-pressable';
import type { CommonProps, IconButtonCommonProps, OverriddenPrimitiveProps } from './types';

export interface ThemedIconButtonProps
	extends CommonProps, Omit<PressableProps, OverriddenPrimitiveProps>, IconButtonCommonProps {}

export const ThemedIconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedIconButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedIconButtonProps>(function ThemedIconButton(
	{ icon: Icon, label, tooltip, ...props },
	ref,
) {
	return (
		<Tooltip {...tooltip} content={tooltip?.content ?? label}>
			{(triggerProps) => (
				/**
				 * The `aria-describedby` from `triggerProps` is intentionally not passed down,
				 * because it would cause double announcements with the `VisuallyHidden` label.
				 *
				 * The `@atlaskit/button` IconButton uses the same approach.
				 */
				<ThemedPressable
					{...props}
					shape="square"
					ref={mergeRefs([ref, triggerProps.ref])}
					onClick={(event, analyticsEvent) => {
						props.onClick?.(event, analyticsEvent);
						triggerProps?.onClick?.(event);
					}}
					onMouseOver={(e) => {
						triggerProps.onMouseOver?.(e);
						props.onMouseOver?.(e);
					}}
					onMouseOut={(e) => {
						triggerProps.onMouseOut?.(e);
						props.onMouseOut?.(e);
					}}
					onMouseMove={(e) => {
						triggerProps.onMouseMove?.(e);
						props.onMouseMove?.(e);
					}}
					onMouseDown={(e) => {
						triggerProps.onMouseDown?.(e);
						props.onMouseDown?.(e);
					}}
					onFocus={(e) => {
						triggerProps.onFocus?.(e);
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						triggerProps.onBlur?.(e);
						props.onBlur?.(e);
					}}
				>
					{fg('platform_themed_button_use_icon_renderer') ? (
						<IconRenderer icon={Icon} />
					) : (
						<Icon label="" color="currentColor" />
					)}
					<VisuallyHidden>{label}</VisuallyHidden>
				</ThemedPressable>
			)}
		</Tooltip>
	);
});
