import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  panel,
  p,
  emoji,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { PanelType } from '@atlaskit/adf-schema';
import {
  removePanel,
  changePanelType,
} from '../../../../plugins/panel/actions';
import panelPlugin from '../../../../plugins/panel';
import emojiPlugin from '../../../../plugins/emoji';
import analyticsPlugin from '../../../../plugins/analytics';
import { selectNode } from '../../../../utils/commands';

describe('panel actions', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    const preset = new Preset<LightEditorPlugin>()
      .add(panelPlugin)
      .add(emojiPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({ doc, preset });
  };

  describe('remove panel', () => {
    it('deletes panel when selection inside panel', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p('text{<>}')), p('hello')),
      );

      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}hello')));
    });

    it('deletes panel when selection is panel node selection', () => {
      const { editorView } = editor(
        doc('{<node>}', panel({ panelType: 'info' })(p('text')), p('hello')),
      );

      removePanel()(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(doc(p('{<>}hello')));
    });

    it('trigger GAS3 analytics when deleted via toolbar', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p('text{<>}'))),
      );

      removePanel()(editorView.state, editorView.dispatch);
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
      changePanelType(PanelType.ERROR)(editorView.state, editorView.dispatch);

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
        const { editorView } = editor(
          doc(panel({ panelType: startType })(p('text{<>}'))),
        );

        changePanelType(type)(editorView.state, editorView.dispatch);
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
