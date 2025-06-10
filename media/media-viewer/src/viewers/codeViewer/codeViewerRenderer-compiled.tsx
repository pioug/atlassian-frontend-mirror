/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@compiled/react';
import { type ReactNode, Component, forwardRef } from 'react';
import { type ErrorFileState, type FileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import type { SupportedLanguages } from '@atlaskit/code/types';
import CodeBlock from '@atlaskit/code/block';
import ErrorMessage from '../../errorMessage';
import { MediaViewerError } from '../../errors';
import { lineCount } from './util';
import { token } from '@atlaskit/tokens';

const codeViewWrapperStyles = css({
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	backgroundColor: token('elevation.surface', '#F4F5F7'),
	overflow: 'auto',
});

const codeViewerHeaderBarStyles = css({
	height: '75px',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#1d2125',
});

const codeViewerHTMLStyles = css({
	display: 'flex',
	overflowX: 'auto',
	whiteSpace: 'pre',
	font: token('font.body.UNSAFE_small'),
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
});

// Based on some basic benchmarking with @atlaskit/code it was found that ~10,000 lines took around ~5secs to render, which locks the main thread.
// Therefore we set a hard limit on the amount of lines which we apply formatting to,
// otherwise the "text" language will be used which is plain and more performant
const MAX_FORMATTED_LINES = 10000;
// Use plain html to render code file if their size exceeds 5MB.
// Required by https://product-fabric.atlassian.net/browse/MEX-1788
const MAX_FILE_SIZE_USE_CODE_VIEWER = 5 * 1024 * 1024;

export const CodeViewWrapper = forwardRef(
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
				// eslint-disable-next-line @atlaskit/design-system/no-html-code
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
