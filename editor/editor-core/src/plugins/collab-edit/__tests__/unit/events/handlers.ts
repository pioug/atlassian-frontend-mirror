import { createMockCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { CollabEditProvider } from '@atlaskit/editor-common';
import collabEditPlugin from '../../../index';
import { Cleanup, subscribe } from '../../../events/handlers';
import { applyRemoteData } from '../../../actions';
import { PrivateCollabEditOptions } from '../../../types';
import { MockCollabEditProvider } from '@atlaskit/synchrony-test-helpers/mock-collab-provider';
import { EventEmitter } from 'events';

const mockSynchronyEntityAnalyticsMock = jest.fn();
jest.mock('../../../analytics', () => ({
  ...jest.requireActual<Object>('../../../analytics'),
  addSynchronyEntityAnalytics: () => mockSynchronyEntityAnalyticsMock,
}));

jest.mock('../../../actions');

const collabProvider = createMockCollabEditProvider();

describe('collab-edit: handlers.ts', () => {
  const collabPreset = new Preset<LightEditorPlugin>().add([
    collabEditPlugin,
    {
      provider: collabProvider,
    },
  ]);

  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: collabPreset,
    });

  let provider: CollabEditProvider;
  let spy: jest.SpyInstance;
  const externalSpies: { [key: string]: jest.Mock } = {
    connected: jest.fn(),
    presence: jest.fn(),
    telepointer: jest.fn(),
  };

  describe('subscribe', () => {
    const setup = (
      collabOptions: PrivateCollabEditOptions,
    ): {
      cleanup: Cleanup;
      onSpy: jest.SpyInstance<EventEmitter>;
      offSpy: jest.SpyInstance<EventEmitter>;
      entity: EventEmitter;
    } => {
      const entity = new EventEmitter();
      // default handlers to avoid unhandled exception
      entity.on('error', () => {});
      entity.on('disconnected', () => {});
      const onSpy = jest.spyOn(entity, 'on');
      const offSpy = jest.spyOn(entity, 'off');
      const { editorView } = editor(p('Hello'));
      const cleanup = subscribe(editorView, provider, {
        ...collabOptions,
      });

      provider.sendMessage({
        type: 'entity',
        entity,
      });

      return { cleanup, onSpy, offSpy, entity };
    };

    beforeEach(async () => {
      provider = await collabProvider;
      mockSynchronyEntityAnalyticsMock.mockClear();
    });

    it('should subscribe and unsubscribe entity events', () => {
      const { cleanup, onSpy, offSpy } = setup({
        EXPERIMENTAL_allowInternalErrorAnalytics: true,
      });

      expect(onSpy).toHaveBeenCalledWith('disconnected', expect.anything());
      expect(onSpy).toHaveBeenCalledWith('error', expect.anything());
      cleanup();
      expect(offSpy).toHaveBeenCalledWith('disconnected', expect.anything());
      expect(offSpy).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should not subscribe and unsubscribe entity events if FF is turned off', () => {
      const { cleanup, onSpy, offSpy } = setup({
        EXPERIMENTAL_allowInternalErrorAnalytics: false,
      });

      cleanup();

      expect(onSpy).not.toHaveBeenCalled();
      expect(offSpy).not.toHaveBeenCalled();
    });

    it('calls correct analytics function', () => {
      const { cleanup, entity } = setup({
        EXPERIMENTAL_allowInternalErrorAnalytics: true,
      });

      entity.emit('error', {});
      entity.emit('disconnected', {});
      expect(mockSynchronyEntityAnalyticsMock).toHaveBeenCalledWith('error');
      expect(mockSynchronyEntityAnalyticsMock).toHaveBeenCalledWith(
        'disconnected',
      );
      cleanup();
    });

    it('does not call analytics function after cleanup', () => {
      const { cleanup, entity } = setup({
        EXPERIMENTAL_allowInternalErrorAnalytics: true,
      });
      cleanup();

      entity.emit('error', {});
      entity.emit('disconnected', {});
      expect(mockSynchronyEntityAnalyticsMock).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    beforeAll(async () => {
      const { editorView } = editor(p('Hello'));
      provider = await collabProvider;
      spy = jest.spyOn(provider, 'off');

      const cleanup = subscribe(editorView, provider, {});

      // Additional handlers for same events
      provider.on('connected', externalSpies.connected);
      provider.on('presence', externalSpies.presence);
      provider.on('telepointer', externalSpies.telepointer);

      spy.mockClear();
      cleanup();
    });

    it('unsubscribes only local listeners', () => {
      expect(spy).toHaveBeenCalledTimes(8);
    });

    it.each(['connected', 'presence', 'telepointer'])(
      'should call external listener on %s event',
      (event) => {
        provider.sendMessage({
          type: event,
        });

        expect(externalSpies[event]).toHaveBeenCalled();
      },
    );
  });

  it('should pass right arguments to applyRemoteData on emit data', async function () {
    const { editorView } = editor(p('Hello'));
    provider = await collabProvider;
    const options: PrivateCollabEditOptions = {
      provider: collabProvider,
      userId: 'foo',
      useNativePlugin: true,
    };
    const data = {};

    subscribe(editorView, provider, options);

    (provider as MockCollabEditProvider).emit('data', data);
    expect(applyRemoteData).toHaveBeenCalledWith(data, editorView, options);
  });
});
