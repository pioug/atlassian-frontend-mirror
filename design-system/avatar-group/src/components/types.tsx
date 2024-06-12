import type { ElementType, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

import type { AnalyticsEvent } from '@atlaskit/analytics-next';
import { type default as Avatar, type AvatarPropTypes } from '@atlaskit/avatar';
import { type MenuGroupProps } from '@atlaskit/menu';
import { type ContentProps } from '@atlaskit/popup';

import type { AvatarGroupItemProps } from './avatar-group-item';

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
