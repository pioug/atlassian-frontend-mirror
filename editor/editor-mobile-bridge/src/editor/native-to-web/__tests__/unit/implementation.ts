import WebBridgeImpl, { defaultSetList } from '../../implementation';
import { bridge } from '../../../mobile-editor-element';
jest.mock('../../../web-to-native');

describe('Collab Web Bridge', () => {
  let bridge: WebBridgeImpl;

  beforeEach(() => {
    bridge = new WebBridgeImpl();
  });

  it('should not have a socket by default', () => {
    expect(bridge.collabSocket).toBeNull();
  });

  it('should create a collab socket', function() {
    const socket = bridge.createCollabSocket('http://atlassian.com');

    expect(bridge.collabSocket).toBe(socket);
  });

  it('should remove the socket on close', function() {
    const socket = bridge.createCollabSocket('http://atlassian.com');

    socket.close();

    expect(bridge.collabSocket).toBeNull();
  });

  it('should emit the received event', function(next) {
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
  it('should create a lifecycle on creation', function() {
    expect(bridge.lifecycle).not.toBeUndefined();
  });

  it('should invoke events registered on `save`', function() {
    const fn = jest.fn();
    bridge.lifecycle.on('save', fn);
    bridge.saveCollabChanges();

    expect(fn).toHaveBeenCalled();
  });

  it('should invoke events registered on `restore`', function() {
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
