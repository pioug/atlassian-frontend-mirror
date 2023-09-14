// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { EventDispatcher } from '../../event-dispatcher';
import ReactNodeView from '../../react-node-view';
import { SafePlugin } from '../../safe-plugin';

describe('react-node-view', () => {
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
                      key: {
                        key: 'analyticsPlugin$',
                      } as any,
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
