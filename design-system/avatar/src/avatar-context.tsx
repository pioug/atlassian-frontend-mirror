import { createContext } from 'react';

import { type SizeType } from './types';

export type AvatarContextProps = {
	size: SizeType;
};
/**
 * __Avatar context__
 *
 * An avatar context that provides the size of the avatar to children. Used by AvatarGroup
 *
 * - [Examples](https://atlassian.design/components/avatar/examples)
 * - [Code](https://atlassian.design/components/avatar/code)
 * - [Usage](https://atlassian.design/components/avatar/usage)
 */
export const AvatarContext: import('react').Context<AvatarContextProps | undefined> = createContext<
	AvatarContextProps | undefined
>(undefined);
