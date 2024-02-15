jest.useFakeTimers();

import type { DocNode } from '@atlaskit/adf-schema';
import { AnnotationTypes } from '@atlaskit/adf-schema/schema';
import userEvent from '@testing-library/user-event';
import { mount } from 'enzyme';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import type { IntlShape } from 'react-intl-next';
import { DocumentReflowDetector } from '../../../document-reflow-detector';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';
import * as FetchProxyUtils from '../../../utils/fetch-proxy';
import { EmitterEvents, eventDispatcher } from '../../dispatcher';
import { App } from '../../index';
import MobileRendererWrapper, {
  MobileRenderer,
} from '../../mobile-renderer-element';
import { nativeBridgeAPI } from '../../web-to-native/implementation';

jest.mock('../../../document-reflow-detector');
jest.mock('../../../editor/web-to-native/dummy-impl');
jest.mock('../../../renderer/web-to-native/implementation');

jest.mock('../../hooks/use-renderer-configuration', () => ({
  __esModule: true,
  default: () => ({
    getLocale: () => 'fr',
    isAnnotationsAllowed: () => false,
    isActionsDisabled: () => false,
    isMedialinkingDisabled: () => false,
    isHeadingAnchorLinksAllowed: () => false,
    isCustomPanelEnabled: () => false,
  }),
}));

// Turn off delay to allow using user events with fake timers
const userEventWithoutDelay = userEvent.setup({ delay: null });

const initialDocument = {
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
} as DocNode;

describe('renderer bridge', () => {
  let container: HTMLElement;
  let enableReflowMock = jest.fn();
  let disableReflowMock = jest.fn();
  let rendererBridge = new RendererBridgeImplementation();
  let root: any; // Change to Root once we go full React 18

  const createPromiseMock = jest.fn();
  let fetchProxy: FetchProxyUtils.FetchProxy;
  const intlMock = {
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown as IntlShape;
  const initRenderer = (
    adf: DocNode,
    allowAnnotations: boolean,
  ): HTMLElement => {
    if (process.env.IS_REACT_18 === 'true') {
      act(() => {
        root.render(
          <MobileRenderer
            document={adf}
            cardClient={createCardClient()}
            emojiProvider={createEmojiProvider(fetchProxy)}
            mediaProvider={createMediaProvider()}
            mentionProvider={createMentionProvider()}
            allowAnnotations={allowAnnotations}
            intl={intlMock}
            rendererBridge={rendererBridge}
          />,
        );
        jest.runAllTimers();
      });
    } else {
      act(() => {
        render(
          <MobileRenderer
            document={adf}
            cardClient={createCardClient()}
            emojiProvider={createEmojiProvider(fetchProxy)}
            mediaProvider={createMediaProvider()}
            mentionProvider={createMentionProvider()}
            allowAnnotations={allowAnnotations}
            intl={intlMock}
            rendererBridge={rendererBridge}
          />,
          container,
        );
        jest.runAllTimers();
      });
    }

    return container;
  };

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    if (process.env.IS_REACT_18 === 'true') {
      // @ts-ignore react-dom/client only available in react 18
      // eslint-disable-next-line import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
      const { createRoot } = await import('react-dom/client');
      root = createRoot(container!);
    }

    (DocumentReflowDetector as jest.Mock).mockImplementation(() => {
      return {
        disable: disableReflowMock,
        enable: enableReflowMock,
      };
    });

    jest.spyOn(rendererBridge, 'getRootElement').mockReturnValue(container);

    fetchProxy = new FetchProxyUtils.FetchProxy();
    fetchProxy.enable();
    createPromiseMock.mockReset();
  });

  afterEach(() => {
    fetchProxy.disable();
    act(() => {
      if (process.env.IS_REACT_18 === 'true') {
        root.unmount();
      } else {
        unmountComponentAtNode(container!);
      }

      jest.runAllTimers();
      container.remove();
    });
    jest.resetAllMocks();
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
      it(`should not call getAnnotationStates bridge method on renderer`, () => {
        initRenderer(initialDocument, false);
        expect(nativeBridgeAPI.fetchAnnotationStates).not.toHaveBeenCalled();
      });
    });

    describe('when allowAnnotations is true', () => {
      it(`should call getAnnotationStates bridge method on renderer`, () => {
        initRenderer(initialDocument, true);
        expect(nativeBridgeAPI.fetchAnnotationStates).toHaveBeenCalledWith(
          expected,
        );
      });
      describe('when the annotation is clicked', () => {
        it('should call the onAnnotationClick native bridge api', async () => {
          initRenderer(initialDocument, true);

          act(() => {
            rendererBridge.setAnnotationState(
              `[{"annotationId": "18983b72-dd27-41f4-9171-a4f2e180ca83", "annotationState": "active" }]`,
            );
            jest.runAllTimers();
          });

          await userEventWithoutDelay.click(
            container.querySelector(
              '[data-id="18983b72-dd27-41f4-9171-a4f2e180ca83"]',
            ) as HTMLElement,
          );

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
            rendererBridge.setAnnotationState(
              `[{"annotationId": "18983b72-dd27-41f4-9171-a4f2e180ca83", "annotationState": "active" }]`,
            );
            jest.runAllTimers();
          });

          let element = container.querySelector(
            '[data-id="18983b72-dd27-41f4-9171-a4f2e180ca83"]',
          )! as HTMLElement;
          expect(element.dataset.hasFocus).toBe('false');

          act(() => {
            rendererBridge.setAnnotationFocus(
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

describe('Mobile Renderer', () => {
  it('should pass locale to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('locale')).toBe('fr');
    result.unmount();
  });

  it('should pass allowAnnotations to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('allowAnnotations')).toBe(
      false,
    );
    result.unmount();
  });
  it('should pass disableActions to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('disableActions')).toBe(
      false,
    );
    result.unmount();
  });
  it('should pass disableMediaLinking to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('disableMediaLinking')).toBe(
      false,
    );
    result.unmount();
  });
  it('should pass disableMediaLinking to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(
      result.find(MobileRendererWrapper).prop('allowHeadingAnchorLinks'),
    ).toBe(false);
    result.unmount();
  });
  it('should pass allowCustomPanels to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('allowCustomPanels')).toBe(
      false,
    );
    result.unmount();
  });
});
