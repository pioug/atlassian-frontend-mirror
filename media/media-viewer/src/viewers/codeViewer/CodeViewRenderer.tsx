/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Component } from 'react';

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import CodeBlock from '@atlaskit/code/code-block';
import { token } from '@atlaskit/tokens';

import { Outcome } from '../../domain/outcome';
import ErrorMessage from '../../errorMessageWithAnalytics';
import { Spinner } from '../../loading';
import { MediaViewerError } from '../../MediaViewerError';
import { CodeViewerHeaderBar } from './CodeViewerHeaderBar';
import {
	CodeViewWrapper,
	MAX_FILE_SIZE_USE_CODE_VIEWER,
	MAX_FORMATTED_LINES,
} from './codeViewerRenderer-compiled';
import type { Props, State } from './codeViewerRenderer-compiled';
import { lineCount } from './lineCount';

const codeViewerHTMLStyles = css({
	display: 'flex',
	overflowX: 'auto',
	whiteSpace: 'pre',
	font: token('font.body.small'),
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
});

const initialState: State = {
	doc: Outcome.pending(),
};

export class CodeViewRenderer extends Component<Props, State> {
	state: State = initialState;

	componentDidMount(): void {
		this.init();
	}

	componentWillUnmount(): void {}

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

	render(): JSX.Element {
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
