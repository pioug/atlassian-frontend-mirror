import React from 'react';
import { uuid } from '@atlaskit/adf-schema';
import { IntlProvider } from 'react-intl-next';
import { render, fireEvent } from '@testing-library/react';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  h1,
  indentation,
  ul,
  li,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
import toolbarListsIndentationPlugin, {
  PrimaryToolbarComponent,
} from '../../../';
import { indentationPlugin } from '@atlaskit/editor-plugin-indentation';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import tasksAndDecisionsPlugin from '../../../../tasks-and-decisions';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

describe('Indentation buttons', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add([analyticsPlugin, {}])
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(blockTypePlugin)
        .add([
          toolbarListsIndentationPlugin,
          {
            showIndentationButtons: true,
            allowHeadingAndParagraphIndentation: true,
          },
        ])
        .add(indentationPlugin)
        .add([tasksAndDecisionsPlugin, { allowNestedTasks: true }]),
    });

  const setupEditor = ({
    doc,
    click,
    noOfClicks = 1,
  }: {
    doc: DocBuilder;
    click: 'indent' | 'outdent';
    noOfClicks?: number;
  }) => {
    const { editorView, editorAPI } = editor(doc);
    const { getByTestId } = render(
      <IntlProvider locale="en">
        <PrimaryToolbarComponent
          disabled={false}
          editorView={editorView}
          showIndentationButtons={true}
          featureFlags={{}}
          pluginInjectionApi={editorAPI}
          allowHeadingAndParagraphIndentation={true}
          isToolbarReducedSpacing={false}
          isSmall={false}
        />
      </IntlProvider>,
    );

    const button = getByTestId(click);

    for (let i = 0; i < noOfClicks; i++) {
      fireEvent.click(button);
    }
    return {
      editorView,
      getByTestId,
    };
  };
  describe('Indent button click', () => {
    it('should indent paragraph', () => {
      const { editorView } = setupEditor({
        doc: doc(p('{<>}hello world')),
        click: 'indent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(p('{<>}hello world'))),
      );
    });

    it('should indent heading', () => {
      const { editorView } = setupEditor({
        doc: doc(h1('{<>}hello world')),
        click: 'indent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(h1('{<>}hello world'))),
      );
    });

    it('should indent second list item of ul', () => {
      const { editorView } = setupEditor({
        doc: doc(ul(li(p('first')), li(p('second{<>}')))),
        click: 'indent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('first'), ul(li(p('second{<>}')))))),
      );
    });

    it('should indent second task item of task list', () => {
      const listProps = { localId: 'local-uuid' };
      const itemProps = { localId: 'local-uuid', state: 'TODO' };
      uuid.setStatic('local-uuid');

      const { editorView } = setupEditor({
        doc: doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello World'),
            taskItem(itemProps)('Hello World{<>}'),
          ),
        ),
        click: 'indent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello World'),
            taskList(listProps)(taskItem(itemProps)('Hello World{<>}')),
          ),
        ),
      );
    });

    it('on multiple indent button presses it should only indent paragraph to level 6 indentation', () => {
      const { editorView } = setupEditor({
        doc: doc(p('{<>}hello world')),
        click: 'indent',
        noOfClicks: 7,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 6 })(p('{<>}hello world'))),
      );
    });
  });

  describe('Outdent button click', () => {
    it('should outdent paragraph', () => {
      const { editorView } = setupEditor({
        doc: doc(indentation({ level: 1 })(p('{<>}hello world'))),
        click: 'outdent',
      });

      expect(editorView.state.doc).toEqualDocument(doc(p('{<>}hello world')));
    });

    it('should outdent heading', () => {
      const { editorView } = setupEditor({
        doc: doc(indentation({ level: 1 })(h1('{<>}hello world'))),
        click: 'outdent',
      });

      expect(editorView.state.doc).toEqualDocument(doc(h1('{<>}hello world')));
    });

    it('should outdent indented list', () => {
      const { editorView } = setupEditor({
        doc: doc(ul(li(p('first'), ul(li(p('second{<>}')))))),
        click: 'outdent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('first')), li(p('second{<>}')))),
      );
    });

    it('should outdent indented task list', () => {
      const listProps = { localId: 'local-uuid' };
      const itemProps = { localId: 'local-uuid', state: 'TODO' };
      uuid.setStatic('local-uuid');

      const { editorView } = setupEditor({
        doc: doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello World'),
            taskList(listProps)(taskItem(itemProps)('Hello World{<>}')),
          ),
        ),
        click: 'outdent',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello World'),
            taskItem(itemProps)('Hello World{<>}'),
          ),
        ),
      );
    });

    it('on multiple outdent button presses it should remove indentation', () => {
      const { editorView } = setupEditor({
        doc: doc(indentation({ level: 6 })(p('{<>}hello world'))),
        click: 'outdent',
        noOfClicks: 7,
      });

      expect(editorView.state.doc).toEqualDocument(doc(p('{<>}hello world')));
    });
  });
});
