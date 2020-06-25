import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema/src/schema/marks/annotation';
import MobileRenderer from '../../mobile-renderer-element';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import DummyBridge from '../../../editor/web-to-native/dummy-impl';
import { FetchProxy } from '../../../utils/fetch-proxy';
import { nativeBridgeAPI } from '../../../renderer/web-to-native/implementation';

jest.mock('../../../editor/web-to-native/dummy-impl');
jest.mock('../../../renderer/web-to-native/implementation');

const initialDocument = JSON.stringify({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'sme unresolved copy',
          type: 'text',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: '18983b72-dd27-41f4-9171-a4f2e180ca83',
              },
            },
          ],
        },
      ],
    },
  ],
});

function currentEventLoopEnd() {
  return new Promise(resolve => setImmediate(resolve));
}

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

describe('renderer bridge', () => {
  const createPromiseMock = jest.fn();
  let fetchProxy: FetchProxy;

  const initRenderer = (
    adf: string,
    allowAnnotations: boolean,
  ): HTMLElement => {
    act(() => {
      render(
        <MobileRenderer
          document={adf}
          cardClient={createCardClient()}
          emojiProvider={createEmojiProvider(fetchProxy)}
          mediaProvider={createMediaProvider()}
          mentionProvider={createMentionProvider()}
          allowAnnotations={allowAnnotations}
        />,
        container,
      );
    });

    return container;
  };

  beforeEach(() => {
    fetchProxy = new FetchProxy();
    fetchProxy.enable();
    createPromiseMock.mockReset();
    window.renderBridge = {
      onContentRendered: jest.fn(),
      onRenderedContentHeightChanged: jest.fn(),
    };
  });

  afterEach(() => {
    fetchProxy.disable();
  });

  describe('annotations', () => {
    let instanceMock: jest.Mocked<DummyBridge>;
    const expected = [
      [
        'getAnnotationStates',
        expect.any(String),
        '{"annotationIds":["18983b72-dd27-41f4-9171-a4f2e180ca83"],"annotationType":"inlineComment"}',
      ],
    ];

    beforeEach(() => {
      // @ts-ignore
      instanceMock = DummyBridge.mock.instances[0];
    });

    describe('when allowAnnotations is false', () => {
      it(`should not call getAnnotationStates birdge method on renderer`, () => {
        initRenderer(initialDocument, false);
        expect(instanceMock.submitPromise.mock.calls).toEqual(
          expect.not.arrayContaining(expected),
        );
      });
    });

    describe('when allowAnnotations is true', () => {
      it(`should call getAnnotationStates birdge method on renderer`, () => {
        initRenderer(initialDocument, true);
        expect(instanceMock.submitPromise.mock.calls).toEqual(
          expect.arrayContaining(expected),
        );
      });
      describe('when the annotation is clicked', () => {
        it('should call the onAnnotationClick native bridge api', async () => {
          initRenderer(initialDocument, true);
          const callAnnotation = instanceMock.submitPromise.mock.calls.find(
            c => {
              return c[0] === 'getAnnotationStates';
            },
          );

          act(() => {
            (window as any).rendererBridge.onPromiseResolved(
              `${callAnnotation![1]}`,
              `{"annotationIdToState": {"18983b72-dd27-41f4-9171-a4f2e180ca83": "active" }}`,
            );
          });

          await currentEventLoopEnd();
          const element = container.querySelector(
            '[data-id="18983b72-dd27-41f4-9171-a4f2e180ca83"]',
          )! as HTMLElement;

          element.click();

          expect(nativeBridgeAPI.onAnnotationClick).toHaveBeenCalledWith([
            {
              annotationIds: ['18983b72-dd27-41f4-9171-a4f2e180ca83'],
              annotationType: AnnotationTypes.INLINE_COMMENT,
            },
          ]);
        });
      });
    });
  });
});
