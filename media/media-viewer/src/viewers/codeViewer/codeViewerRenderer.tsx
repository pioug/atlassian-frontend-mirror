import { fg } from '@atlaskit/platform-feature-flags';
import React, { type ReactNode } from 'react';
import { type ErrorFileState, type FileState } from '@atlaskit/media-client';
import { type Outcome } from '../../domain';
import type { SupportedLanguages } from '@atlaskit/code/types';
import { type MediaViewerError } from '../../errors';
import {
	CodeViewWrapper as CompiledCodeViewWrapper,
	CodeViewerHeaderBar as CompiledCodeViewerHeaderBar,
	CodeViewRenderer as CompiledCodeViewRenderer,
} from './codeViewerRenderer-compiled';
import {
	CodeViewWrapper as EmotionCodeViewWrapper,
	CodeViewerHeaderBar as EmotionCodeViewerHeaderBar,
	CodeViewRenderer as EmotionCodeViewRenderer,
} from './codeViewerRenderer-emotion';
import { TouchScrollable } from 'react-scrolllock';

export const CodeViewWrapper = (props: {
	children: ReactNode;
	'data-testid': string | undefined;
}) => (
	<TouchScrollable>
		{fg('platform_media_compiled') ? (
			<CompiledCodeViewWrapper {...props} />
		) : (
			<EmotionCodeViewWrapper {...props} />
		)}
	</TouchScrollable>
);

export const CodeViewerHeaderBar = () =>
	fg('platform_media_compiled') ? <CompiledCodeViewerHeaderBar /> : <EmotionCodeViewerHeaderBar />;

export type Props = {
	item: Exclude<FileState, ErrorFileState>;
	src: string;
	language: SupportedLanguages;
	testId?: string;
	onClose?: () => void;
	onSuccess?: () => void;
	onError?: (error: MediaViewerError) => void;
};

export type State = {
	doc: Outcome<any, MediaViewerError>;
};

export const CodeViewRenderer = (props: Props) =>
	fg('platform_media_compiled') ? (
		<CompiledCodeViewRenderer {...props} />
	) : (
		<EmotionCodeViewRenderer {...props} />
	);
