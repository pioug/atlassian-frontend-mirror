import React from 'react';
import {
	IconWrapper as EmotionIconWrapper,
	EmojiWrapper as EmotionEmojiWrapper,
	IconTitleWrapper as EmotionIconTitleWrapper,
	LozengeWrapper as EmotionLozengeWrapper,
	LozengeBlockWrapper as EmotionLozengeBlockWrapper,
	RightIconPositionWrapper as EmotionRightIconPositionWrapper,
	IconPositionWrapper as EmotionIconPositionWrapper,
	IconEmptyWrapper as EmotionIconEmptyWrapper,
} from './styled-emotion';
import {
	IconWrapper as CompiledIconWrapper,
	EmojiWrapper as CompiledEmojiWrapper,
	IconTitleWrapper as CompiledIconTitleWrapper,
	LozengeWrapper as CompiledLozengeWrapper,
	LozengeBlockWrapper as CompiledLozengeBlockWrapper,
	RightIconPositionWrapper as CompiledRightIconPositionWrapper,
	IconPositionWrapper as CompiledIconPositionWrapper,
	IconEmptyWrapper as CompiledIconEmptyWrapper,
} from './styled-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export { IconObjectOverrides, IconOverrides } from './styled-emotion';

export const IconWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledIconWrapper {...props} />
	) : (
		<EmotionIconWrapper {...props} />
	);

export const EmojiWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledEmojiWrapper {...props} />
	) : (
		<EmotionEmojiWrapper {...props} />
	);

export const IconTitleWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledIconTitleWrapper {...props} />
	) : (
		<EmotionIconTitleWrapper {...props} />
	);

export const LozengeWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledLozengeWrapper {...props} />
	) : (
		<EmotionLozengeWrapper {...props} />
	);

export const LozengeBlockWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledLozengeBlockWrapper {...props} />
	) : (
		<EmotionLozengeBlockWrapper {...props} />
	);

export const RightIconPositionWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledRightIconPositionWrapper {...props} />
	) : (
		<EmotionRightIconPositionWrapper {...props} />
	);

export const IconPositionWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledIconPositionWrapper {...props} />
	) : (
		<EmotionIconPositionWrapper {...props} />
	);

export const IconEmptyWrapper = (
	props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
) =>
	fg('platform_media_compiled') ? (
		<CompiledIconEmptyWrapper {...props} />
	) : (
		<EmotionIconEmptyWrapper {...props} />
	);
