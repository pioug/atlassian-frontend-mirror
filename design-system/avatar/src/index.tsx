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

export { AvatarContext, type AvatarContextProps, useAvatarContext } from './context';

export { AVATAR_SIZES, BORDER_WIDTH, AVATAR_RADIUS, ACTIVE_SCALE_FACTOR } from './constants';

export type {
	AvatarClickEventHandler,
	AppearanceType,
	SizeType,
	Presence as PresenceType,
	Status as StatusType,
	IndicatorSizeType,
} from './types';
