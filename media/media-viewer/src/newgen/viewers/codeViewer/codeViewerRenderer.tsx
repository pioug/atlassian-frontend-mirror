import React from 'react';
import { FileState } from '@atlaskit/media-client';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import type { SupportedLanguages } from '@atlaskit/code/types';
import CodeBlock from '@atlaskit/code/block';
import ErrorMessage from '../../errorMessage';
import { MediaViewerError } from '../../errors';
import { CodeViewWrapper, CodeViewerHeaderBar } from './styled';
import { lineCount } from './util';

export type Props = {
  item: FileState;
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

// Based on some basic benchmarking with @atlaskit/code it was found that ~10,000 lines took around ~5secs to render, which locks the main thread.
// Therefore we set a hard limit on the amount of lines which we apply formatting to,
// otherwise the "text" language will be used which is plain and more performant
const MAX_FORMATTED_LINES = 10000;

export class CodeViewRenderer extends React.Component<Props, State> {
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
      this.setState({
        doc: Outcome.failed(new MediaViewerError('codeviewer-load-src', error)),
      });

      if (onError) {
        onError(error);
      }
    }
  }

  render() {
    const { item, src, language, testId } = this.props;
    const selectedLanguage =
      lineCount(src) > MAX_FORMATTED_LINES ? 'text' : language;

    return this.state.doc.match({
      pending: () => <Spinner />,
      successful: () => (
        <CodeViewWrapper data-testid={testId}>
          <CodeViewerHeaderBar />
          <CodeBlock language={selectedLanguage} text={src} />
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
