import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

export type AvatarSizeMap = Record<SizeType, number>;

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type AppearanceType = 'circle' | 'square' | 'hexagon';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type SizeType =
	| 'xxsmall'
	/**
	 * 16px avatar size.
	 *
	 * @deprecated Use `xxsmall` for 16px avatars. `xsmall` is temporarily retained as a legacy
	 * alias and will become the 20px avatar size in a future major version.
	 */
	| 'xsmall'
	/**
	 * 20px avatar size.
	 *
	 * @private Unsafe, transitional size. The size scale will eventually be renamed so the 16px
	 * avatar becomes `xxsmall` and `xsmall` represents 20px. Until that migration happens, use
	 * `UNSAFE_xsmall` for 20px avatars. Prefer a documented size where possible.
	 */
	| 'UNSAFE_xsmall'
	| 'small'
	| 'medium'
	| 'large'
	| 'xlarge'
	| 'xxlarge';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type IndicatorSizeType = 'small' | 'medium' | 'large' | 'xlarge';

export type AvatarClickEventHandler = (
	event: React.MouseEvent,
	analyticsEvent?: UIAnalyticsEvent,
) => void;

export type Status = 'approved' | 'declined' | 'locked' | 'warning';

export type Presence = 'online' | 'busy' | 'focus' | 'offline';

// Public API aliases preserved from an eliminated entry-point (volt-migrate-package).
export { type Presence as PresenceType };
export { type Status as StatusType };
