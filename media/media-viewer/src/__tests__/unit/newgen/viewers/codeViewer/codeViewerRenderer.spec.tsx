import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import {
  CodeViewRenderer,
  Props,
  State,
} from '../../../../../newgen/viewers/codeViewer/codeViewerRenderer';
import { Spinner } from '../../../../../newgen/loading';
import { createError, ErrorMessage } from '../../../../../newgen/error';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { Outcome } from '../../../../../newgen/domain';
import { CodeBlock } from '@atlaskit/code';

const defaultSrc = 'hello\n';
const defaultLanguage = 'c';

function createFixture(doc: any, customSrc?: string) {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  const el = mountWithIntlContext<Props, State>(
    <CodeViewRenderer
      src={customSrc || defaultSrc}
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
      language={defaultLanguage}
    />,
  );

  if (doc !== undefined) {
    el.setState({ doc });
  }
  return { el, onClose, onSuccess, onError };
}

describe('CodeViewRenderer', () => {
  it('shows a loading indicator until the code file is ready', () => {
    const state = Outcome.pending();
    const { el } = createFixture(state);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error message when the code file could not be loaded', async () => {
    const content = Outcome.failed(createError('previewFailed'));
    const { el } = createFixture(content);

    el.update();

    const errorMessage = el.find(ErrorMessage);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should call onSuccess when loaded, and onSuccess should render the CodeBlock component with the passed in language style if text (src) <= max formatted lines', async () => {
    const { el, onSuccess } = createFixture(undefined);
    el.update();

    expect(onSuccess).toHaveBeenCalled();

    const codeBlock = el.find(CodeBlock);
    expect(codeBlock).toHaveLength(1);

    expect(
      codeBlock.contains(
        <CodeBlock language={defaultLanguage} text={defaultSrc} />,
      ),
    ).toEqual(true);
  });

  it('should render the CodeBlock component with no codeblock styling if text (src) >= max formatted lines', async () => {
    const longString = defaultSrc.repeat(10001);

    const { el, onSuccess } = createFixture(undefined, longString);
    el.update();

    expect(onSuccess).toHaveBeenCalled();

    const codeBlock = el.find(CodeBlock);
    expect(codeBlock).toHaveLength(1);

    expect(
      codeBlock.contains(<CodeBlock language={'text'} text={longString} />),
    ).toEqual(true);
  });
});
