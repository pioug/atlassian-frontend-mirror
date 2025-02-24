import {
	createContext,
	type ForwardedRef,
	type MouseEventHandler,
	type ReactNode,
	useContext,
} from 'react';

import { type AppearanceType, type SizeType } from './types';

export type AvatarContextProps = {
	size: SizeType;
};

/**
 * __Avatar context__
 *
 * This allows setting the size of all avatars under a context provider.
 *
 * ```tsx
 * <AvatarContext.Provider value={{ size: 'small' }}>
 *   <Avatar
 *     // ...props
 *   />
 * </AvatarContext.Provider>
 * ```
 */
export const AvatarContext = createContext<AvatarContextProps | undefined>(undefined);

export const useAvatarContext = () => useContext(AvatarContext);

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
export const AvatarContentContext =
	createContext<AvatarContentContextProps>(defaultAvatarContentProps);

export const useAvatarContent = () => useContext(AvatarContentContext);

/**
 * Used to ensure Avatar sub-components are used within a Avatar component,
 * and provide a useful error message if not.
 */
export const EnsureIsInsideAvatarContext = createContext<boolean>(false);

export const useEnsureIsInsideAvatar = () => {
	const context = useContext(EnsureIsInsideAvatarContext);
	if (!context) {
		throw new Error('Avatar sub-components must be used within a Avatar component.');
	}
};
