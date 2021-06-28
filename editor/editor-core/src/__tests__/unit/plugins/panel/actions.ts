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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
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

  const editor = (doc: DocBuilder, UNSAFE_allowCustomPanel?: boolean) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    const preset = new Preset<LightEditorPlugin>()
      .add([panelPlugin, { UNSAFE_allowCustomPanel }])
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

    panelTypes.forEach((type) => {
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

    describe('for custom panel', () => {
      const useCustomPanel = true;

      it('preserves existing color if emoji is changed', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);

        changePanelType(
          PanelType.CUSTOM,
          { emoji: 'frown' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'frown',
            panelColor: '#f7bada',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('preserves existing emoji if color is changed', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);

        changePanelType(
          PanelType.CUSTOM,
          { color: '#f33000' },
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

      it('preserves existing color if panel type is changed to CUSTOM', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.INFO,
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);

        changePanelType(
          PanelType.CUSTOM,
          { emoji: 'smile' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#DEEBFF',
          })(p('text')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('default emoji to be undefined if panel type is changed to CUSTOM', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.INFO,
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);

        changePanelType(
          PanelType.CUSTOM,
          { color: '#DBA304' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelColor: '#DBA304',
          })(p('text')),
        );

        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should preserve existing panel options while custom panel is changed without passing the options', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);
        changePanelType(
          PanelType.INFO,
          {},
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.INFO,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should preserve existing panel options while custom panel is changed with emoji passed', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);
        changePanelType(
          PanelType.ERROR,
          { emoji: 'grinning' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.ERROR,
            panelIcon: 'grinning',
            panelColor: '#f7bada',
          })(p('text')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should preserve existing panel options while custom panel is changed with color passed', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);
        changePanelType(
          PanelType.SUCCESS,
          { color: 'green' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.SUCCESS,
            panelIcon: 'smile',
            panelColor: 'green',
          })(p('text')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should preserve existing panel options while custom panel is changed with emoji and color passed', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.CUSTOM,
            panelIcon: 'smile',
            panelColor: '#f7bada',
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);
        changePanelType(
          PanelType.TIP,
          { emoji: 'grinning', color: 'green' },
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.TIP,
            panelIcon: 'grinning',
            panelColor: 'green',
          })(p('text')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
      });

      it('should change normal panel as intended and get the correct panel background when custom panel is enabled', () => {
        const initialDoc = doc(
          panel({
            panelType: PanelType.INFO,
          })(p('text')),
        );
        const { editorView } = editor(initialDoc, useCustomPanel);
        changePanelType(
          PanelType.ERROR,
          {},
          useCustomPanel,
        )(editorView.state, editorView.dispatch);

        const expectedDoc = doc(
          panel({
            panelType: PanelType.ERROR,
            panelColor: '#FFEBE6',
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
