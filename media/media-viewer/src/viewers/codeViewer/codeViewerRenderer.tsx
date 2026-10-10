import type { SupportedLanguages } from '@atlaskit/code/constants';
import type { ErrorFileState, FileState } from '@atlaskit/media-state/file-state';

import type { Outcome } from '../../domain/outcome';
import type { MediaViewerError } from '../../MediaViewerError';

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
