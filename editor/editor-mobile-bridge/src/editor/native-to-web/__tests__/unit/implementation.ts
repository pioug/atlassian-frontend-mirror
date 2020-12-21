import { measureRender } from '@atlaskit/editor-common';
import WebBridgeImpl, { defaultSetList } from '../../implementation';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';
import NativeBridge from '../../../web-to-native/bridge';
import { dismissCommand } from '@atlaskit/editor-core';
import { EditorViewWithComposition } from '../../../../types';
import MobileEditorConfiguration from '../../../editor-configuration';

jest.mock('../../../web-to-native');
jest.mock('@atlaskit/editor-core', () => ({
  ...(jest.genMockFromModule('@atlaskit/editor-core') as object),
  dismissCommand: jest.fn(),
  EditorActions: () => ({
    replaceDocument: () => true,
  }),
  getNodesCount: () => ({ paragraph: 2, date: 1, text: 1 }),
}));
jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  measureRender: jest.fn((name, callback) => {
    callback();
  }),
}));

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
      item => !removeList.includes(item),
    );
    bridgeVer.removeQuickInsertAllowListItem(JSON.stringify(removeList));
    expect(bridgeVer.getQuickInsertAllowList()).toBe(
      JSON.stringify(newListExpected),
    );
  });
});

describe('PageTitle Bridge', () => {
  let bridgeVer: WebBridgeImpl;
  let toNativeBridge: jest.Mocked<NativeBridge>;

  const createMockCollabProvider = () => {
    return ({
      setTitle: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    } as unknown) as CollabProvider;
  };

  beforeEach(async () => {
    ({ toNativeBridge } = ((await import('../../../web-to-native')) as any) as {
      toNativeBridge: jest.Mocked<NativeBridge>;
    });
    bridgeVer = new WebBridgeImpl();
  });

  it('should invoke collabProvider setTitle method', async function () {
    const provider = createMockCollabProvider();
    const title = 'foo';

    bridgeVer.setupTitle(Promise.resolve(provider));

    bridgeVer.setTitle(title);

    await new Promise(resolve => process.nextTick(() => resolve()));

    expect(provider.setTitle).toHaveBeenCalledWith(title, true);
  });

  it('should not invoke collabProvider setTitle method when the setupTitle method has not been called', async function () {
    const provider = createMockCollabProvider();
    const title = 'foo';

    bridgeVer.setTitle(title);

    await new Promise(resolve => process.nextTick(() => resolve()));

    expect(provider.setTitle).not.toHaveBeenCalledWith(title, true);
  });

  it('should update title in native when title:change event is received', async function () {
    const provider = createMockCollabProvider();
    const title = 'foo';

    bridgeVer.setupTitle(Promise.resolve(provider));
    await new Promise(resolve => process.nextTick(() => resolve()));

    // Simulate the emit event from collab provider
    (provider.on as jest.MockedFunction<any>).mock.calls[0][1]({ title });

    expect(toNativeBridge.updateTitle).toHaveBeenCalledWith(title);
  });

  it('should subscribe to title:change event', async function () {
    const provider = createMockCollabProvider();

    bridgeVer.setupTitle(Promise.resolve(provider));
    await new Promise(resolve => process.nextTick(() => resolve()));

    expect(provider.on).toHaveBeenCalledWith(
      'metadata:changed',
      expect.anything(),
    );
  });

  it('should unsubscribe to title:change event', async function () {
    const provider = createMockCollabProvider();

    const destroy = bridgeVer.setupTitle(Promise.resolve(provider));
    destroy();
    await new Promise(resolve => process.nextTick(() => resolve()));

    expect(provider.off).toHaveBeenCalledWith(
      'metadata:changed',
      expect.anything(),
    );
  });
});

describe('TypeAhead Bridge', () => {
  let toNativeBridge: jest.Mocked<NativeBridge>;
  let bridge: WebBridgeImpl = new WebBridgeImpl();

  beforeEach(async () => {
    ({ toNativeBridge } = require('../../../web-to-native'));
    bridge.editorView = {} as EditorViewWithComposition;
  });

  afterEach(() => {
    toNativeBridge.dismissTypeAhead.mockClear();
    ((dismissCommand as Function) as jest.Mock<{}>).mockClear();
  });

  it('should invoke dismissTypeAhead on native bridge when dismissCommand succeedes', () => {
    ((dismissCommand as Function) as jest.Mock<{}>).mockImplementation(
      () => () => true,
    );
    bridge.cancelTypeAhead();
    expect(toNativeBridge.dismissTypeAhead).toHaveBeenCalled();
  });

  it('should not invoke dismissTypeAhead on native bridge when dismissCommand fails', () => {
    ((dismissCommand as Function) as jest.Mock<{}>).mockImplementation(
      () => () => false,
    );
    bridge.cancelTypeAhead();
    expect(toNativeBridge.dismissTypeAhead).not.toHaveBeenCalled();
  });
});

describe('Bridge with editorConfiguration and onEditorConfigChange', () => {
  it('should initialise editorConfiguration with default configs when no configs are passed', () => {
    const expectedEditorConfig = new MobileEditorConfiguration();

    let bridge: WebBridgeImpl = new WebBridgeImpl();

    expect(bridge.getEditorConfiguration()).toEqual(expectedEditorConfig);
  });

  it('should have a setter method to set the editor config', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"mode": "dark","enableQuickInsert": true}',
    );
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.setEditorConfiguration(editorConfig);
    expect(bridge.getEditorConfiguration().mode()).toEqual('dark');
    expect(bridge.getEditorConfiguration().isQuickInsertEnabled()).toEqual(
      true,
    );
  });

  it('should have a setter method to set the onEditorConfigChanged handler', () => {
    const editorConfigChanged = jest.fn();
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    const jsonConfig =
      '{ "enableQuickInsert": true,"selectionObserverEnabled": true,"allowCollabProvider": true}';
    const updatedConfig = new MobileEditorConfiguration(jsonConfig);
    bridge.setEditorConfigChangeHandler(editorConfigChanged);
    bridge.configureEditor(jsonConfig);
    expect(editorConfigChanged).toHaveBeenCalledTimes(1);
    expect(editorConfigChanged).toHaveBeenCalledWith(updatedConfig);
  });

  it('should not call cloneAndUpdateConfig when editorConfigChanged is not set', () => {
    const mockedCloneAndUpdateConfig = jest.fn();
    MobileEditorConfiguration.prototype.cloneAndUpdateConfig = mockedCloneAndUpdateConfig;
    let bridge: WebBridgeImpl = new WebBridgeImpl();
    bridge.configureEditor('{mode: "light"}');
    expect(mockedCloneAndUpdateConfig).not.toHaveBeenCalled();
  });

  describe('setContent', () => {
    let toNativeBridge: jest.Mocked<NativeBridge>;
    const content =
      '{"version":1,"type":"doc","content":[{"type":"paragraph","content":[{"type":"date","attrs":{"timestamp":"1804966400002"}},{"type":"text","text":" "}]},{"type":"paragraph","content":[]}]}';
    const editorView = {
      state: {
        doc: {},
      },
    } as EditorViewWithComposition;

    beforeEach(async () => {
      ({ toNativeBridge } = ((await import(
        '../../../web-to-native'
      )) as any) as {
        toNativeBridge: jest.Mocked<NativeBridge>;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call measureRender when content is replaced', () => {
      const bridge: WebBridgeImpl = new WebBridgeImpl();
      bridge.editorView = editorView;

      bridge.setContent(content);

      expect(measureRender).toHaveBeenCalledWith(
        'ProseMirror Content Render Time',
        expect.anything(),
      );
    });

    it('should call onContentRendered when content is rendered', () => {
      const bridge: WebBridgeImpl = new WebBridgeImpl();
      bridge.editorView = editorView;

      bridge.setContent(content);

      expect(toNativeBridge.onContentRendered).toHaveBeenCalledWith(
        4,
        '{"paragraph":2,"date":1,"text":1}',
      );
    });
  });
});
