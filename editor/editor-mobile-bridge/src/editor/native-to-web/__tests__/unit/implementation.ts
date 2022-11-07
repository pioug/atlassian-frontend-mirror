import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import {
  EditorActions,
  EventDispatcher,
  updateStatusWithAnalytics,
  insertDate,
  dateToDateType,
} from '@atlaskit/editor-core';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { PluginKey } from 'prosemirror-state';
import { EditorViewWithComposition } from '../../../../types';
import MobileEditorConfiguration from '../../../editor-configuration';
import NativeBridge from '../../../web-to-native/bridge';
import WebBridgeImpl, {
  MediaBridge,
  defaultSetList,
} from '../../implementation';
import * as BridgeUtils from '../../../../utils/bridge';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { TypeAheadHandler } from '@atlaskit/editor-core/src/plugins/type-ahead/types';
import { getEmptyADF } from '@atlaskit/adf-utils/empty-adf';
import * as crossPlatformPromise from '../../../../cross-platform-promise';
import { flushPromises } from '../../../../__tests__/__helpers/_flush-promises';

jest.mock('../../../web-to-native');
jest.mock('@atlaskit/editor-core', () => ({
  ...(jest.genMockFromModule('@atlaskit/editor-core') as object),
  dismissCommand: jest.fn(),
  selectItem: jest.fn((handler: TypeAheadHandler) => {
    const state: any = {
      schema: {
        nodes: {
          emoji: {
            createChecked: jest.fn(),
          },
        },
      },
    };
    const item: any = {};
    const insert = jest.fn();
    const meta: any = {};

    handler.selectItem(state, item, insert, meta);
    return jest.fn();
  }),
  getNodesCount: () => ({ paragraph: 2, date: 1, text: 1 }),
  typeAheadPluginKey: {
    getState() {
      const quickInsertItem = {
        id: 'media',
      };
      return {
        items: [quickInsertItem],
      };
    },
  },
  updateStatusWithAnalytics: jest.fn(() => () => {}),
  insertDate: jest.fn(() => () => {}),
  openDatePicker: jest.fn(() => () => {}),
  setMobilePaddingTop: jest.fn(() => () => {}),
}));
jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  measureRender: jest.fn((name, callback) => {
    callback();
  }),
}));

const createMockCollabProvider = () => {
  return ({
    setTitle: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    getFinalAcknowledgedState: jest.fn(() => ({
      stepVersion: 100,
    })),
  } as unknown) as CollabProvider;
};

class MockMobileUpload {
  notifyUploadStart = jest.fn();
  notifyUploadProgress = jest.fn();
  notifyUploadEnd = jest.fn();
  notifyUploadError = jest.fn();
}

class MockCustomMediaPicker {
  emit = jest.fn();
  on = jest.fn();
  removeAllListeners = jest.fn();
  destroy = jest.fn();
  setUploadParams = jest.fn();
}

describe('Collab Web Bridge', () => {
  let bridge: WebBridgeImpl;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
  });

  it('should not have a socket by default', () => {
    expect(bridge.collabSocket).toBeNull();
  });

  it('should create a collab socket', function () {
    const socket = bridge.createCollabSocket('http://atlassian.com');

    expect(bridge.collabSocket).toBe(socket);
  });

  it('should remove the socket on close', function () {
    const socket = bridge.createCollabSocket('http://atlassian.com');

    socket.close();

    expect(bridge.collabSocket).toBeNull();
  });

  it('should emit the received event', function (next) {
    const originalArgs = { foo: 'bar' };
    const socket = bridge.createCollabSocket('http://atlassian.com');

    socket.on('custom-event', (args: object) => {
      expect(args).toEqual(originalArgs);
      next();
    });

    bridge.onCollabEvent('custom-event', JSON.stringify(originalArgs));
  });

  describe('getStepVersion', () => {
    let toNativeBridge: jest.Mocked<NativeBridge>;

    beforeEach(async () => {
      ({ toNativeBridge } = ((await import(
        '../../../web-to-native'
      )) as any) as {
        toNativeBridge: jest.Mocked<NativeBridge>;
      });
    });

    it('calls updateStepVersion with stepVersion if succeeds', async () => {
      const provider = createMockCollabProvider();

      bridge.setCollabProviderPromise(Promise.resolve(provider));
      bridge.getStepVersion();
      await new Promise<void>((resolve) => process.nextTick(() => resolve()));

      expect(provider.getFinalAcknowledgedState).toBeCalled();
      expect(toNativeBridge.updateStepVersion).toBeCalledWith(100);
    });

    it('calls updateStepVersion with error if it fails', async () => {
      const provider = createMockCollabProvider();
      (provider.getFinalAcknowledgedState as any).mockImplementation(() => {
        throw new Error('Error string');
      });

      bridge.setCollabProviderPromise(Promise.resolve(provider));
      bridge.getStepVersion();
      await new Promise<void>((resolve) => process.nextTick(() => resolve()));

      expect(toNativeBridge.updateStepVersion).toBeCalledWith(
        undefined,
        'Error string',
      );
    });

    it('calls updateStepVersion with error if no collab provider promise', async () => {
      const provider = createMockCollabProvider();
      (provider.getFinalAcknowledgedState as any).mockImplementation(() => {
        throw new Error('Error string');
      });

      bridge.getStepVersion();
      await new Promise<void>((resolve) => process.nextTick(() => resolve()));

      expect(toNativeBridge.updateStepVersion).toBeCalledWith(
        undefined,
        'Collaborative edit is not enabled',
      );
    });
  });
});

describe('Lifecycle Bridge', () => {
  let bridge: WebBridgeImpl = new WebBridgeImpl();

  it('should create a lifecycle on creation', function () {
    expect(bridge.lifecycle).not.toBeUndefined();
  });

  it('should invoke events registered on `save`', function () {
    const fn = jest.fn();
    bridge.lifecycle.on('save', fn);
    bridge.saveCollabChanges();

    expect(fn).toHaveBeenCalled();
  });

  it('should invoke events registered on `restore`', function () {
    const fn = jest.fn();
    bridge.lifecycle.on('restore', fn);

    bridge.restoreCollabChanges();

    expect(fn).toHaveBeenCalled();
  });
});

describe('AllowList Bridge methods', () => {
  let bridgeVer: WebBridgeImpl;

  beforeEach(() => {
    bridgeVer = new WebBridgeImpl();
  });

  it('have default data set on props', () => {
    expect(bridgeVer.allowList).toEqual(new Set(defaultSetList));
  });

  it('should return stringifyed default set from method getQuickInsertAllowList', () => {
    expect(bridgeVer.getQuickInsertAllowList()).toBe(
      JSON.stringify(defaultSetList),
    );
  });

  it('should return modifed data set when setQuickInsertAllowList is called', () => {
    const newList = JSON.stringify(['header1', 'header2']);
    bridgeVer.setQuickInsertAllowList(newList);
    expect(bridgeVer.getQuickInsertAllowList()).toBe(newList);
  });

  it('should return modifed data set when addQuickInsertAllowListItem is called', () => {
    const addList = ['expand', 'status'];
    const newListExpected = [...defaultSetList, ...addList];
    bridgeVer.addQuickInsertAllowListItem(JSON.stringify(addList));
    expect(bridgeVer.getQuickInsertAllowList()).toBe(
      JSON.stringify(newListExpected),
    );
  });

  it('should return modifed data set when removeQuickInsertAllowListItem is called', () => {
    const removeList = ['heading1', 'heading2'];
    const newListExpected = [...defaultSetList].filter(
      (item) => !removeList.includes(item),
    );
    bridgeVer.removeQuickInsertAllowListItem(JSON.stringify(removeList));
    expect(bridgeVer.getQuickInsertAllowList()).toBe(
      JSON.stringify(newListExpected),
    );
  });
});

describe('PageTitle Bridge', () => {
  let bridgeVer: WebBridgeImpl;

  beforeEach(async () => {
    bridgeVer = new WebBridgeImpl();
  });

  it('should invoke collabProvider setTitle method', async function () {
    const provider = createMockCollabProvider();
    const title = 'foo';

    bridgeVer.setCollabProviderPromise(Promise.resolve(provider));
    bridgeVer.setTitle(title);

    await new Promise<void>((resolve) => process.nextTick(() => resolve()));

    expect(provider.setTitle).toHaveBeenCalledWith(title, true);
  });

  it('should not invoke collabProvider setTitle method when the setupTitle method has not been called', async function () {
    const provider = createMockCollabProvider();
    const title = 'foo';

    bridgeVer.setTitle(title);

    await new Promise<void>((resolve) => process.nextTick(() => resolve()));

    expect(provider.setTitle).not.toHaveBeenCalledWith(title, true);
  });
});

describe('Bridge with editorConfiguration and onEditorConfigChange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialise editorConfiguration with default configs when no configs are passed', () => {
    const expectedEditorConfig = new MobileEditorConfiguration();

    let bridge: WebBridgeImpl = new WebBridgeImpl();

    expect(bridge.getEditorConfiguration()).toEqual(expectedEditorConfig);
  });

  it('should initialize the initial editor config', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"mode": "dark","enableQuickInsert": true}',
    );
    let bridge: WebBridgeImpl = new WebBridgeImpl(editorConfig);

    bridge.setEditorConfiguration(editorConfig);

    expect(bridge.getEditorConfiguration().getMode()).toEqual('dark');
    expect(bridge.getEditorConfiguration().isQuickInsertEnabled()).toEqual(
      true,
    );
  });

  it('should have a setter method to set the editor config', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"mode": "dark","enableQuickInsert": true}',
    );
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.setEditorConfiguration(editorConfig);
    expect(bridge.getEditorConfiguration().getMode()).toEqual('dark');
    expect(bridge.getEditorConfiguration().isQuickInsertEnabled()).toEqual(
      true,
    );
  });

  it('should have a setter method to set the onEditorConfigChanged handler', async () => {
    // Mock some setup
    const currentDocumentValue = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'World!',
            },
          ],
        },
      ],
    };

    const getValuePromise = new Promise<any>((resolve) =>
      resolve(currentDocumentValue),
    );
    jest
      .spyOn(EditorActions.prototype, 'getValue')
      .mockReturnValue(getValuePromise);

    const editorConfigChanged = jest.fn();
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const replaceDocumentSpy = jest.spyOn(
      bridge.editorActions,
      'replaceDocument',
    );

    // Trigger config change
    const jsonConfig =
      '{ "enableQuickInsert": true,"selectionObserverEnabled": true,"allowCollabProvider": true}';
    const updatedConfig = new MobileEditorConfiguration(jsonConfig);
    bridge.setEditorConfigChangeHandler(editorConfigChanged);
    bridge.configure(jsonConfig);
    expect(editorConfigChanged).toHaveBeenCalledTimes(1);
    expect(editorConfigChanged).toHaveBeenCalledWith(updatedConfig);

    // Make sure replaceDocument() is called with current document value
    // so the Editor reloads with new props.
    await flushPromises();
    expect(replaceDocumentSpy).toHaveBeenCalledTimes(1);
    expect(replaceDocumentSpy).toHaveBeenCalledWith(currentDocumentValue);
  });

  it('should not call cloneAndUpdateConfig when editorConfigChanged is not set', () => {
    const mockedCloneAndUpdateConfig = jest.spyOn(
      MobileEditorConfiguration.prototype,
      'cloneAndUpdateConfig',
    );
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.configure('{mode: "light"}');
    expect(mockedCloneAndUpdateConfig).not.toHaveBeenCalled();
  });

  it(`should fetch the quick insert config from editor config isQuickInsertEnabled method
      when insertTypeAheadItem is called`, () => {
    const isQuickInsertEnabled = jest
      .spyOn(MobileEditorConfiguration.prototype, 'isQuickInsertEnabled')
      .mockReturnValue(false);
    jest.spyOn(PluginKey.prototype, 'getState');
    let bridge = new WebBridgeImpl();
    bridge.editorView = {} as EditorViewWithComposition;
    bridge.insertTypeAheadItem('emoji', '{}');
    expect(isQuickInsertEnabled).toHaveBeenCalledTimes(1);
  });
});

describe('setContent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call replaceContent', () => {
    const content =
      '{"version":1,"type":"doc","content":[{"type":"paragraph","content":[]}]}';
    const bridge: WebBridgeImpl = new WebBridgeImpl();
    const editorView = {
      state: {
        doc: {},
      },
      focus: () => {},
    } as EditorViewWithComposition;
    bridge.editorView = editorView;
    let replaceContentSpy = jest.spyOn(bridge, 'replaceContent');
    bridge.setContent(content);
    expect(replaceContentSpy).toHaveBeenCalledWith(content);
  });
});

describe('replaceContent', () => {
  let toNativeBridge: jest.Mocked<NativeBridge>;
  const content =
    '{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"date","attrs":{"timestamp":"1804966400002"}},{"type":"text","text":" "}]},{"type":"paragraph","content":[]}]}';
  const editorView = {
    state: {
      doc: {},
    },
    focus: () => {},
  } as EditorViewWithComposition;
  const jsonContent: JSONDocNode = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'date',
            attrs: {
              timestamp: '1804966400002',
            },
          },
          {
            type: 'text',
            text: ' ',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };

  beforeEach(async () => {
    ({ toNativeBridge } = ((await import('../../../web-to-native')) as any) as {
      toNativeBridge: jest.Mocked<NativeBridge>;
    });
    jest
      .spyOn(EditorActions.prototype, 'replaceDocument')
      .mockReturnValue(true);
    jest
      .spyOn(BridgeUtils, 'measureContentRenderedPerformance')
      .mockImplementation((_, callback) => {
        callback(4, '{"paragraph":2,"date":1,"text":1}', 1000);
      });

    jest.spyOn(BridgeUtils, 'PerformanceMatrices').mockImplementation(
      () =>
        ({
          duration: 1100,
        } as BridgeUtils.PerformanceMatrices),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call measureContentRenderedPerformance when content is replaced', () => {
    const bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.editorView = editorView;

    bridge.replaceContent(content);

    expect(BridgeUtils.measureContentRenderedPerformance).toHaveBeenCalledWith(
      jsonContent,
      expect.anything(),
    );
  });

  it('should call onContentRendered when content is rendered', () => {
    const bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.editorView = editorView;

    bridge.replaceContent(content);

    expect(toNativeBridge.onContentRendered).toHaveBeenCalledWith(
      4,
      '{"paragraph":2,"date":1,"text":1}',
      1000,
      1100,
    );
  });

  it('should call resetProviders', () => {
    const bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.editorView = editorView;
    const resetProviders = jest.fn();

    bridge.setResetProviders(resetProviders);
    bridge.replaceContent('');

    expect(resetProviders).toBeCalled();
  });
});

describe('Register and Unregister Editor', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const { editorView } = createEditor({
      doc,
    });
    return editorView;
  };
  const editorView = editor(doc(p()));

  let bridge: WebBridgeImpl;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
    jest
      .spyOn(EditorActions.prototype, '_privateGetEditorView')
      .mockReturnValueOnce(editorView);
    jest
      .spyOn(EditorActions.prototype, '_privateGetEventDispatcher')
      .mockReturnValueOnce(new EventDispatcher());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call _privateRegisterEditor when registerEditor method is called', () => {
    const privateRegisterEditor = jest.spyOn(
      EditorActions.prototype,
      '_privateRegisterEditor',
    );
    bridge.registerEditor(new EditorActions());
    expect(privateRegisterEditor).toHaveBeenCalledTimes(1);
  });

  it('should call _privateUnregisterEditor when unregisterEditor method is called', () => {
    const privateUnregisterEditor = jest.spyOn(
      EditorActions.prototype,
      '_privateUnregisterEditor',
    );
    bridge.unregisterEditor();
    expect(privateUnregisterEditor).toHaveBeenCalledTimes(1);
  });
});

describe('perform edit action', () => {
  it('should delegate handling the action to mobile editor toolbar actions', () => {
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const editorView = {} as EditorViewWithComposition;
    bridge.editorView = editorView;
    bridge.mobileEditingToolbarActions.performEditAction = jest.fn();

    bridge.performEditAction('0');

    expect(bridge.mobileEditingToolbarActions.performEditAction).toBeCalledWith(
      '0',
      editorView,
      null,
    );
  });

  it('should delegate handling the action with the given value to the toolbar actions', () => {
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const editorView = {} as EditorViewWithComposition;
    bridge.editorView = editorView;
    bridge.mobileEditingToolbarActions.performEditAction = jest.fn();

    bridge.performEditAction('0', 'value');

    expect(bridge.mobileEditingToolbarActions.performEditAction).toBeCalledWith(
      '0',
      editorView,
      'value',
    );
  });
});

describe('setContentPayload', () => {
  let fetchSpy: jest.SpyInstance;
  let bridge: WebBridgeImpl;
  const editorView = {
    state: {
      doc: {},
    },
    focus: () => {},
  } as EditorViewWithComposition;

  beforeEach(async () => {
    bridge = new WebBridgeImpl();
    bridge.editorView = editorView as EditorViewWithComposition;
    fetchSpy = jest.spyOn(bridge, 'fetchPayload');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should invoke fetchPayload with correct category and uuid', async () => {
    const uuid = '1234567890';
    let adfContent = getEmptyADF();
    fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
    await bridge.setContentPayload(uuid);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith('content', uuid);
  });

  it('should call replaceContent and successful fetch', async () => {
    let adfContent = getEmptyADF();
    let replaceContentSpy = jest.spyOn(bridge, 'replaceContent');
    fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
    await bridge.setContentPayload('123');
    expect(replaceContentSpy).toHaveBeenCalledWith(adfContent);
  });

  it('should not call replaceContent on failed fetch', async () => {
    let replaceContentSpy = jest.spyOn(bridge, 'replaceContent');
    fetchSpy.mockImplementation(() => Promise.reject('error'));
    expect.assertions(2);
    await expect(bridge.setContentPayload('123')).rejects.toEqual('error');
    expect(replaceContentSpy).not.toHaveBeenCalled();
  });
});

describe('onPromiseResolvedPayload', () => {
  let bridge: WebBridgeImpl = new WebBridgeImpl();
  let fetchSpy: jest.SpyInstance;
  let resolvePromiseSpy: jest.SpyInstance;
  let rejectPromiseSpy: jest.SpyInstance;

  beforeEach(async () => {
    bridge.editorView = {} as EditorViewWithComposition;
    fetchSpy = jest.spyOn(bridge, 'fetchPayload');
    resolvePromiseSpy = jest.spyOn(crossPlatformPromise, 'resolvePromise');
    rejectPromiseSpy = jest.spyOn(crossPlatformPromise, 'rejectPromise');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should invoke fetchPayload with correct category and uuid', async () => {
    const uuid = '09876';
    let adfContent = getEmptyADF();
    fetchSpy.mockImplementation(() => Promise.resolve(adfContent));
    await bridge.onPromiseResolvedPayload(uuid);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith('promise', uuid);
  });

  it('should resolvePromise if fetchPayload succeeds', async () => {
    const uuid = '665';
    let someContent = { some: 'content' };
    fetchSpy.mockImplementation(() => Promise.resolve(someContent));
    await bridge.onPromiseResolvedPayload(uuid);
    expect(resolvePromiseSpy).toHaveBeenCalledWith(uuid, someContent);
    expect(rejectPromiseSpy).not.toHaveBeenCalled();
  });

  it('should rejectPromise if fetchPayload fails', async () => {
    const uuid = '665';
    let someError = { message: 'some error' };
    fetchSpy.mockImplementation(() => Promise.reject(someError));
    await bridge.onPromiseResolvedPayload(uuid);
    expect(rejectPromiseSpy).toHaveBeenCalledWith(uuid, someError);
    expect(resolvePromiseSpy).not.toHaveBeenCalled();
  });
});

describe('fetchPayload', () => {
  let bridge: WebBridgeImpl = new WebBridgeImpl();
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should formulate valid request', async () => {
    let someObject = { test: 'test' };
    let stubResponse = new Response(JSON.stringify(someObject));
    fetchSpy.mockImplementation(() => Promise.resolve(stubResponse));

    let returnValue = await bridge.fetchPayload('category', '112233');
    var originURL = new URL(window.location.href);
    originURL.protocol = `fabric-hybrid`;
    let expectedURL = originURL.origin + '/payload/category/112233';
    expect(fetchSpy).toHaveBeenCalledWith(expectedURL);
    expect(returnValue).toEqual(someObject);
  });
});

describe('insert node', () => {
  it('should insert a status node', () => {
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const editorView = {} as EditorViewWithComposition;
    bridge.editorView = editorView;
    bridge.insertNode('status');

    expect(updateStatusWithAnalytics).toBeCalledWith('toolbar', {
      text: '',
      color: 'neutral',
    });
  });

  it('should insert a date node', () => {
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const editorView = {} as EditorViewWithComposition;
    bridge.editorView = editorView;
    bridge.insertNode('date');

    const dateType = dateToDateType(new Date());

    expect(insertDate).toBeCalledWith(dateType, 'toolbar', 'picker');
  });
});

describe('media bridge', () => {
  it('😊 onUploadStart should call uploader.notifyUploadStart and mediaPicker.emit with the expected parameters', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaPicker = new MockCustomMediaPicker();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter =
      '{"testId":"testContent","preview":{"value":"data:testValue"}}';
    await bridge.onUploadStart(mockParameter);
    const startEvent = JSON.parse(mockParameter);

    const pickerPayload = {
      file: {
        id: startEvent.fileId,
        name: startEvent.fileName,
        type: startEvent.fileMimetype,
        size: startEvent.fileSize,
        occurrenceKey: startEvent.occurrenceKey,
        creationDate: Date.now(),
        collectionName: startEvent.collectionName,
      },
      preview: {
        dimensions: {
          width: 100,
          height: 100,
        },
        scaleFactor: window.devicePixelRatio,
      },
    };
    expect(uploader.notifyUploadStart).toBeCalledWith(startEvent);
    expect(bridge.mediaPicker.emit).toBeCalledWith(
      'upload-preview-update',
      pickerPayload,
    );
  });

  it('😊 onUploadStart should call uploader.notifyUploadStart and mediaPicker.emit with the expected parameters (wrong scheme)', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaPicker = new MockCustomMediaPicker();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter =
      '{"testId":"testContent","preview":{"value":"http:testValue"}}';
    await bridge.onUploadStart(mockParameter);
    const startEvent = JSON.parse(mockParameter);
    startEvent.preview = undefined;

    const pickerPayload = {
      file: {
        id: startEvent.fileId,
        name: startEvent.fileName,
        type: startEvent.fileMimetype,
        size: startEvent.fileSize,
        occurrenceKey: startEvent.occurrenceKey,
        creationDate: Date.now(),
        collectionName: startEvent.collectionName,
      },
      preview: {
        dimensions: {
          width: 100,
          height: 100,
        },
        scaleFactor: window.devicePixelRatio,
      },
    };
    expect(uploader.notifyUploadStart).toBeCalledWith(startEvent);
    expect(bridge.mediaPicker.emit).toBeCalledWith(
      'upload-preview-update',
      pickerPayload,
    );
  });

  it('😊 onUploadStart should call uploader.notifyUploadStart and mediaPicker.emit with expected parameters (no preview value, retained dimensions)', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaPicker = new MockCustomMediaPicker();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter =
      '{"testId":"testContent","preview":{"originalDimensions":{"width":120, "height":120}}}';
    await bridge.onUploadStart(mockParameter);
    const startEvent = JSON.parse(mockParameter);
    startEvent.preview = undefined;

    const pickerPayload = {
      file: {
        id: startEvent.fileId,
        name: startEvent.fileName,
        type: startEvent.fileMimetype,
        size: startEvent.fileSize,
        occurrenceKey: startEvent.occurrenceKey,
        creationDate: Date.now(),
        collectionName: startEvent.collectionName,
      },
      preview: {
        dimensions: {
          width: 120,
          height: 120,
        },
        scaleFactor: window.devicePixelRatio,
      },
    };
    expect(uploader.notifyUploadStart).toBeCalledWith(startEvent);
    expect(bridge.mediaPicker.emit).toBeCalledWith(
      'upload-preview-update',
      pickerPayload,
    );
  });

  it('🥺 onUploadStart shortcut if mediaPicker is undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaPicker = undefined;
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadStart(mockParameter);

    expect(uploader.notifyUploadStart).toBeCalledTimes(0);
  });

  it('🥺 onUploadStart shortcut if mediaUpload is undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    bridge.mediaPicker = new MockCustomMediaPicker();
    bridge.mediaUpload = undefined;

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadStart(mockParameter);

    expect(bridge.mediaPicker.emit).toBeCalledTimes(0);
  });

  it('🥺 onUploadStart shortcut if uploader is resolved as undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    bridge.mediaPicker = new MockCustomMediaPicker();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(undefined);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadStart(mockParameter);

    expect(bridge.mediaPicker.emit).toBeCalledTimes(0);
  });

  it('😊 onUploadProgress should call uploader.notifyUploadProgress with the expected parameters', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadProgress(mockParameter);

    const progressEvent = JSON.parse(mockParameter);

    expect(uploader.notifyUploadProgress).toBeCalledWith(progressEvent);
  });

  it('🥺 onUploadProgress shortcut if mediaUpload is undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = undefined;

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadProgress(mockParameter);

    expect(uploader.notifyUploadProgress).toBeCalledTimes(0);
  });

  it('🥺 onUploadProgress shortcut if uploader is resolved as undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(undefined);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadProgress(mockParameter);

    expect(uploader.notifyUploadProgress).toBeCalledTimes(0);
  });

  it('😊 onUploadEnd should call uploader.notifyUploadEnd with the expected parameters', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadEnd(mockParameter);

    const progressEvent = JSON.parse(mockParameter);

    expect(uploader.notifyUploadEnd).toBeCalledWith(progressEvent);
  });

  it('🥺 onUploadEnd shortcut if mediaUpload is undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = undefined;

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadEnd(mockParameter);

    expect(uploader.notifyUploadEnd).toBeCalledTimes(0);
  });

  it('🥺 onUploadEnd shortcut if uploader is resolved as undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(undefined);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadEnd(mockParameter);

    expect(uploader.notifyUploadEnd).toBeCalledTimes(0);
  });

  it('😊 onUploadFail should call uploader.notifyUploadError with the expected parameters', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(uploader);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadFail(mockParameter);

    const progressEvent = JSON.parse(mockParameter);

    expect(uploader.notifyUploadError).toBeCalledWith(progressEvent);
  });

  it('🥺 onUploadFail shortcut if mediaUpload is undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = undefined;

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadFail(mockParameter);

    expect(uploader.notifyUploadError).toBeCalledTimes(0);
  });

  it('🥺 onUploadFail shortcut if uploader is resolved as undefined', async () => {
    let bridge: MediaBridge = new MediaBridge();
    let uploader = new MockMobileUpload();
    bridge.mediaUpload = new Promise((resolve) => {
      resolve(undefined);
    });

    const mockParameter = '{"testId":"testContent"}';
    await bridge.onUploadFail(mockParameter);

    expect(uploader.notifyUploadError).toBeCalledTimes(0);
  });
});
