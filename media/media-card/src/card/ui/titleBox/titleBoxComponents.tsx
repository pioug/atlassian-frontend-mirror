import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	TitleBoxWrapper as CompiledTitleBoxWrapper,
	TitleBoxHeader as CompiledTitleBoxHeader,
	TitleBoxFooter as CompiledTitleBoxFooter,
	TitleBoxIcon as CompiledTitleBoxIcon,
	ErrorMessageWrapper as CompiledErrorMessageWrapper,
} from './titleBoxComponents-compiled';

import {
	TitleBoxWrapper as EmotionTitleBoxWrapper,
	TitleBoxHeader as EmotionTitleBoxHeader,
	TitleBoxFooter as EmotionTitleBoxFooter,
	TitleBoxIcon as EmotionTitleBoxIcon,
	ErrorMessageWrapper as EmotionErrorMessageWrapper,
} from './titleBoxComponents-emotion';

import {
	type TitleBoxFooterProps,
	type TitleBoxHeaderProps,
	type TitleBoxWrapperProps,
} from './types';

export const TitleBoxWrapper = (props: TitleBoxWrapperProps) =>
	fg('platform_media_compiled') ? (
		<CompiledTitleBoxWrapper {...props} />
	) : (
		<EmotionTitleBoxWrapper {...props} />
	);

export const TitleBoxHeader = (props: TitleBoxHeaderProps) =>
	fg('platform_media_compiled') ? (
		<CompiledTitleBoxHeader {...props} />
	) : (
		<EmotionTitleBoxHeader {...props} />
	);

export const TitleBoxFooter = (props: TitleBoxFooterProps) =>
	fg('platform_media_compiled') ? (
		<CompiledTitleBoxFooter {...props} />
	) : (
		<EmotionTitleBoxFooter {...props} />
	);

export const TitleBoxIcon = (props: any) =>
	fg('platform_media_compiled') ? (
		<CompiledTitleBoxIcon {...props} />
	) : (
		<EmotionTitleBoxIcon {...props} />
	);

export const ErrorMessageWrapper = (props: any) =>
	fg('platform_media_compiled') ? (
		<CompiledErrorMessageWrapper {...props} />
	) : (
		<EmotionErrorMessageWrapper {...props} />
	);
