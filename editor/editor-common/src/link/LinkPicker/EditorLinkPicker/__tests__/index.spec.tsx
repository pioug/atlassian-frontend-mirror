import React from 'react';

import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { replaceRaf } from 'raf-stub';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { renderWithIntl as render } from '@atlaskit/media-test-helpers/renderWithIntl';

import { EditorLinkPicker } from '../index';

replaceRaf();
const requestAnimationFrame = window.requestAnimationFrame as any;

describe('EditorLinkPicker', () => {
  const createEditor = createEditorFactory();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('dispatches to hide the link picker when escape is pressed', async () => {
    const { editorView } = createEditor({
      editorProps: {
        linking: { smartLinks: { provider: Promise.resolve({}) as any } },
      },
    });
    const onCancel = jest.fn();
    const onEscapeCallback = jest.fn();
    requestAnimationFrame.step();

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
        onCancel={onCancel}
        onEscapeCallback={onEscapeCallback}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onEscapeCallback).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('dispatches to hide the link picker when the user clicks outside the picker', async () => {
    const { editorView } = createEditor({});
    const onCancel = jest.fn();
    const onClickAwayCallback = jest.fn();

    render(
      <div>
        <div data-testid="outside-link-picker">Element outside link picker</div>
        <EditorLinkPicker
          view={editorView}
          onSubmit={jest.fn()}
          onCancel={onCancel}
          onClickAwayCallback={onClickAwayCallback}
        />
      </div>,
    );

    await user.click(await screen.findByTestId('outside-link-picker'));
    expect(onClickAwayCallback).toHaveBeenCalledTimes(1);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('dispatches to hide the link picker when the cancel button is pressed and card is available', async () => {
    const { editorView } = createEditor({
      editorProps: {
        linking: { smartLinks: { provider: Promise.resolve({}) as any } },
      },
    });
    const onCancel = jest.fn();
    const onEscapeCallback = jest.fn();

    requestAnimationFrame.step();

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={jest.fn()}
        onCancel={onCancel}
        onEscapeCallback={onEscapeCallback}
      />,
    );

    await user.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(onEscapeCallback).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit on link picker insert', async () => {
    const { editorView } = createEditor({});
    const onSubmit = jest.fn();

    render(
      <EditorLinkPicker
        view={editorView}
        displayText="My favourite search engine"
        url="google.com"
        onSubmit={onSubmit}
      />,
    );

    await user.click(await screen.findByTestId('link-picker-insert-button'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
