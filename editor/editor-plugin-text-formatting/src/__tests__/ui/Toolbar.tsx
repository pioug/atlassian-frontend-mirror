import React from 'react';

import { fireEvent, render, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import codeBlockPlugin from '@atlaskit/editor-core/src/plugins/code-block';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  code_block as codeBlock,
  doc,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { textFormattingPlugin } from '../../index';
import Toolbar from '../../ui/Toolbar';

describe('UI - Toolbar', () => {
  const editorRef = {
    current: document.createElement('div'),
  };

  const ToolbarWrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en">
      <ReactEditorViewContext.Provider value={{ editorRef }}>
        {children}
      </ReactEditorViewContext.Provider>
    </IntlProvider>
  );

  describe('when shouldUseResponsiveToolbar is false', () => {
    let createAnalyticsEvent: CreateUIAnalyticsEvent;
    const createEditor = createProsemirrorEditorFactory();
    const editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add(decorationsPlugin)
          .add(textFormattingPlugin)
          .add(compositionPlugin)
          .add([codeBlockPlugin, { appearance: 'full-page' }])
          .add([analyticsPlugin, { createAnalyticsEvent }]),
      });

    beforeEach(() => {
      createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    });

    describe('when formatting is not allowed', () => {
      it.each(['Bold', 'Italic'])(
        'should disable the %s toolbar button',
        buttonName => {
          const { editorView } = editor(
            doc(codeBlock({ language: 'js' })('Hello {<>}world')),
          );
          const { getByTestId } = render(
            <ToolbarWrapper>
              <Toolbar
                isToolbarDisabled={false}
                toolbarSize={ToolbarSize.M}
                isReducedSpacing={false}
                shouldUseResponsiveToolbar={false}
                editorView={editorView}
                editorState={editorView.state}
              />
            </ToolbarWrapper>,
          );
          const button = getByTestId(`editor-toolbar__${buttonName}`);
          expect(button).toBeDisabled();
        },
      );

      it.each([
        'Code',
        'Subscript',
        'Underline',
        'Superscript',
        'Strikethrough',
      ])(
        'should disable the %s button inside more button group',
        buttonName => {
          const { editorView } = editor(
            doc(codeBlock({ language: 'js' })('Hello {<>}world')),
          );
          const { getByLabelText, getByRole } = render(
            <ToolbarWrapper>
              <Toolbar
                isToolbarDisabled={false}
                toolbarSize={ToolbarSize.M}
                isReducedSpacing={false}
                shouldUseResponsiveToolbar={false}
                editorView={editorView}
                editorState={editorView.state}
              />
            </ToolbarWrapper>,
          );
          const moreButton = getByLabelText('More formatting');
          fireEvent.click(moreButton);
          const group = getByRole('group');
          const button = within(group).getByTestId(
            `dropdown-item__${buttonName}`,
          );

          expect(button).toHaveAttribute('aria-disabled', 'true');
        },
      );
    });
  });
});
