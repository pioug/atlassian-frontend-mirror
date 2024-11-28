import React from 'react';
import {
	Truncate as EmotionTruncate,
	TruncateLeft as EmotionTruncateLeft,
	TruncateRight as EmotionTruncateRight,
} from './truncateText-emotion';
import {
	Truncate as CompiledTruncate,
	TruncateLeft as CompiledTruncateLeft,
	TruncateRight as CompiledTruncateRight,
	type TruncateStyledProps,
} from './truncateText-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export const Truncate: typeof EmotionTruncate = (props) =>
	fg('platform_media_compiled') ? <CompiledTruncate {...props} /> : <EmotionTruncate {...props} />;

export const TruncateLeft = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledTruncateLeft {...props} />
	) : (
		<EmotionTruncateLeft {...props} />
	);

export const TruncateRight = (
	props: TruncateStyledProps &
		React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledTruncateRight {...props} />
	) : (
		<EmotionTruncateRight {...props} />
	);

export { calculateTruncation } from './truncateText-compiled';

export type { TruncateStyledProps, TruncateProps, TruncateOutput } from './truncateText-compiled';
