// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
export { default } from './Avatar';
export type { AvatarPropTypes, CustomAvatarProps } from './Avatar';
export { default as AvatarItem } from './AvatarItem';
export type { AvatarItemProps, CustomAvatarItemProps } from './AvatarItem';
export { default as Presence } from './Presence';
export type { PresenceProps, PresenceType } from './Presence';
export { default as Status } from './Status';
export type { StatusProps, StatusType } from './Status';
export { default as Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export {
  AVATAR_SIZES,
  BORDER_WIDTH,
  AVATAR_RADIUS,
  ACTIVE_SCALE_FACTOR,
} from './constants';
export type {
  AvatarClickEventHandler,
  AppearanceType,
  SizeType,
  IndicatorSizeType,
} from './types';
