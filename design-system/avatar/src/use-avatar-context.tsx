import { useContext } from 'react';

import { AvatarContext, type AvatarContextProps } from './avatar-context';

export const useAvatarContext: () => AvatarContextProps | undefined = () =>
	useContext(AvatarContext);
