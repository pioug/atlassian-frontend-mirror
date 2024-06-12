import { createContext, useContext } from 'react';

import { type SizeType } from './types';

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
