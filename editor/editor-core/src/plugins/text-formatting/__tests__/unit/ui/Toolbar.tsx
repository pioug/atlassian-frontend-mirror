import React from 'react';
import { IntlProvider } from 'react-intl';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { render, fireEvent, within } from '@testing-library/react';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  DocBuilder,
  doc,
  p,
  strike,
  code,
  code_block as codeBlock,
  subsup,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import textFormattingPlugin from '../../../';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import codeBlockPlugin from '../../../../../plugins/code-block';
import analyticsPlugin, {
  ACTION_SUBJECT_ID,
} from '../../../../../plugins/analytics';
import Toolbar from '../../../ui/Toolbar';
import { EditorView } from 'prosemirror-view';
import { ToolbarSize } from '../../../../../ui/Toolbar/types';

describe('@atlaskit/editor-core/ui/Toolbar', () => {
  describe('when pluginStateTextFormatting is undefined', () => {
    describe.each(['Bold', 'Italic'])('the %s toolbar button', (buttonName) => {
      it('should render disabled ToolbarButton', () => {
        const editorState = createEditorState(doc(p('A')));
        const editorView = new EditorView(undefined, { state: editorState });

        const { getByLabelText } = render(
          <IntlProvider locale="en">
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
            />
          </IntlProvider>,
        );
        expect(getByLabelText(buttonName)).toBeDisabled();
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
            const { queryByLabelText } = render(
              <IntlProvider locale="en">
                <Toolbar
                  isToolbarDisabled={false}
                  toolbarSize={toolbarSize}
                  isReducedSpacing={false}
                  shouldUseResponsiveToolbar={true}
                  editorState={editorView.state}
                  editorView={editorView}
                />
              </IntlProvider>,
            );
            expect(queryByLabelText(buttonName)).not.toBeInTheDocument();
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
            const { getByLabelText } = render(
              <IntlProvider locale="en">
                <Toolbar
                  isToolbarDisabled={false}
                  toolbarSize={toolbarSize}
                  isReducedSpacing={false}
                  shouldUseResponsiveToolbar={true}
                  editorView={editorView}
                  editorState={editorView.state}
                />
              </IntlProvider>,
            );
            expect(getByLabelText(buttonName)).toBeInTheDocument();
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
          .add(textFormattingPlugin)
          .add(codeBlockPlugin)
          .add([analyticsPlugin, { createAnalyticsEvent }]),
      });

    beforeEach(() => {
      createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    });

    it.each(['Bold', 'Italic'])(
      'should have %s toolbar button',
      (buttonName) => {
        const { editorView } = editor(doc(p('text')));
        const { getByLabelText } = render(
          <IntlProvider locale="en">
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
            />
          </IntlProvider>,
        );
        expect(getByLabelText(buttonName)).toBeInTheDocument();
      },
    );

    it('should open the button group when more formatting is clicked', () => {
      const { editorView } = editor(doc(p('text')));
      const { getByLabelText, getByRole } = render(
        <IntlProvider locale="en">
          <Toolbar
            isToolbarDisabled={false}
            toolbarSize={ToolbarSize.M}
            isReducedSpacing={false}
            shouldUseResponsiveToolbar={false}
            editorView={editorView}
            editorState={editorView.state}
          />
        </IntlProvider>,
      );
      const moreButton = getByLabelText('More formatting');
      fireEvent.click(moreButton);
      expect(getByRole('group')).toBeInTheDocument();
    });

    it('should show six buttons inside more button group', () => {
      const { editorView } = editor(doc(p('text')));
      const { getByLabelText, getByRole } = render(
        <IntlProvider locale="en">
          <Toolbar
            isToolbarDisabled={false}
            toolbarSize={ToolbarSize.M}
            isReducedSpacing={false}
            shouldUseResponsiveToolbar={false}
            editorView={editorView}
            editorState={editorView.state}
          />
        </IntlProvider>,
      );
      const moreButton = getByLabelText('More formatting');
      fireEvent.click(moreButton);
      const group = getByRole('group');
      expect(within(group).getAllByRole('button')).toHaveLength(6);
    });

    describe('when formatting is not allowed', () => {
      it.each(['Bold', 'Italic'])(
        'should disable the %s toolbar button',
        (buttonName) => {
          const { editorView } = editor(
            doc(codeBlock({ language: 'js' })('Hello {<>}world')),
          );
          const { getByLabelText } = render(
            <IntlProvider locale="en">
              <Toolbar
                isToolbarDisabled={false}
                toolbarSize={ToolbarSize.M}
                isReducedSpacing={false}
                shouldUseResponsiveToolbar={false}
                editorView={editorView}
                editorState={editorView.state}
              />
            </IntlProvider>,
          );
          const button = getByLabelText(buttonName);
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
        (buttonName) => {
          const { editorView } = editor(
            doc(codeBlock({ language: 'js' })('Hello {<>}world')),
          );
          const { getByLabelText, getByRole } = render(
            <IntlProvider locale="en">
              <Toolbar
                isToolbarDisabled={false}
                toolbarSize={ToolbarSize.M}
                isReducedSpacing={false}
                shouldUseResponsiveToolbar={false}
                editorView={editorView}
                editorState={editorView.state}
              />
            </IntlProvider>,
          );
          const moreButton = getByLabelText('More formatting');
          fireEvent.click(moreButton);
          const group = getByRole('group');
          const button = within(group).getByLabelText(buttonName);

          expect(button).toHaveAttribute('aria-disabled', 'true');
        },
      );
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
        <IntlProvider locale="en">
          <Toolbar
            isToolbarDisabled={false}
            toolbarSize={ToolbarSize.M}
            isReducedSpacing={false}
            shouldUseResponsiveToolbar={false}
            editorView={editorView}
            editorState={editorView.state}
          />
        </IntlProvider>,
      );
      const moreButton = getByLabelText('More formatting');
      fireEvent.click(moreButton);
      const group = getByRole('group');
      expect(within(group).getByLabelText(buttonName)).toBeInTheDocument();
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
          <IntlProvider locale="en">
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
            />
          </IntlProvider>,
        );

        const moreButton = getByLabelText('More formatting');
        fireEvent.click(moreButton);

        const group = getByRole('group');
        const commandButton = within(group).getByLabelText(buttonName);
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
        const { editorView } = editor(doc(p('text')));
        const { getByLabelText } = render(
          <IntlProvider locale="en">
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
            />
          </IntlProvider>,
        );
        const button = getByLabelText(buttonName);
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

        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
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
        const { editorView } = editor(doc(p('{<}text{>}')));
        const { getByLabelText, getByRole } = render(
          <IntlProvider locale="en">
            <Toolbar
              isToolbarDisabled={false}
              toolbarSize={ToolbarSize.M}
              isReducedSpacing={false}
              shouldUseResponsiveToolbar={false}
              editorView={editorView}
              editorState={editorView.state}
            />
          </IntlProvider>,
        );

        const moreButton = getByLabelText('More formatting');
        fireEvent.click(moreButton);

        const group = getByRole('group');
        const commandButton = within(group).getByLabelText(buttonName);
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

        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      },
    );

    it('should remove formatting when Clear Formatting is clicked', () => {
      const { editorView } = editor(doc(p(underline('{<}text{>}'))));
      const { getByLabelText, getByRole } = render(
        <IntlProvider locale="en">
          <Toolbar
            isToolbarDisabled={false}
            toolbarSize={ToolbarSize.M}
            isReducedSpacing={false}
            shouldUseResponsiveToolbar={false}
            editorView={editorView}
            editorState={editorView.state}
          />
        </IntlProvider>,
      );

      const moreButton = getByLabelText('More formatting');
      fireEvent.click(moreButton);

      const group = getByRole('group');
      const commandButton = within(group).getByLabelText('Clear formatting');
      fireEvent.click(commandButton);

      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });
  });
});
