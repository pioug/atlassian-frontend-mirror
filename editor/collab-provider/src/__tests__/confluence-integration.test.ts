import { CollabTelepointerPayload, Config, PresencePayload } from '../types';
import { createSocketIOCollabProvider } from '../socket-io-provider';
import { collab } from '@atlaskit/prosemirror-collab';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import type { Provider } from '../provider';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import SocketIOClient from 'socket.io-client';
import { mockIo } from './jest_mocks/socket.io-client.mock';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

describe('Collab Provider Integration Tests - Confluence', () => {
  let provider: Provider;
  const documentAri =
    'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:page/1731046230';
  const collabProviderUrl = 'http://localhost/ccollab'; // Not important but preparing this for a good E2E test
  const getUserMock = jest.fn();
  const analyticsWebClientMock: AnalyticsWebClient = {
    sendUIEvent: jest.fn(),
    sendOperationalEvent: jest.fn(),
    sendTrackEvent: jest.fn(),
    sendScreenEvent: jest.fn(),
  };
  const permissionTokenRefreshMock = jest.fn(() => Promise.resolve('hello'));

  const providerConfig: Omit<Config, 'createSocket'> = {
    documentAri,
    url: collabProviderUrl,
    getUser: getUserMock,
    need404: true,
    analyticsClient: analyticsWebClientMock,
    productInfo: {
      product: 'Confluence',
    },
    permissionTokenRefresh: permissionTokenRefreshMock,
  };

  // Create fake EditorState with Collab Plugin
  const editorState = createEditorState(
    doc(p('lol')),
    collab({ clientID: 3771180701 }) as SafePlugin, // Just trust me
  );
  const getStateMock = jest.fn().mockReturnValue(editorState);

  beforeEach(() => {
    provider = createSocketIOCollabProvider(providerConfig);
    provider.on('error', () => {}); // Noop error handler so the mock throwing errors doesn't cause issues

    // Mock out the Socket IO client
    // @ts-expect-error this is some weird mocking type stuff
    jest.spyOn(SocketIOClient, 'io').mockImplementationOnce(mockIo.io);
  });

  afterEach(() => {
    provider.destroy();
    jest.clearAllMocks();
  });

  describe('event listeners', () => {
    it('should emit a connecting event when the collab provider is trying to connect', (done) => {
      provider.on('connecting', (payload) => {
        expect(payload).toEqual({
          initial: true,
        });

        done();
      });

      provider.initialize(getStateMock);
    });

    it('should emit an init event when the collab provider is initialised', (done) => {
      provider.on('init', (payload) => {
        expect(payload).toEqual({
          doc: {
            content: [
              {
                content: [
                  {
                    text: 'lol',
                    type: 'text',
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'doc',
          },
          metadata: {
            expire: 1680844522,
            title: 'Notes',
          },
          version: 3,
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();
    });

    it('should emit data event when the editor document data updates', (done) => {
      provider.on('data', (payload) => {
        expect(payload).toEqual({
          json: [
            {
              stepType: 'replace',
              from: 160,
              to: 160,
              slice: { content: [{ type: 'text', text: 'l' }] },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
            {
              stepType: 'replace',
              from: 161,
              to: 161,
              slice: { content: [{ type: 'text', text: 'o' }] },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
            {
              stepType: 'replace',
              from: 162,
              to: 162,
              slice: { content: [{ type: 'text', text: 'l' }] },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
          ],
          version: 3,
          userIds: [71949442, 71949442, 71949442],
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();
    });

    describe('metadata', () => {
      it('should emit a metadata:changed event when the metadata changes', (done) => {
        provider.on('metadata:changed', (payload) => {
          expect(payload).toEqual({
            expire: 1680844522, // TODO: Get rid of this in the back-end before sending to FE
            title: 'Notes',
          });
          done();
        });

        provider.initialize(getStateMock);
        // Socket IO connects automatically but the mock doesn't
        // @ts-expect-error mocking Socket IO client behaviour
        provider.channel.getSocket().connect();
      });

      it('should be able to set and get metadata', () => {
        provider.initialize(getStateMock);
        const socketEmitSpy = jest.spyOn(
          (provider as any).channel.getSocket(),
          'emit',
        );
        // Socket IO connects automatically but the mock doesn't
        // @ts-expect-error mocking Socket IO client behaviour
        provider.channel.getSocket().connect();

        // The backend responds with metadata:changed
        socketEmitSpy.mockClear();
        const mockMetaData = {
          editorWidth: 300,
          title: 'Notes',
        };
        provider.setMetadata(mockMetaData);
        expect(provider.getMetadata()).toEqual(mockMetaData);
        expect(socketEmitSpy).toBeCalledTimes(1);
        expect(socketEmitSpy).toBeCalledWith('metadata', mockMetaData);
      });
    });

    it('should emit a connected event when connection is established', (done) => {
      provider.on('connected', (payload) => {
        expect(payload).toEqual({
          sid: 'mock-socket.io-client',
          initial: true,
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();
    });

    it('should emit a disconnected event when connection is lost', (done) => {
      provider.on('disconnected', (payload) => {
        expect(payload).toEqual({
          reason: 'SOCKET_CLOSED',
          sid: 'mock-socket.io-client',
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();

      // Disconnect event, triggered by SocketIO
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().emit('disconnect', 'transport close');
    });

    it('should emit a presence event when a new member joins the editing session', (done) => {
      provider.on('presence', (payload) => {
        expect(payload).toEqual({
          joined: [
            {
              name: '',
              avatar: '',
              sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
              lastActive: 1680759407071,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              clientId: 3274991230,
              email: '',
            },
          ],
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();
    });

    it('should emit an error event when an error occurred in the collab provider', (done) => {
      provider.on('error', (payload) => {
        expect(payload).toEqual({
          code: 'DOCUMENT_NOT_FOUND',
          message: 'The requested document is not found',
          recoverable: true,
          status: 404,
        });
        done();
      });

      provider.initialize(getStateMock);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();

      // Something went wrong!
      // @ts-expect-error mocking errors without breaking all tests
      provider.channel.getSocket().emit('error', {
        message: 'The requested document is not found',
        data: {
          code: 'DOCUMENT_NOT_FOUND',
          status: 404,
        },
      });
    });
  });

  describe('call-backs', () => {
    it('should call the getState callback when initialising the collab provider', () => {
      provider.initialize(getStateMock);
      expect(getStateMock).toHaveBeenCalledTimes(1);
    });

    it('should call the getUser callback when updating participants', async () => {
      provider.initialize(getStateMock);

      const fakePresencePayload: PresencePayload = {
        sessionId: 'abc',
        userId: 'abc',
        clientId: 0,
        timestamp: 0,
      };
      // @ts-ignore accessing private method for testing purposes
      await provider.participantsService.onParticipantUpdated(
        fakePresencePayload,
      );
      expect(getUserMock).toHaveBeenCalledTimes(1);
      expect(getUserMock).toHaveBeenCalledWith(fakePresencePayload.userId);
    });

    it('should call the permissionTokenRefresh call-back on establishing the connection', () => {
      provider.initialize(getStateMock);
      expect(permissionTokenRefreshMock).toBeCalledTimes(1);
      // Socket IO connects automatically but the mock doesn't
      // @ts-expect-error mocking Socket IO client behaviour
      provider.channel.getSocket().connect();
      expect(permissionTokenRefreshMock).toBeCalledTimes(2);
    });
  });

  describe('entry points', () => {
    it('should return the current document state when calling getCurrentState()', async () => {
      provider.initialize(getStateMock);
      const currentDocumentState = await provider.getCurrentState();
      expect(currentDocumentState).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "content": Array [
              Object {
                "content": Array [
                  Object {
                    "text": "lol",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "doc",
            "version": 1,
          },
          "stepVersion": 0,
          "title": undefined,
        }
      `);
    });

    it('should throw an error if there is a problem when calling getCurrentState()', async () => {
      provider.initialize(getStateMock);
      // @ts-ignore accessing private property for testing purposes
      provider.documentService.getState = jest.fn().mockImplementation(() => {
        throw new Error('fake error');
      });
      expect(provider).toHaveProperty('analyticsHelper');
      const analyticsHelperSpy = jest.spyOn(
        // @ts-ignore accessing private method for testing purposes
        provider.analyticsHelper,
        'sendErrorEvent',
      );
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"fake error"`);

      expect(analyticsHelperSpy).toHaveBeenCalledTimes(2);
      expect(analyticsHelperSpy).toHaveBeenCalledWith(
        new Error('fake error'),
        'Error while returning ADF version of current draft document',
      );
    });

    it('should return the final acknowledged document state when calling getFinalAcknowledgedState()', async () => {
      provider.initialize(getStateMock);
      const finalDocumentState = await provider.getFinalAcknowledgedState();
      expect(finalDocumentState).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "content": Array [
              Object {
                "content": Array [
                  Object {
                    "text": "lol",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "doc",
            "version": 1,
          },
          "stepVersion": 0,
          "title": undefined,
        }
      `);
    });

    it('should throw an error if there is a problem when calling getFinalAcknowledgedState()', async () => {
      provider.initialize(getStateMock);
      // @ts-ignore accessing private property for testing purposes
      provider.documentService.getCurrentState = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('fake error');
        });
      expect(provider).toHaveProperty('analyticsHelper');
      const analyticsHelperSpy = jest.spyOn(
        // @ts-ignore accessing private method for testing purposes
        provider.analyticsHelper,
        'sendErrorEvent',
      );
      await expect(
        provider.getFinalAcknowledgedState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"fake error"`);

      expect(analyticsHelperSpy).toHaveBeenCalledTimes(2);
      expect(analyticsHelperSpy).toHaveBeenCalledWith(
        new Error('fake error'),
        'Error while returning ADF version of the final draft document',
      );
    });

    it('should be unable to use the provider after calling .destroy()', async () => {
      const unsubscribeSpy = jest.spyOn(provider, 'unsubscribeAll');
      await provider.destroy();
      expect(unsubscribeSpy).toBeCalledTimes(1);
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"_this.getState is not a function"`,
      );
    });

    it('should be unable to use the provider after calling .disconnect()', async () => {
      const unsubscribeSpy = jest.spyOn(provider, 'unsubscribeAll');
      await provider.disconnect();
      expect(unsubscribeSpy).toBeCalledTimes(1);
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"_this.getState is not a function"`,
      );
    });

    it('should be able to set the title using setMetadata', async () => {
      provider.initialize(getStateMock);
      await provider.setMetadata({ title: 'abc' });
      const currentDocumentState = await provider.getCurrentState();
      expect(currentDocumentState.title).toEqual('abc');
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.getTitle()).toEqual('abc');
    });

    it('should be able to set arbitrary metadata using setMetadata', async () => {
      provider.initialize(getStateMock);
      await provider.setMetadata({ foo: 'bar' });
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.metadata.foo).toEqual('bar');
    });

    it('should send a message (sendMessage)', () => {
      provider.initialize(getStateMock);

      const telepointerData: CollabTelepointerPayload = {
        type: 'telepointer',
        selection: {
          type: 'textSelection',
          anchor: 1,
          head: 1,
        },
        sessionId: 'abc',
      };
      // @ts-ignore accessing private property for testing purposes
      const broadcastSpy = jest.spyOn(provider.channel, 'broadcast');
      provider.sendMessage(telepointerData);
      expect(broadcastSpy).toBeCalledTimes(1);
    });

    it('should not throw an error when sendMessage fails to broadcast', () => {
      const telepointerData: CollabTelepointerPayload = {
        type: 'telepointer',
        selection: {
          type: 'textSelection',
          anchor: 1,
          head: 1,
        },
        sessionId: 'abc',
      };
      const fakeError = new Error('fake broadcast error');
      // @ts-ignore accessing private property for testing purposes
      jest.spyOn(provider.channel, 'broadcast').mockImplementation(() => {
        throw fakeError;
      });
      expect(provider).toHaveProperty('analyticsHelper');
      const analyticsHelperSpy = jest.spyOn(
        // @ts-ignore accessing private method for testing purposes
        provider.analyticsHelper,
        'sendErrorEvent',
      );
      provider.sendMessage(telepointerData); // does nothing
      expect(analyticsHelperSpy).toHaveBeenCalledTimes(1);
      expect(analyticsHelperSpy).toHaveBeenCalledWith(
        fakeError,
        'Error while sending message - telepointer',
      );
    });

    it('should be unusable before calling setup, and usable after', async () => {
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"_this.getState is not a function"`,
      );
      expect(() => {
        provider.setMetadata({ title: 'abc' });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Cannot send metadata, not initialized yet"`,
      );
      provider.setup({ getState: getStateMock });
      await provider.setMetadata({ title: 'abc' });
      const currentDocumentState = await provider.getCurrentState();
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.getTitle()).toEqual('abc');
      expect(currentDocumentState).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "content": Array [
              Object {
                "content": Array [
                  Object {
                    "text": "lol",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "doc",
            "version": 1,
          },
          "stepVersion": 0,
          "title": "abc",
        }
      `);
    });

    it('should be unusable before calling initialize, and usable after', async () => {
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"_this.getState is not a function"`,
      );
      expect(() => {
        provider.setMetadata({ title: 'abc' });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Cannot send metadata, not initialized yet"`,
      );

      provider.initialize(getStateMock);
      await provider.setMetadata({ title: 'abc' });
      const currentDocumentState = await provider.getCurrentState();
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.getTitle()).toEqual('abc');
      expect(currentDocumentState).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "content": Array [
              Object {
                "content": Array [
                  Object {
                    "text": "lol",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "doc",
            "version": 1,
          },
          "stepVersion": 0,
          "title": "abc",
        }
      `);
    });

    it('should fail to set up the provider if getState is missing the collab plugin when calling initialize()', async () => {
      const badEditorState = createEditorState(doc(p('lol'))); // missing collab plugin
      const badGetStateMock = jest.fn().mockReturnValue(badEditorState);
      expect(provider).toHaveProperty('analyticsHelper');
      const analyticsHelperSpy = jest.spyOn(
        // @ts-ignore accessing private method for testing purposes
        provider.analyticsHelper,
        'sendErrorEvent',
      );
      expect(() => {
        provider.initialize(badGetStateMock);
      }).toThrowErrorMatchingInlineSnapshot(
        `"Collab provider attempted to initialise, but Editor state is missing collab plugin"`,
      );

      expect(analyticsHelperSpy).toHaveBeenCalledTimes(1);
      expect(analyticsHelperSpy).toHaveBeenCalledWith(
        new Error(
          'Collab provider attempted to initialise, but Editor state is missing collab plugin',
        ),
        'Error while initialising the provider',
      );
    });

    it('should fail to set up the provider if getState is missing the collab plugin when calling setup()', async () => {
      const badEditorState = createEditorState(doc(p('lol'))); // missing collab plugin
      const badGetStateMock = jest.fn().mockReturnValue(badEditorState);
      expect(provider).toHaveProperty('analyticsHelper');
      const analyticsHelperSpy = jest.spyOn(
        // @ts-ignore accessing private method for testing purposes
        provider.analyticsHelper,
        'sendErrorEvent',
      );
      expect(() => {
        provider.setup({ getState: badGetStateMock });
      }).toThrowErrorMatchingInlineSnapshot(
        `"Collab provider attempted to initialise, but Editor state is missing collab plugin"`,
      );

      expect(analyticsHelperSpy).toHaveBeenCalledTimes(1);
      expect(analyticsHelperSpy).toHaveBeenCalledWith(
        new Error(
          'Collab provider attempted to initialise, but Editor state is missing collab plugin',
        ),
        'Error while initialising the provider',
      );
    });

    it("should change the document's title when calling setTitle", async () => {
      provider.initialize(getStateMock);
      const inputTitle = 'abc';
      await provider.setTitle(inputTitle);
      const currentDocumentState = await provider.getCurrentState();
      expect(currentDocumentState.title).toEqual(inputTitle);
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.getTitle()).toEqual(inputTitle);
    });

    it('should set the editor with when calling setEditorWidth', async () => {
      provider.initialize(getStateMock);
      await provider.setEditorWidth('3', true);
      // @ts-ignore accessing private property for testing purposes
      expect(provider.metadataService.metadata.editorWidth).toEqual('3');
    });

    it('should be unable to use the provider after calling .unsubscribeAll()', async () => {
      await provider.unsubscribeAll();
      await expect(
        provider.getCurrentState(),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"_this.getState is not a function"`,
      );
    });

    it('should return the current unconfirmed steps', () => {
      const editorState = createEditorState(
        doc(p('lol')),
        collab({ clientID: 3771180701 }) as SafePlugin,
      );

      const getStateMock = jest.fn().mockReturnValue(editorState);
      provider.initialize(getStateMock);
      let steps = provider.getUnconfirmedSteps();
      expect(steps).toEqual(undefined);

      const tr = editorState.tr.replace(2, 3);
      let newState = editorState.apply(tr);
      getStateMock.mockReturnValue(newState);
      steps = provider.getUnconfirmedSteps();
      let stepsJson = steps && steps.map((s) => s.toJSON());
      expect(stepsJson).toEqual([{ from: 2, to: 3, stepType: 'replace' }]);
    });
  });
});
