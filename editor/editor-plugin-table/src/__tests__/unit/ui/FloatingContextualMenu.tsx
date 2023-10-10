import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
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
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import FloatingContextualMenu from '../../../plugins/table/ui/FloatingContextualMenu';

describe('FloatingContextualMenu', () => {
  const createEditor = createProsemirrorEditorFactory();
  describe('with right position in plugin state', () => {
    let editorView: EditorView;
    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(widthPlugin)
          .add(guidelinePlugin)
          .add(selectionPlugin)
          .add(tablePlugin),
      }));
    });

    it('should render floating contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
      render(
        <IntlProvider locale="en">
          <FloatingContextualMenu
            editorView={editorView}
            isOpen
            pluginConfig={getPluginState(editorView.state).pluginConfig}
            getEditorContainerWidth={jest.fn()}
          />
        </IntlProvider>,
      );
      expect(screen.getAllByLabelText('Popup').length).toBeGreaterThan(0);
    });
  });
});
