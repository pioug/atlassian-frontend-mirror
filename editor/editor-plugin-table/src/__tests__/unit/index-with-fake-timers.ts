// TODO: ensure this works as I have removed sinon here
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import TableView from '../../plugins/table/nodeviews/table';
import { TablePluginState, PluginConfig } from '../../plugins/table/types';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';

// TODO: this doesn't work
describe.skip('TableView', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const getEditorContainerWidth = () => ({ width: 500 });
  const fakeGetEditorFeatureFlags = () => ({});
  const originalHandleRef = (TableView.prototype as any).handleRef;
  const handleRefInnerMock = jest.fn(originalHandleRef);
  let handleRefMock: jest.SpyInstance;

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    } as PluginConfig;
    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
        media: {
          allowMediaSingle: true,
        },
      },
      pluginKey,
    });
  };

  // beforeEach(() => {
  //   handleRefMock = jest
  //     .spyOn(Object.getPrototypeOf(TableView), 'handleRef')
  //     .mockImplementation(() => {
  //       console.log('getting called?');
  //       // window.setTimeout(() => handleRefInnerMock.call(this, ref), 0);
  //     });
  // });
  // previous regression involved PM trying to render child DOM elements,
  // but the NodeView had an undefined contentDOM after the React render finishes
  // (since render is not synchronous)
  it('always provides a content DOM', function (this: any) {
    jest.useFakeTimers();

    // in the tests, handleRef gets called immediately (due to event loop ordering)
    // however, the ref callback function can be called async from React after
    // calling render, which can often occur in the browser
    //
    // to simulate this, we add a callback to force it to run out-of-order
    // const handleRefMock = sinon
    //   // @ts-ignore
    //   .stub(TableView.prototype, '_handleRef')
    //   .callsFake((ref: HTMLElement) => {
    //     window.setTimeout(() => handleRefInnerMock.call(this, ref), 0);
    //   });

    // create the NodeView
    const node = table()(tr(tdCursor, tdEmpty, tdEmpty))(defaultSchema);
    const { editorView, portalProviderAPI } = editor(doc(p()));
    const eventDispatcher = ({ on: () => {} } as unknown) as EventDispatcher;
    const tableView = new TableView({
      node,
      allowColumnResizing: false,
      view: editorView,
      portalProviderAPI,
      eventDispatcher,
      getPos: () => 1,
      getEditorContainerWidth,
      getEditorFeatureFlags: fakeGetEditorFeatureFlags,
    }).init();

    // we expect to have a contentDOM after instanciating the NodeView so that
    // ProseMirror will render the node's children into the element
    expect(tableView.contentDOM).toBeDefined();

    // we shouldn't have called the mock yet, since it's behind the window.setTimeout
    expect(handleRefInnerMock).not.toBeCalled();

    // run the timers through
    jest.runAllTimers();

    // the timer should have expired now
    expect(handleRefInnerMock).toBeCalled();

    // ensure we still have a contentDOM
    expect(tableView.contentDOM).toBeDefined();

    // reset the mock
    handleRefMock.mockClear();
  });
});
