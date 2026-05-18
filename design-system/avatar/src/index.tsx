export { default } from './avatar';
export type { AvatarPropTypes } from './avatar';
export { AvatarContent } from './avatar-content';
export { default as AvatarItem } from './avatar-item';
export type { AvatarItemProps } from './avatar-item';
export { default as Presence } from './presence';
export type { PresenceProps } from './presence';
export { default as Status } from './status';
export type { StatusProps } from './status';
export { default as Skeleton } from './skeleton';
export type { SkeletonProps } from './skeleton';
export { default as getAppearanceForAppType } from './get-appearance';

export { AvatarContext } from './avatar-context';
export type { AvatarContextProps } from './avatar-context';
export { useAvatarContext } from './use-avatar-context';

export { BORDER_WIDTH, ACTIVE_SCALE_FACTOR } from './constants';
export { AVATAR_SIZES } from './avatar-sizes';
export { AVATAR_RADIUS } from './avatar-radius';

export type {
	AvatarClickEventHandler,
	AppearanceType,
	SizeType,
	Presence as PresenceType,
	Status as StatusType,
	IndicatorSizeType,
} from './types';
