import { render } from '@testing-library/react';
import React from 'react';
import Loadable from 'react-loadable';
import Editor from '../../../../editor';

const adf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'extension',
      attrs: {
        parameters: {
          extensionId: 'e6764f45-4d69-49f8-9e0a-3a83fb9c0db7',
          localId: '0',
          text: 'Extension',
          macroMetadata: {
            macroId: {
              value: 1598252695991,
            },
            schemaVersion: {
              value: '2',
            },
          },
        },
      },
    },
  ],
};

describe('floating toolbar with extension node', () => {
  beforeAll(async () => {
    await Loadable.preloadAll();
  });

  it('should rerender with breakout buttons if appearance changes to full-page', async () => {
    const breakoutButtonAriaLabel = 'Go wide';

    const { findByTestId, rerender, queryAllByLabelText } = render(
      <Editor
        appearance="comment"
        defaultValue={adf}
        allowExtension={{ allowBreakout: true }}
      />,
    );

    const floatingToolbarInitial = await findByTestId(
      'editor-floating-toolbar',
    );
    const wideButtonsInitial = queryAllByLabelText(breakoutButtonAriaLabel);
    expect(floatingToolbarInitial).toBeInTheDocument();
    expect(wideButtonsInitial.length).toBe(0);
    rerender(
      <Editor
        appearance="full-page"
        allowExtension={{ allowBreakout: true }}
      />,
    );

    const floatingToolbar = await findByTestId('editor-floating-toolbar');
    const wideButton = queryAllByLabelText(breakoutButtonAriaLabel);
    expect(floatingToolbar).toBeInTheDocument();
    expect(wideButton.length).toBeGreaterThan(0);
  });

  it('should rerender without breakout buttons if appearance changes from full-page', async () => {
    const breakoutButtonAriaLabel = 'Go wide';

    const { findByTestId, rerender, queryAllByLabelText } = render(
      <Editor
        appearance="full-page"
        defaultValue={adf}
        allowExtension={{ allowBreakout: true }}
      />,
    );

    const floatingToolbarInitial = await findByTestId(
      'editor-floating-toolbar',
    );
    const wideButtonsInitial = queryAllByLabelText(breakoutButtonAriaLabel);
    expect(floatingToolbarInitial).toBeInTheDocument();
    expect(wideButtonsInitial.length).toBeGreaterThan(0);
    rerender(
      <Editor
        appearance="full-width"
        allowExtension={{ allowBreakout: true }}
      />,
    );

    const floatingToolbar = await findByTestId('editor-floating-toolbar');
    const wideButton = queryAllByLabelText(breakoutButtonAriaLabel);
    expect(floatingToolbar).toBeInTheDocument();
    expect(wideButton.length).toBe(0);
  });
});
