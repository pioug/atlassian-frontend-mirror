import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import * as prosemirrorUtils from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import type { Props as FloatingContextualButtonProps } from '../../../plugins/table/ui/FloatingContextualButton';
import FloatingContextualButton from '../../../plugins/table/ui/FloatingContextualButton';

jest.mock('@atlaskit/editor-prosemirror/utils', () => {
  // Unblock prosemirror bump:
  // Workaround to enable spy on prosemirror-utils cjs bundle
  const originalModule = jest.requireActual(
    '@atlaskit/editor-prosemirror/utils',
  );

  return {
    __esModule: true,
    ...originalModule,
  };
});

const createEditor = createProsemirrorEditorFactory();
let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
const editor = (doc: DocBuilder) =>
  createEditor({
    doc,
    preset: new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(selectionPlugin)
      .add(tablePlugin),
  });

describe('Floating Contextual Button', () => {
  let editorView: EditorView;
  let refs: { [name: string]: number };
  let tableNode: ContentNodeWithPos | undefined;

  beforeEach(() => {
    ({ editorView, refs } = editor(
      doc(
        table()(
          tr('{firstCell}', thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    ));

    tableNode = prosemirrorUtils.findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );
  });

  const component = (props: FloatingContextualButtonProps) =>
    render(
      <IntlProvider locale="en">
        <FloatingContextualButton
          tableNode={tableNode && tableNode.node}
          dispatchAnalyticsEvent={createAnalyticsEvent}
          {...props}
        />
      </IntlProvider>,
    );

  describe('when an error is thrown in the component', () => {
    it('renders', () => {
      component({
        editorView,
        targetCellPosition: refs.firstCell,
      });

      expect(screen.getByLabelText('Cell options')).toBeInTheDocument();
    });

    it('dispatches an analytics event', () => {
      const mock = jest.spyOn(prosemirrorUtils, 'findDomRefAtPos');
      mock.mockImplementation(() => {
        throw new Error('Error message from mock');
      });
      component({
        editorView,
        targetCellPosition: refs.firstCell,
      });

      expect(createAnalyticsEvent).toHaveBeenCalled();
    });
  });
});
