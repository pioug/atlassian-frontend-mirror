import type { ElementType, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

import type { AnalyticsEvent } from '@atlaskit/analytics-next';
import { type default as Avatar, type AvatarPropTypes, type SizeType } from '@atlaskit/avatar';
import { type MenuGroupProps } from '@atlaskit/menu';
import { type ContentProps } from '@atlaskit/popup';

import type { AvatarGroupItemProps } from './avatar-group-item';
import { type MoreIndicatorProps } from './more-indicator';

export type DeepRequired<T> = {
	[P in keyof T]-?: Required<T[P]>;
};

export type AvatarProps = AvatarPropTypes & {
	name: string;
	key?: string | number;
};

export interface AvatarGroupOverrides {
	AvatarGroupItem?: {
		render?: (
			Component: ForwardRefExoticComponent<AvatarGroupItemProps & RefAttributes<HTMLElement>>,
			props: AvatarGroupItemProps,
			index: number,
		) => ReactNode;
	};
	Avatar?: {
		render?: (
			Component: typeof Avatar | ElementType<AvatarProps>,
			props: AvatarProps,
			index: number,
		) => ReactNode;
	};
	MoreIndicator?: {
		render?: (
			Component: ForwardRefExoticComponent<MoreIndicatorProps & RefAttributes<HTMLButtonElement>>,
			props: MoreIndicatorProps,
		) => ReactNode;
	};
}

export type onAvatarClickHandler = (
	event: React.MouseEvent,
	analyticsEvent: AnalyticsEvent | undefined,
	index: number,
) => void;

export type FocusableElement = HTMLAnchorElement | HTMLButtonElement;

export type Action = 'next' | 'prev' | 'first' | 'last';

export interface PopupAvatarGroupProps extends MenuGroupProps {
	setInitialFocusRef?: ContentProps['setInitialFocusRef'];
}

/**
 * The set of avatar sizes supported by `AvatarGroup` and its `MoreIndicator`.
 *
 * Excludes `xsmall` (16px) and `UNSAFE_xsmall` (20px): the more indicator and
 * grouped avatars cannot be displayed in an accessible manner at those sizes.
 */
export type AvatarGroupSize = Exclude<SizeType, 'xsmall' | 'UNSAFE_xsmall'>;
