import { createContext, type ForwardedRef, type MouseEventHandler, type ReactNode } from 'react';

import { type AppearanceType, type SizeType } from '../types';

type AvatarContentContextProps = {
	as: 'a' | 'button' | 'span';
	appearance: AppearanceType;
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
	'aria-controls'?: string;
	'aria-expanded'?: boolean;
	'aria-haspopup'?: boolean | 'dialog';
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
