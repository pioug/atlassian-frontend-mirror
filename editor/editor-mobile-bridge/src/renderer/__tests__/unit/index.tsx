jest.useFakeTimers();
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
import { FetchProxy } from '../../../utils/fetch-proxy';
import { nativeBridgeAPI } from '../../../renderer/web-to-native/implementation';
import { IntlProvider } from 'react-intl';
import { DocumentReflowDetector } from '../../../document-reflow-detector';
import { eventDispatcher, EmitterEvents } from '../../dispatcher';
jest.mock('../../../document-reflow-detector');
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

let container: HTMLElement;
let enableReflowMock = jest.fn();
let disableReflowMock = jest.fn();
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  (DocumentReflowDetector as jest.Mock).mockImplementation(() => {
    return {
      disable: disableReflowMock,
      enable: enableReflowMock,
    };
  });

  jest
    .spyOn(window.rendererBridge!, 'getRootElement')
    .mockReturnValue(container);
});

afterEach(() => {
  act(() => {
    unmountComponentAtNode(container);
    jest.runAllTimers();
    container.remove();
  });
  jest.clearAllMocks();
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
        <IntlProvider locale="en">
          <MobileRenderer
            document={adf}
            cardClient={createCardClient()}
            emojiProvider={createEmojiProvider(fetchProxy)}
            mediaProvider={createMediaProvider()}
            mentionProvider={createMentionProvider()}
            allowAnnotations={allowAnnotations}
          />
        </IntlProvider>,
        container,
      );
      jest.runAllTimers();
    });

    act(() => {
      jest.runAllTimers();
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

  describe('document reflow detector', () => {
    beforeEach(() => {
      initRenderer(initialDocument, false);
    });

    it(`is initialized`, () => {
      expect(DocumentReflowDetector).toHaveBeenCalled();
    });

    it(`is enabled with container when SET_DOCUMENT_REFLOW_DETECTOR_STATUS emitted with true`, () => {
      eventDispatcher.emit(
        EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
        true,
      );
      expect(enableReflowMock).toHaveBeenCalledWith(container);
    });

    it(`is disabled when SET_DOCUMENT_REFLOW_DETECTOR_STATUS emitted with false`, () => {
      eventDispatcher.emit(
        EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
        false,
      );
      expect(disableReflowMock).toHaveBeenCalled();
    });
  });

  describe('annotations', () => {
    const expected = [
      {
        annotationIds: ['18983b72-dd27-41f4-9171-a4f2e180ca83'],
        annotationType: 'inlineComment',
      },
    ];

    describe('when allowAnnotations is false', () => {
      it(`should not call getAnnotationStates birdge method on renderer`, () => {
        initRenderer(initialDocument, false);
        expect(nativeBridgeAPI.fetchAnnotationStates).not.toHaveBeenCalled();
      });
    });

    describe('when allowAnnotations is true', () => {
      it(`should call getAnnotationStates birdge method on renderer`, () => {
        initRenderer(initialDocument, true);
        expect(nativeBridgeAPI.fetchAnnotationStates).toHaveBeenCalledWith(
          expected,
        );
      });
      describe('when the annotation is clicked', () => {
        it('should call the onAnnotationClick native bridge api', () => {
          initRenderer(initialDocument, true);

          act(() => {
            (window as any).rendererBridge.setAnnotationState(
              `[{"annotationId": "18983b72-dd27-41f4-9171-a4f2e180ca83", "annotationState": "active" }]`,
            );
            jest.runAllTimers();
          });

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

      describe('when the setAnnotationFocus is called', () => {
        it('should focus the annotation', () => {
          initRenderer(initialDocument, true);

          act(() => {
            (window as any).rendererBridge.setAnnotationState(
              `[{"annotationId": "18983b72-dd27-41f4-9171-a4f2e180ca83", "annotationState": "active" }]`,
            );
            jest.runAllTimers();
          });

          let element = container.querySelector(
            '[data-id="18983b72-dd27-41f4-9171-a4f2e180ca83"]',
          )! as HTMLElement;
          expect(element.dataset.hasFocus).toBe('false');

          act(() => {
            (window as any).rendererBridge.setAnnotationFocus(
              JSON.stringify({
                annotationId: '18983b72-dd27-41f4-9171-a4f2e180ca83',
                annotationType: AnnotationTypes.INLINE_COMMENT,
              }),
            );
            jest.runAllTimers();
          });
          element = container.querySelector(
            '[data-id="18983b72-dd27-41f4-9171-a4f2e180ca83"]',
          )! as HTMLElement;
          expect(element.dataset.hasFocus).toBe('true');
        });
      });
    });
  });
});
