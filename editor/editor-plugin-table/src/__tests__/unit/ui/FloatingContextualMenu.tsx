import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';
import { IntlProvider } from 'react-intl-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import FloatingContextualMenu from '../../../plugins/table/ui/FloatingContextualMenu';
import tablePlugin from '../../../plugins/table-plugin';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

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
            getEditorFeatureFlags={() => ({})}
          />
        </IntlProvider>,
      );
      expect(screen.getAllByLabelText('Popup').length).toBeGreaterThan(0);
    });
  });
});
