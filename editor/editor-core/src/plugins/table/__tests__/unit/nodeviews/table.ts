import { Node as PMNode } from 'prosemirror-model';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TableAttributes } from '@atlaskit/adf-schema';
import { TablePluginState } from '../../../../../plugins/table/types';
import {
  getPluginState,
  pluginKey,
} from '../../../../../plugins/table/pm-plugins/plugin-factory';
import TableView from '../../../../../plugins/table/nodeviews/table';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { EditorProps } from '../../../../../types';
import { EditorView } from 'prosemirror-view';
import { hoverRows } from '../../../commands';

describe('table -> nodeviews -> table.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const createTableNode = (attrs?: TableAttributes) => (...args: any) =>
    table(attrs)(...args)(defaultSchema);

  const editor = (doc: DocBuilder, props?: EditorProps) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: { advanced: true },
        ...props,
      },
      pluginKey,
    });
  let originalResizeObserver: object;
  let triggerElementResize = (
    element: HTMLElement,
    height: number,
    width: number,
  ) => {
    const entries = [
      {
        target: element,
        contentRect: { height, width },
      },
    ];
    resizeCallback(entries);
  };
  let resizeCallback: (entries: any[]) => {};

  beforeAll(() => {
    originalResizeObserver = (window as any).ResizeObserver;
    (window as any).ResizeObserver = function resizeObserverMock(
      callback: () => {},
    ) {
      this.disconnect = jest.fn();
      this.observe = jest.fn();
      resizeCallback = callback;
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    (window as any).ResizeObserver = originalResizeObserver;
  });

  describe('TableView', () => {
    describe('with tableRenderOptimization', () => {
      it('updates plugin state on table size change', () => {
        const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))), {
          featureFlags: { tableRenderOptimization: true },
        });
        const tableElement = editorView.domAtPos(1).node as HTMLElement;
        triggerElementResize(tableElement, 100, 200);
        const pluginState = getPluginState(editorView.state);
        expect(pluginState.tableHeight).toEqual(100);
        expect(pluginState.tableWidth).toEqual(200);
      });

      describe('on view update', () => {
        let tableNode: PMNode,
          tableNodeView: TableView,
          renderSpy: jest.SpyInstance,
          view: EditorView;
        beforeEach(() => {
          tableNode = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text')), tdEmpty, tdEmpty));
          const { editorView, portalProviderAPI, eventDispatcher } = editor(
            doc(
              p('text'),
              table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty)),
            ),
            {
              featureFlags: { tableRenderOptimization: true },
            },
          );
          view = editorView;
          tableNodeView = new TableView({
            node: tableNode,
            allowColumnResizing: false,
            view: editorView,
            portalProviderAPI,
            eventDispatcher,
            getPos: () => 1,
            tableRenderOptimization: true,
          }).init();

          renderSpy = jest.spyOn(tableNodeView, 'render');
        });

        it('does not rerender if attributes did not change', () => {
          const newNodeWithUnchangedAttributes = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text1')), tdEmpty));
          tableNodeView.update(newNodeWithUnchangedAttributes, []);
          expect(renderSpy).not.toHaveBeenCalled();
        });

        it('rerenders when attributes change', () => {
          const newNodeWithChangedAttributes = createTableNode({
            isNumberColumnEnabled: false,
          })(tr(td()(p('{<>}text1')), tdEmpty));

          tableNodeView.update(newNodeWithChangedAttributes, []);
          expect(renderSpy).toHaveBeenCalled();
        });

        it('rerenders when hovered rows change but attributes dont change', () => {
          const newNodeWithUnchangedAttributes = createTableNode({
            isNumberColumnEnabled: true,
          })(tr(td()(p('{<>}text1')), tdEmpty));

          hoverRows([1])(view.state, view.dispatch);
          tableNodeView.update(newNodeWithUnchangedAttributes, []);
          expect(renderSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
