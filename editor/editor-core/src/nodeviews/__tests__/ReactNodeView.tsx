import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import ReactNodeView from '../ReactNodeView';
import { EventDispatcher } from '../../event-dispatcher';
import { analyticsPluginKey } from '../../plugins/analytics/plugin-key';

jest.mock('../../plugins/analytics/plugin-key', () => ({
  analyticsPluginKey: {
    key: 'analyticsPlugin$',
  },
}));

describe('ReactNodeView', () => {
  const createEditor = createEditorFactory();
  const portalProviderAPI: any = {
    render() {},
    remove() {},
  };
  const getPos: any = () => {};
  const eventDispatcher = new EventDispatcher();

  beforeEach(() => {
    performance.measure = jest.fn();
    performance.clearMeasures = jest.fn();
    performance.clearMarks = jest.fn();
    performance.getEntriesByName = jest.fn(() => []);
    performance.getEntriesByType = jest.fn(() => []);
  });

  describe('Performance tracking', () => {
    it('should call performance.mark twice with appropriate arguments', () => {
      const pluginState = {
        performanceTracking: {
          nodeViewTracking: {
            enabled: true,
          },
        },
      };
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [
          {
            name: 'analytics',
            pmPlugins() {
              return [
                {
                  name: 'analyticsPlugin',
                  plugin: () =>
                    new SafePlugin({
                      key: analyticsPluginKey,
                      state: {
                        init() {
                          return pluginState;
                        },
                        apply() {
                          return pluginState;
                        },
                      },
                    }),
                },
              ];
            },
          },
        ],
      });
      const node = editorView.state.doc;

      const mark = performance.mark as jest.Mock;

      const nodeView = new ReactNodeView(
        node,
        editorView,
        getPos,
        portalProviderAPI,
        eventDispatcher,
      ).init();

      expect(mark.mock.calls.map((item) => item[0])).toEqual(
        expect.arrayContaining([
          `🦉${node.type.name}::ReactNodeView::start`,
          `🦉${node.type.name}::ReactNodeView::end`,
        ]),
      );

      nodeView.destroy();
      editorView.destroy();
    });
  });
});
