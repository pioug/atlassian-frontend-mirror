import React from 'react';

import { act, render } from '@testing-library/react';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { MultiBodiedExtensionActions } from '@atlaskit/editor-common/extensions';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  extensionFrame,
  multiBodiedExtension,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { default as MultiBodiedExtension } from './index';
import type { TryExtensionHandlerType } from './index';

const mockFireAnalyticsEvent = jest.fn();

jest.mock('@atlaskit/editor-common/event-dispatcher', () => ({
  ...jest.requireActual('@atlaskit/editor-common/event-dispatcher'),
  createDispatch: jest.fn(() => mockFireAnalyticsEvent),
}));

describe('MultiBodiedExtension', () => {
  const noop: TryExtensionHandlerType = () => null;
  const tryExtensionHandler = jest.fn(noop);

  let handleContentDOMRefFake: (element: HTMLElement | null) => void;
  let getPosFake: () => number | undefined;
  let editorView: EditorView;
  let node: PMNode;
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    handleContentDOMRefFake = jest.fn();
    getPosFake = jest.fn(() => 0);

    const state = createEditorState(
      doc(
        multiBodiedExtension({
          extensionKey: 'lol',
          extensionType: 'lolType',
          maxFrames: 3,
        })(extensionFrame()(p('Hello')), extensionFrame()(p('World'))),
      ),
    );

    editorView = new EditorView(null, {
      state,
    });
    eventDispatcher = new EventDispatcher();
    node = editorView.state.doc.nodeAt(0)!;
  });

  describe('when rendered for the first time', () => {
    it('should set the active child to zero', () => {
      const { getByTestId } = render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
        />,
      );

      expect(getByTestId('multiBodiedExtension--container')).toHaveAttribute(
        'data-active-child-index',
        '0',
      );
    });

    it('should render the extensionHandlerResult inside the navigation', () => {
      tryExtensionHandler.mockReturnValue(<span>WORKING</span>);
      const { getByTestId } = render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
        />,
      );

      expect(
        getByTestId('multiBodiedExtension-navigation').textContent,
      ).toEqual('WORKING');
    });
  });

  describe('when handlers calls the API.changeActive', () => {
    it('should change the active child', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return <span>WORKING</span>;
      });

      const { getByTestId } = render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
        />,
      );

      act(() => {
        api?.changeActive(1);
      });

      expect(getByTestId('multiBodiedExtension--container')).toHaveAttribute(
        'data-active-child-index',
        '1',
      );
    });
  });

  describe('when handlers calls the API.addChild', () => {
    it('should a new extension frame inside the current multiextension node after last frame', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return <span>WORKING</span>;
      });

      render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
          eventDispatcher={eventDispatcher}
        />,
      );

      act(() => {
        api?.addChild();
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'lol',
            extensionType: 'lolType',
            maxFrames: 3,
          })(
            extensionFrame()(p('Hello')),
            extensionFrame()(p('World')),
            extensionFrame()(p()),
          ),
        ),
      );

      // Analytics
      expect(mockFireAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(mockFireAnalyticsEvent).toHaveBeenCalledWith(
        analyticsEventKey,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'addChild',
            actionSubject: 'multiBodiedExtension',
            attributes: expect.objectContaining({
              currentFramesCount: 2,
              extensionType: 'lolType',
              extensionKey: 'lol',
              localId: null,
              maxFramesCount: 3,
            }),
            eventType: 'track',
          }),
        }),
      );
    });

    describe('and when child count is already equal than maxFrame', () => {
      it('should not add a new frame and throw error', () => {
        let api: MultiBodiedExtensionActions | undefined;
        tryExtensionHandler.mockImplementation((_api) => {
          api = _api;
          return <span>WORKING</span>;
        });

        render(
          <MultiBodiedExtension
            node={node}
            editorView={editorView}
            getPos={getPosFake}
            handleContentDOMRef={handleContentDOMRefFake}
            tryExtensionHandler={tryExtensionHandler}
          />,
        );

        act(() => {
          api?.addChild();
        });

        node = editorView.state.doc.nodeAt(0)!;
        render(
          <MultiBodiedExtension
            node={node}
            editorView={editorView}
            getPos={getPosFake}
            handleContentDOMRef={handleContentDOMRefFake}
            tryExtensionHandler={tryExtensionHandler}
          />,
        );
        act(() => {
          expect(() => api?.addChild()).toThrow(
            new Error('Cannot add more than 3 frames'),
          );
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            multiBodiedExtension({
              extensionKey: 'lol',
              extensionType: 'lolType',
              maxFrames: 3,
            })(
              extensionFrame()(p('Hello')),
              extensionFrame()(p('World')),
              extensionFrame()(p()),
            ),
          ),
        );
      });
    });
  });

  describe('when handlers calls the API.removeChild', () => {
    it('should remove the first frame', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return null;
      });

      render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
          eventDispatcher={eventDispatcher}
        />,
      );

      act(() => {
        api?.removeChild(0);
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'lol',
            extensionType: 'lolType',
            maxFrames: 3,
          })(extensionFrame()(p('World'))),
        ),
      );
      expect(mockFireAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(mockFireAnalyticsEvent).toHaveBeenCalledWith(
        analyticsEventKey,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'removeChild',
            actionSubject: 'multiBodiedExtension',
            attributes: expect.objectContaining({
              currentFramesCount: 2,
              extensionType: 'lolType',
              extensionKey: 'lol',
              localId: null,
              maxFramesCount: 3,
            }),
            eventType: 'track',
          }),
        }),
      );
    });

    it('should remove the last frame', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return null;
      });

      render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
        />,
      );

      act(() => {
        api?.removeChild(1);
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'lol',
            extensionType: 'lolType',
            maxFrames: 3,
          })(extensionFrame()(p('Hello'))),
        ),
      );
    });

    describe('when there is only one frame', () => {
      it('should remove the entire multiBodiedExtension', () => {
        let api: MultiBodiedExtensionActions | undefined;
        tryExtensionHandler.mockImplementation((_api) => {
          api = _api;
          return null;
        });

        render(
          <MultiBodiedExtension
            node={node}
            editorView={editorView}
            getPos={getPosFake}
            handleContentDOMRef={handleContentDOMRefFake}
            tryExtensionHandler={tryExtensionHandler}
          />,
        );

        act(() => {
          api?.removeChild(0);
        });
        node = editorView.state.doc.nodeAt(0)!;
        render(
          <MultiBodiedExtension
            node={node}
            editorView={editorView}
            getPos={getPosFake}
            handleContentDOMRef={handleContentDOMRefFake}
            tryExtensionHandler={tryExtensionHandler}
          />,
        );

        act(() => {
          api?.removeChild(0);
        });

        expect(editorView.state.doc).toEqualDocument(doc(p()));
      });
    });
  });

  describe('when handlers calls the API.getChildren', () => {
    it('should return the children', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return null;
      });

      render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
          eventDispatcher={eventDispatcher}
        />,
      );
      let result;
      act(() => {
        result = api?.getChildren();
      });
      expect(result).toEqual([
        {
          content: [
            {
              content: [
                {
                  text: 'Hello',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'extensionFrame',
        },
        {
          content: [
            {
              content: [
                {
                  text: 'World',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'extensionFrame',
        },
      ]);
      expect(mockFireAnalyticsEvent).toHaveBeenCalledTimes(3);
      expect(mockFireAnalyticsEvent).toHaveBeenCalledWith(
        analyticsEventKey,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'getChildern',
            actionSubject: 'multiBodiedExtension',
            attributes: expect.objectContaining({
              currentFramesCount: 2,
              extensionType: 'lolType',
              extensionKey: 'lol',
              localId: null,
              maxFramesCount: 3,
            }),
            eventType: 'track',
          }),
        }),
      );
    });
  });

  describe('when handlers calls the API.updateParameters', () => {
    it('should add and update the parameters', () => {
      let api: MultiBodiedExtensionActions | undefined;
      tryExtensionHandler.mockImplementation((_api) => {
        api = _api;
        return null;
      });

      render(
        <MultiBodiedExtension
          node={node}
          editorView={editorView}
          getPos={getPosFake}
          handleContentDOMRef={handleContentDOMRefFake}
          tryExtensionHandler={tryExtensionHandler}
          eventDispatcher={eventDispatcher}
        />,
      );
      let result;
      act(() => {
        result = api?.updateParameters({ testParam: 'testValue1' });
      });
      expect(result).toBeTruthy();
      expect(editorView.state.doc).toEqualDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'lol',
            extensionType: 'lolType',
            maxFrames: 3,
            parameters: {
              macroParams: {
                testParam: 'testValue1',
              },
            },
          })(extensionFrame()(p('Hello')), extensionFrame()(p('World'))),
        ),
      );
      // Update the parameters with new values
      act(() => {
        result = api?.updateParameters({
          testParam: 'updatedValue1',
          testParam2: 'testValue2',
        });
      });
      expect(result).toBeTruthy();
      expect(editorView.state.doc).toEqualDocument(
        doc(
          multiBodiedExtension({
            extensionKey: 'lol',
            extensionType: 'lolType',
            maxFrames: 3,
            parameters: {
              macroParams: {
                testParam: 'updatedValue1',
                testParam2: 'testValue2',
              },
            },
          })(extensionFrame()(p('Hello')), extensionFrame()(p('World'))),
        ),
      );
      expect(mockFireAnalyticsEvent).toHaveBeenCalledTimes(5);
      expect(mockFireAnalyticsEvent).toHaveBeenCalledWith(
        analyticsEventKey,
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'updateParameters',
            actionSubject: 'multiBodiedExtension',
            attributes: expect.objectContaining({
              currentFramesCount: 2,
              extensionType: 'lolType',
              extensionKey: 'lol',
              localId: null,
              maxFramesCount: 3,
            }),
            eventType: 'track',
          }),
        }),
      );
    });
  });
});
