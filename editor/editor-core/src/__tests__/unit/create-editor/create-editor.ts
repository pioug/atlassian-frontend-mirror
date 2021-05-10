import { name } from '../../../version.json';
import { Selection } from 'prosemirror-state';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  sortByRank,
  fixExcludes,
  createPMPlugins,
  processPluginsList,
} from '../../../create-editor/create-editor';
import { EditorConfig } from '../../../types';

describe(name, () => {
  describe('create-editor', () => {
    describe('#sortByRank', () => {
      it('should correctly sort object with rank property', () => {
        const list = [
          { rank: 10 },
          { rank: 1 },
          { rank: 1000 },
          { rank: 30 },
          { rank: 100 },
          { rank: 40 },
        ];

        const result = [
          { rank: 1 },
          { rank: 10 },
          { rank: 30 },
          { rank: 40 },
          { rank: 100 },
          { rank: 1000 },
        ];

        list.sort(sortByRank);

        expect(list.sort(sortByRank)).toEqual(result);
      });
    });

    describe('#fixExcludes', () => {
      it('should remove all unused marks from exclude', () => {
        const marks = {
          code: {
            excludes: 'textStyle typeAheadQuery',
            group: 'code',
          },
          em: {
            excludes: 'code',
            group: 'textStyle',
          },
        };
        const result = {
          code: {
            excludes: 'textStyle',
            group: 'code',
          },
          em: {
            excludes: 'code',
            group: 'textStyle',
          },
        };

        expect(fixExcludes(marks)).toEqual(result);
      });
    });

    describe('#createPMPlugins', () => {
      it('should not add plugin if its factory returns falsy value', () => {
        const editorConfig: Partial<EditorConfig> = {
          pmPlugins: [
            { name: 'skipped', plugin: () => undefined },
            {
              name: 'mocked',
              plugin: () => ({ spec: {}, props: {}, getState() {} }),
            },
          ],
        };
        expect(
          createPMPlugins({
            editorConfig: editorConfig as EditorConfig,
            schema: {} as any,
            dispatch: () => {},
            eventDispatcher: {} as any,
            providerFactory: {} as any,
            errorReporter: {} as any,
            portalProviderAPI: { render() {}, remove() {} } as any,
            reactContext: () => ({} as any),
            dispatchAnalyticsEvent: () => {},
            performanceTracking: {},
            featureFlags: {},
          }).length,
        ).toEqual(1);
      });
    });
  });

  describe('#processPluginsList', () => {
    it('should pass plugin options to a corresponding plugin', () => {
      const spy = jest.fn(() => []);
      const options = { foo: 'bar' };
      const plugins = [
        {
          name: 'test',
          pmPlugins: spy,
        },
        {
          name: 'test2',
          pluginsOptions: {
            test: options,
          },
        },
      ];
      processPluginsList(plugins);
      expect(spy).toHaveBeenCalledWith([options]);
    });
  });

  describe('onChange', () => {
    it('should call onChange only when document changes', () => {
      const onChange = jest.fn();
      const createEditor = createEditorFactory();
      const editor = createEditor({ editorProps: { onChange } });
      const { editorView } = editor;
      editorView.dispatch(editorView.state.tr.insertText('hello'));
      expect(onChange).toHaveBeenCalledTimes(1);
      const { tr } = editorView.state;
      editorView.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(1))));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
