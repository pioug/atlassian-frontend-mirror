jest.useFakeTimers();
import React from 'react';
import { mount } from 'enzyme';
import { AnnotationTypes } from '@atlaskit/adf-schema/src/schema/marks/annotation';
import MobileRendererWrapper, {
  MobileRenderer,
} from '../../mobile-renderer-element';
import { App } from '../../index';
import {
  createCardClient,
  createEmojiProvider,
  createMediaProvider,
  createMentionProvider,
} from '../../../providers';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import * as FetchProxyUtils from '../../../utils/fetch-proxy';
import { nativeBridgeAPI } from '../../web-to-native/implementation';
import { InjectedIntl } from 'react-intl';
import { DocumentReflowDetector } from '../../../document-reflow-detector';
import { eventDispatcher, EmitterEvents } from '../../dispatcher';
import RendererBridgeImplementation from '../../../renderer/native-to-web/implementation';

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
let rendererBridge = new RendererBridgeImplementation();
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  (DocumentReflowDetector as jest.Mock).mockImplementation(() => {
    return {
      disable: disableReflowMock,
      enable: enableReflowMock,
    };
  });

  jest.spyOn(rendererBridge, 'getRootElement').mockReturnValue(container);
});

afterEach(() => {
  act(() => {
    unmountComponentAtNode(container);
    jest.runAllTimers();
    container.remove();
  });
  jest.resetAllMocks();
});

describe('renderer bridge', () => {
  const createPromiseMock = jest.fn();
  let fetchProxy: FetchProxyUtils.FetchProxy;
  const intlMock = ({
    formatMessage: (messageDescriptor: any) =>
      messageDescriptor && messageDescriptor.defaultMessage,
  } as unknown) as InjectedIntl;
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
          intl={intlMock}
          rendererBridge={rendererBridge}
        />,
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
    fetchProxy = new FetchProxyUtils.FetchProxy();
    fetchProxy.enable();
    createPromiseMock.mockReset();
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
        it('should call the onAnnotationClick native bridge api', () => {
          initRenderer(initialDocument, true);

          act(() => {
            rendererBridge.setAnnotationState(
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
  beforeEach(() => {
    jest
      .spyOn(FetchProxyUtils, 'useFetchProxy')
      .mockReturnValue(new FetchProxyUtils.FetchProxy());
  });

  it('should pass locale to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);

    expect(result.find(MobileRendererWrapper).prop('locale')).toBe('fr');
  });

  it('should pass allowAnnotations to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);

    expect(result.find(MobileRendererWrapper).prop('allowAnnotations')).toBe(
      false,
    );
  });

  it('should pass disableActions to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);

    expect(result.find(MobileRendererWrapper).prop('disableActions')).toBe(
      false,
    );
  });

  it('should pass disableMediaLinking to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(result.find(MobileRendererWrapper).prop('disableMediaLinking')).toBe(
      false,
    );
  });

  it('should pass disableMediaLinking to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(
      result.find(MobileRendererWrapper).prop('allowHeadingAnchorLinks'),
    ).toBe(false);
  });
  it('should pass UNSAFE_allowCustomPanels to Mobile Renderer', () => {
    const result = mount(<App document={initialDocument} />);
    expect(
      result.find(MobileRendererWrapper).prop('UNSAFE_allowCustomPanels'),
    ).toBe(false);
  });
});
