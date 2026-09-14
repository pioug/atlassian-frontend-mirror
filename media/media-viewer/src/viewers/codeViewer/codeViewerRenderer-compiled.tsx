/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	type ForwardRefExoticComponent,
	type ReactNode,
	type RefAttributes,
	forwardRef,
} from 'react';

import { jsx, css } from '@compiled/react';

import type { SupportedLanguages } from '@atlaskit/code/constants';
import { type ErrorFileState, type FileState } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';

import type { MediaViewerError } from '../../MediaViewerError';
import type { Outcome } from '../../domain/outcome';

const codeViewWrapperStyles = css({
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	backgroundColor: token('elevation.surface'),
	overflow: 'auto',
});

// Based on some basic benchmarking with @atlaskit/code it was found that ~10,000 lines took around ~5secs to render, which locks the main thread.
// Therefore we set a hard limit on the amount of lines which we apply formatting to,
// otherwise the "text" language will be used which is plain and more performant
export const MAX_FORMATTED_LINES: any = 10000;

// Use plain html to render code file if their size exceeds 5MB.
// Required by https://product-fabric.atlassian.net/browse/MEX-1788
export const MAX_FILE_SIZE_USE_CODE_VIEWER: any = 5 * 1024 * 1024;

export const CodeViewWrapper: ForwardRefExoticComponent<
	{
		children: ReactNode;
		'data-testid': string | undefined;
	} & RefAttributes<HTMLDivElement>
> = forwardRef(
	(
		{
			children,
			'data-testid': testId,
		}: {
			children: ReactNode;
			'data-testid': string | undefined;
		},
		ref: React.Ref<HTMLDivElement>,
	) => {
		return (
			<div css={codeViewWrapperStyles} data-testid={testId} ref={ref}>
				{children}
			</div>
		);
	},
);

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
