import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CustomMediaPlayerBase as EmotionCustomMediaPlayerBase } from './index-emotion';
import {
	CustomMediaPlayerBase as CompiledCustomMediaPlayerBase,
	type CustomMediaPlayerProps,
} from './index-compiled';
import { fg } from '@atlaskit/platform-feature-flags';
import { withMediaAnalyticsContext } from '@atlaskit/media-common';

export const CustomMediaPlayerBase = (
	props: CustomMediaPlayerProps & WrappedComponentProps & WithAnalyticsEventsProps,
) =>
	fg('platform_media_compiled') ? (
		<CompiledCustomMediaPlayerBase {...props} />
	) : (
		<EmotionCustomMediaPlayerBase {...props} />
	);

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
export const CustomMediaPlayer: React.ComponentType<
	CustomMediaPlayerProps & WithAnalyticsEventsProps
> = withMediaAnalyticsContext({
	packageVersion,
	packageName,
	componentName: 'customMediaPlayer',
	component: 'customMediaPlayer',
})(withAnalyticsEvents()(injectIntl(CustomMediaPlayerBase)));

export { type CustomMediaPlayerProps } from './index-compiled';
export type { CustomMediaPlayerState, Action } from './index-compiled';
