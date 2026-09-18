/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import { type Props as LoadingProps } from '../common/LoadingEmojiComponent';
import { EmojiUploaderInternal } from './EmojiUploaderInternal';

export interface Props extends LoadingProps {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	disableFocusLock?: boolean;
}

export type EmojiUploader = EmojiUploaderInternal;

export const EmojiUploader: React.ForwardRefExoticComponent<
	Omit<Props, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents()(EmojiUploaderInternal);

export default EmojiUploader;

/**
 * @deprecated Use `import { EmojiUploaderInternal } from '@atlaskit/emoji/emoji-uploader'` instead.
 */
export { EmojiUploaderInternal } from './EmojiUploaderInternal';
