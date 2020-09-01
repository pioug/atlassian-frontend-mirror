import { createMockCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import {
  LightEditorPlugin,
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { p } from '@atlaskit/editor-test-helpers/schema-builder';
import { CollabEditProvider } from '@atlaskit/editor-common';
import collabEditPlugin from '../../../index';
import { subscribe } from '../../../events/handlers';

const collabProvider = createMockCollabEditProvider();

describe('collab-edit: handlers.ts', () => {
  const collabPreset = new Preset<LightEditorPlugin>().add([
    collabEditPlugin,
    { provider: collabProvider },
  ]);

  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
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

  beforeAll(async () => {
    const { editorView } = editor(p('Hello'));
    provider = await collabProvider;
    spy = jest.spyOn(provider, 'off');

    const cleanup = subscribe(editorView, provider);

    // Additional handlers for same events
    provider.on('connected', externalSpies.connected);
    provider.on('presence', externalSpies.presence);
    provider.on('telepointer', externalSpies.telepointer);

    cleanup();
  });

  it('unsubscribes only local listeners', () => {
    expect(spy).toHaveBeenCalledTimes(7);
  });

  it.each(['connected', 'presence', 'telepointer'])(
    'should call external listener on %s event',
    event => {
      provider.sendMessage({
        type: event,
      });

      expect(externalSpies[event]).toHaveBeenCalled();
    },
  );
});
