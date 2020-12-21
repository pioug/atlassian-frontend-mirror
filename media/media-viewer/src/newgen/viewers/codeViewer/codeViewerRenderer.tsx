import React from 'react';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import { CodeBlock } from '@atlaskit/code';
import ErrorMessage, {
  createError,
  MediaViewerError,
  ErrorName,
} from '../../error';
import { CodeViewWrapper, CodeViewerHeaderBar } from './styled';
import { lineCount } from './util';
import { getErrorName } from '@atlaskit/media-client';

export type Props = {
  src: string;
  language: string;
  onClose?: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
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
    } catch (err) {
      this.setState({
        doc: Outcome.failed(
          createError(getErrorName(err, 'previewFailed') as ErrorName, err),
        ),
      });

      if (onError) {
        onError(err);
      }
    }
  }

  render() {
    const { src, language } = this.props;
    const selectedLanguage =
      lineCount(src) > MAX_FORMATTED_LINES ? 'text' : language;

    return this.state.doc.match({
      pending: () => <Spinner />,
      successful: () => (
        <CodeViewWrapper>
          <CodeViewerHeaderBar />
          <CodeBlock language={selectedLanguage} text={src} />
        </CodeViewWrapper>
      ),
      failed: err => <ErrorMessage error={err} />,
    });
  }
}
