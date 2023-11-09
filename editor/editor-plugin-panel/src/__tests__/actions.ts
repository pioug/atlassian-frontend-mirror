import { PanelType } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { selectNode } from '@atlaskit/editor-common/selection';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  emoji,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { changePanelType, removePanel } from '../actions';

describe('panel actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (
    doc: DocBuilder,
    allowCustomPanel?: boolean,
    allowCustomPanelEdit?: boolean,
  ) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(decorationsPlugin)
      .add([panelPlugin, { allowCustomPanel, allowCustomPanelEdit }])
      // @ts-ignore We don't need to add type-ahead dependency - we only need the emoji node
      .add(emojiPlugin);

    return createEditor({ doc, preset });
  };

  describe('remove panel', () => {
    it('deletes panel when selection inside panel', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p('text{<>}')), p('hello')),
      );

      removePanel(undefined)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}hello')));
    });

    it('deletes panel when selection is panel node selection', () => {
      const { editorView } = editor(
        doc('{<node>}', panel({ panelType: 'info' })(p('text')), p('hello')),
      );

      removePanel(undefined)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}hello')));
    });

    it('trigger GAS3 analytics when deleted via toolbar', () => {
      const { editorView, editorAPI } = editor(
        doc(panel({ panelType: 'info' })(p('text{<>}'))),
      );

      removePanel(editorAPI?.analytics?.actions)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'deleted',
        actionSubject: 'panel',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
        eventType: 'track',
      });
    });
  });

  describe('change panel type', () => {
    it('preserves node selection inside panel when changing panel type', () => {
      const grinningEmoji = emoji({ shortName: ':grinning:', text: '😀' });
      const initialDoc = doc(
        panel({ panelType: PanelType.INFO })(
          p('beforeEmoji', '{<node>}', grinningEmoji(), 'afterEmoji'),
        ),
      );
      const { editorView } = editor(initialDoc);
      changePanelType(undefined)(PanelType.ERROR)(
        editorView.state,
        editorView.dispatch,
      );

      const expectedDoc = doc(
        panel({ panelType: 'error' })(
          p('beforeEmoji', '{<node>}', grinningEmoji(), 'afterEmoji'),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    const panelTypes: PanelType[] = Object.values(PanelType);

    panelTypes.forEach(type => {
      it(`trigger GAS3 analytics when changing panel type to ${type}`, () => {
        let startType =
          type === PanelType.INFO ? PanelType.NOTE : PanelType.INFO;
        const { editorView, editorAPI } = editor(
          doc(panel({ panelType: startType })(p('text{<>}'))),
        );

        changePanelType(editorAPI?.analytics?.actions)(type)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'changedType',
          actionSubject: 'panel',
          attributes: expect.objectContaining({
            newType: type,
            previousType: startType,
          }),
          eventType: 'track',
        });
      });
    });

    describe('for custom panel', () => {
      const useCustomPanel = true;
      const editCustomPanel = true;

      it('should update the predefined panel with custom emoji with same background color', () => {
        const initialDoc = doc(panel({ panelType: 'info' })(p('text')));
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(
          PanelType.CUSTOM,
          { emoji: 'frown' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'frown',
            panelColor: '#DEEBFF',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should update the predefined panel with custom color with same emoji', () => {
        const initialDoc = doc(panel({ panelType: 'info' })(p('text')));
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(
          PanelType.CUSTOM,
          { color: '#f7bada' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelColor: '#f7bada',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it(`should update the custom panel type to predefined panel type and
            preserve the previous options when no options passed `, () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'frown',
            panelColor: 'var(--ds-background-information, #DEEBFF)',
          })(p('text')),
        );
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(PanelType.INFO, {}, useCustomPanel)(
          editorView.state,
          editorView.dispatch,
        );

        const expectedDoc = doc(
          panel({
            panelType: PanelType.INFO,
            panelIcon: 'frown',
            panelColor: 'var(--ds-background-information, #DEEBFF)',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it(`should update the custom panel type to predefined panel type`, () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'frown',
            panelColor: 'var(--ds-background-information, #DEEBFF)',
          })(p('text')),
        );
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(PanelType.INFO)(
          editorView.state,
          editorView.dispatch,
        );

        const expectedDoc = doc(
          panel({
            panelType: PanelType.INFO,
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should update the custom panel with given emoji and color', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(
          PanelType.CUSTOM,
          { emoji: 'smile', color: '#f33000' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f33000',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should update the custom panel with given color and no emoji', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(
          PanelType.CUSTOM,
          { emoji: undefined, color: '#f33000' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelColor: '#f33000',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should update the no icon custom panel with given color', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(
          initialDoc,
          useCustomPanel,
          editCustomPanel,
        );

        changePanelType(undefined)(
          PanelType.CUSTOM,
          { color: '#f33000' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelColor: '#f33000',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });
    });
  });

  describe('select panel', () => {
    it('should select node', () => {
      const { editorView, refs } = editor(
        doc('{nodeStart}', panel({ panelType: PanelType.INFO })(p('text{<>}'))),
      );

      selectNode(refs['nodeStart'])(editorView.state, editorView.dispatch);

      const expectedDoc = doc(
        '{<node>}',
        panel({ panelType: 'info' })(p('text')),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
