/** @jsx jsx */
import { jsx } from '@emotion/react';
import { type ReactNode, Component } from 'react';
import { type ErrorFileState, type FileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import type { SupportedLanguages } from '@atlaskit/code/types';
import CodeBlock from '@atlaskit/code/block';
import ErrorMessage from '../../errorMessage';
import { MediaViewerError } from '../../errors';
import { lineCount } from './util';
import { codeViewerHeaderBarStyles, codeViewWrapperStyles, codeViewerHTMLStyles } from './styles';
import { TouchScrollable } from 'react-scrolllock';

// Based on some basic benchmarking with @atlaskit/code it was found that ~10,000 lines took around ~5secs to render, which locks the main thread.
// Therefore we set a hard limit on the amount of lines which we apply formatting to,
// otherwise the "text" language will be used which is plain and more performant
const MAX_FORMATTED_LINES = 10000;
// Use plain html to render code file if their size exceeds 5MB.
// Required by https://product-fabric.atlassian.net/browse/MEX-1788
const MAX_FILE_SIZE_USE_CODE_VIEWER = 5 * 1024 * 1024;

export const CodeViewWrapper = ({
	children,
	'data-testid': testId,
}: {
	children: ReactNode;
	'data-testid': string | undefined;
}) => {
	return (
		<TouchScrollable>
			<div css={codeViewWrapperStyles} data-testid={testId}>
				{children}
			</div>
		</TouchScrollable>
	);
};

export const CodeViewerHeaderBar = () => {
	return <div css={codeViewerHeaderBarStyles}></div>;
};
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

const initialState: State = {
	doc: Outcome.pending(),
};

export class CodeViewRenderer extends Component<Props, State> {
	state: State = initialState;

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {}

	private async init() {
		const { src, onSuccess, onError } = this.props;

		try {
			this.setState({ doc: Outcome.successful(src) });
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			const mediaError = new MediaViewerError(
				'codeviewer-load-src',
				error instanceof Error ? error : undefined,
			);
			this.setState({
				doc: Outcome.failed(mediaError),
			});

			if (onError) {
				onError(mediaError);
			}
		}
	}

	render() {
		const { item, src, language, testId } = this.props;
		//Use src to measure the real file size
		//item.size is incorrect for archives with mutiple docs inside.
		const fileSize = new Blob([src]).size;

		const codeViewer =
			lineCount(src) > MAX_FORMATTED_LINES || fileSize > MAX_FILE_SIZE_USE_CODE_VIEWER ? (
				<code css={codeViewerHTMLStyles} data-testid="code-block">
					{src}
				</code>
			) : (
				<CodeBlock language={language} text={src} testId="code-block" />
			);

		return this.state.doc.match({
			pending: () => <Spinner />,
			successful: () => (
				<CodeViewWrapper data-testid={testId}>
					<CodeViewerHeaderBar />
					{codeViewer}
				</CodeViewWrapper>
			),
			failed: (error) => (
				<ErrorMessage
					fileId={item.id}
					fileState={item}
					error={error}
					supressAnalytics={true} // item-viewer.tsx will send
				/>
			),
		});
	}
}
