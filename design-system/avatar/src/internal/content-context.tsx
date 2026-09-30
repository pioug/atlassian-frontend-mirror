import { createContext, type ForwardedRef, type MouseEventHandler, type ReactNode } from 'react';

import type { TriggerAriaProps } from '@atlaskit/popup/types';

import { type AppearanceType, type SizeType } from '../types';

type AvatarContentContextProps = Partial<TriggerAriaProps> & {
	as: 'a' | 'button' | 'span';
	appearance: AppearanceType;
	UNSAFE_isUpdatedGeometry?: boolean;
	avatarImage: ReactNode;
	borderColor?: string;
	href?: string;
	isDisabled?: boolean;
	label?: string;
	onClick?: MouseEventHandler;
	ref: ForwardedRef<HTMLElement>;
	tabIndex?: number;
	target?: '_blank' | '_self' | '_top' | '_parent';
	testId?: string;
	size: SizeType;
	stackIndex?: number;
};

const defaultAvatarContentProps: AvatarContentContextProps = {
	as: 'span',
	appearance: 'circle',
	avatarImage: null,
	ref: null,
	size: 'medium',
};

/**
 * __Avatar content context__
 *
 * This context provides the props for the AvatarContent component, enabling
 * consumers to compose the AvatarContent with the Avatar component.
 */
export const AvatarContentContext: import('react').Context<AvatarContentContextProps> =
	createContext<AvatarContentContextProps>(defaultAvatarContentProps);
