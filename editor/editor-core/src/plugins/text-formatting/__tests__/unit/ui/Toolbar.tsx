import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { render, fireEvent, within } from '@testing-library/react';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import textFormattingPlugin from '../../../';
import {
  doc,
  p,
  strike,
  code,
  subsup,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type {
  UIAnalyticsEvent,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import Toolbar from '../../../ui/Toolbar';
import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

describe('@atlaskit/editor-core/ui/Toolbar', () => {
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

  describe('when pluginStateTextFormatting is undefined', () => {
    describe.each(['Bold', 'Italic'])('the %s toolbar button', (buttonName) => {
      it('should render disabled ToolbarButton', () => {
        const editorState = createEditorState(doc(p('A')));
        const editorView = new EditorView(null, { state: editorState });

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
        expect(getByTestId(`editor-toolbar__${buttonName}`)).toBeDisabled();
      });
    });
  });

  describe('when shouldUseResponsiveToolbar is true', () => {
    const createEditor = createProsemirrorEditorFactory();
    const editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>().add(textFormattingPlugin),
      });

    describe.each([ToolbarSize.S, ToolbarSize.XXXS, ToolbarSize.M])(
      'when the toolbar size is %s',
      (toolbarSize) => {
        it.each(['Bold', 'Italic'])(
          'should not display %s icon as single button',
          (buttonName) => {
            const { editorView } = editor(doc(p('text')));
            const { queryByTestId } = render(
              <ToolbarWrapper>
                <Toolbar
                  isToolbarDisabled={false}
                  toolbarSize={toolbarSize}
                  isReducedSpacing={false}
                  shouldUseResponsiveToolbar={true}
                  editorState={editorView.state}
                  editorView={editorView}
                />
              </ToolbarWrapper>,
            );
            expect(
              queryByTestId(`editor-toolbar__${buttonName}`),
            ).not.toBeInTheDocument();
          },
        );
      },
    );

    describe.each([ToolbarSize.L, ToolbarSize.XL, ToolbarSize.XXL])(
      'when the toolbar size is %s',
      (toolbarSize) => {
        it.each(['Bold', 'Italic'])(
          'should display %s inside as single button',
          (buttonName) => {
            const { editorView } = editor(doc(p('text')));
            const { getByTestId } = render(
              <ToolbarWrapper>
                <Toolbar
                  isToolbarDisabled={false}
                  toolbarSize={toolbarSize}
                  isReducedSpacing={false}
                  shouldUseResponsiveToolbar={true}
                  editorView={editorView}
                  editorState={editorView.state}
                />
              </ToolbarWrapper>,
            );
            expect(
              getByTestId(`editor-toolbar__${buttonName}`),
            ).toBeInTheDocument();
          },
        );
      },
    );
  });

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
          .add([analyticsPlugin, { createAnalyticsEvent }]),
      });

    beforeEach(() => {
      createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    });

    it.each(['Bold', 'Italic'])(
      'should have %s toolbar button',
      (buttonName) => {
        const { editorView } = editor(doc(p('text')));
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
        expect(
          getByTestId(`editor-toolbar__${buttonName}`),
        ).toBeInTheDocument();
      },
    );

    it('should open the button group when more formatting is clicked', () => {
      const { editorView } = editor(doc(p('text')));
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
      expect(getByRole('group')).toBeInTheDocument();
    });

    it('should show six buttons inside more button group', () => {
      const { editorView } = editor(doc(p('text')));
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
      expect(within(group).getAllByRole('button')).toHaveLength(6);
    });

    it.each([
      'Code',
      'Subscript',
      'Underline',
      'Superscript',
      'Strikethrough',
      'Clear formatting',
    ])('should show %s button inside more button group', (buttonName) => {
      const { editorView } = editor(doc(p('text')));
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
      expect(
        within(group).getByTestId(`dropdown-item__${buttonName}`),
      ).toBeInTheDocument();
    });

    it.each([
      ['Code', doc(p(code('text')))],
      ['Underline', doc(p(underline('text')))],
      ['Strikethrough', doc(p(strike('text')))],
      ['Subscript', doc(p(subsup({ type: 'sub' })('text')))],
      ['Superscript', doc(p(subsup({ type: 'sup' })('text')))],
    ])(
      'should format document when %s button is clicked',
      (buttonName, expectedDocument) => {
        const { editorView } = editor(doc(p('{<}text{>}')));
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
        const commandButton = within(group).getByTestId(
          `dropdown-item__${buttonName}`,
        );
        fireEvent.click(commandButton);

        expect(editorView.state.doc).toEqualDocument(expectedDocument);
      },
    );

    it.each([
      ['Bold', ACTION_SUBJECT_ID.FORMAT_STRONG],
      ['Italic', ACTION_SUBJECT_ID.FORMAT_ITALIC],
    ])(
      'should dispatch analytics event when %s toolbar button is clicked',
      (buttonName, actionSubjectId) => {
        const attachAnalyticsEvent = jest
          .fn()
          .mockImplementation(() => () => {});
        const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
          attachAnalyticsEvent,
        };
        const { editorView } = editor(doc(p('text')));
        const { getByTestId } = render(
          <ToolbarWrapper>
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
              editorAnalyticsAPI={mockEditorAnalyticsAPI}
            />
          </ToolbarWrapper>,
        );
        const button = getByTestId(`editor-toolbar__${buttonName}`);
        fireEvent.click(button);
        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            inputMethod: 'toolbar',
          }),
        };

        expect(attachAnalyticsEvent).toHaveBeenCalledWith(
          expectedPayload,
          undefined,
        );
      },
    );

    it.each([
      ['Code', ACTION_SUBJECT_ID.FORMAT_CODE],
      ['Underline', ACTION_SUBJECT_ID.FORMAT_UNDERLINE],
      ['Strikethrough', ACTION_SUBJECT_ID.FORMAT_STRIKE],
      ['Subscript', ACTION_SUBJECT_ID.FORMAT_SUB],
      ['Superscript', ACTION_SUBJECT_ID.FORMAT_SUPER],
    ])(
      'should dispatch analytics event when %s is clicked',
      (buttonName, actionSubjectId) => {
        const attachAnalyticsEvent = jest
          .fn()
          .mockImplementation(() => () => {});
        const mockEditorAnalyticsAPI: EditorAnalyticsAPI = {
          attachAnalyticsEvent,
        };
        const { editorView } = editor(doc(p('{<}text{>}')));
        const { getByLabelText, getByRole } = render(
          <ToolbarWrapper>
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
              editorAnalyticsAPI={mockEditorAnalyticsAPI}
            />
          </ToolbarWrapper>,
        );

        const moreButton = getByLabelText('More formatting');
        fireEvent.click(moreButton);

        const group = getByRole('group');
        const commandButton = within(group).getByTestId(
          `dropdown-item__${buttonName}`,
        );
        fireEvent.click(commandButton);

        const expectedPayload = {
          action: 'formatted',
          actionSubject: 'text',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            inputMethod: 'toolbar',
          }),
        };

        expect(attachAnalyticsEvent).toHaveBeenCalledWith(
          expectedPayload,
          undefined,
        );
      },
    );

    it('should remove formatting when Clear Formatting is clicked', () => {
      const { editorView } = editor(doc(p(underline('{<}text{>}'))));
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
      const commandButton = within(group).getByTestId(
        'dropdown-item__Clear formatting',
      );
      fireEvent.click(commandButton);

      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });
  });
});
