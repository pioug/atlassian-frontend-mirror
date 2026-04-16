import React from 'react';

import forwardRefWithGeneric from '@atlaskit/ds-lib/forward-ref-with-generic';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import type { AnchorProps } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { ThemedAnchor } from './themed-anchor';
import type { CommonProps, IconButtonCommonProps, OverriddenPrimitiveProps } from './types';

/**
 * Props that are common between link buttons.
 */
interface LinkVariantCommonProps<RouterLinkConfig extends Record<string, any> = never>
	extends CommonProps,
		Omit<AnchorProps<RouterLinkConfig>, OverriddenPrimitiveProps> {}

export interface ThemedLinkIconButtonProps<RouterLinkConfig extends Record<string, any> = never>
	extends LinkVariantCommonProps<RouterLinkConfig>,
		IconButtonCommonProps {
	href: string | RouterLinkConfig;
}

function ThemedLinkIconButtonFn<RouterLinkConfig extends Record<string, any> = never>(
	{ icon: Icon, label, tooltip, ...props }: ThemedLinkIconButtonProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
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
				<ThemedAnchor<RouterLinkConfig>
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
					<Icon label="" color="currentColor" />
					<VisuallyHidden>{label}</VisuallyHidden>
				</ThemedAnchor>
			)}
		</Tooltip>
	);
}

export const ThemedLinkIconButton: <RouterLinkConfig extends Record<string, any> = never>(
	props: ThemedLinkIconButtonProps<RouterLinkConfig> & React.RefAttributes<HTMLAnchorElement>,
) => React.ReactElement | null = forwardRefWithGeneric(ThemedLinkIconButtonFn);
