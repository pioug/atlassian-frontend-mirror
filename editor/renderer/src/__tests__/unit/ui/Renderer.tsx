const mockStopMeasureDuration = 1234;

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  startMeasure: jest.fn(),
  stopMeasure: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (duration: number, startTime: number) => void,
    ) => {
      onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
    },
  ),
  measureTTI: jest.fn(),
}));

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { a, b, doc, heading, p, text } from '@atlaskit/adf-utils/builders';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import type { Props } from '../../../ui/Renderer';
import Renderer, { Renderer as BaseRenderer } from '../../../ui/Renderer';
import type { RendererAppearance } from '../../../ui/Renderer/types';
import Loadable from 'react-loadable';
import { initialDoc } from '../../__fixtures__/initial-doc';
import { invalidDoc } from '../../__fixtures__/invalid-doc';
import { intlRequiredDoc } from '../../__fixtures__/intl-required-doc';
import { tableLayout } from '../../__fixtures__/table';
import * as linkDoc from '../../__fixtures__/links.adf.json';
import { Media } from '../../../react/nodes';
import { IntlProvider } from 'react-intl-next';
import { measureTTI } from '@atlaskit/editor-common/utils';
import type {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { setupMultipleRendersTestHelper } from '../../__helpers/render';

const mockMeasureTTI = measureTTI as jest.Mock<typeof measureTTI>;

const validDoc = doc(
  heading({ level: 1 })(text('test')),
  p(
    a({ href: 'https://www.atlassian.com' })('Hello, '),
    a({ href: 'https://www.atlassian.com' })(b('World!')),
  ),
);

describe('@atlaskit/renderer/ui/Renderer', () => {
  let renderer: ReactWrapper;

  const initRenderer = (doc: any = initialDoc, props: Partial<Props> = {}) =>
    mount(<Renderer document={doc} {...props} />);

  afterEach(() => {
    if (renderer && renderer.length) {
      renderer.unmount();
    }
  });

  it('should re-render when appearance changes', () => {
    renderer = initRenderer();
    const renderSpy = jest.spyOn(
      renderer.find(BaseRenderer).instance() as any,
      'render',
    );
    renderer.setProps({ appearance: 'full-width' });
    renderer.setProps({ appearance: 'full-page' });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should re-render when allowCustomPanels changes', () => {
    renderer = initRenderer();
    const renderSpy = jest.spyOn(
      renderer.find(BaseRenderer).instance() as any,
      'render',
    );
    renderer.setProps({ allowCustomPanels: false });
    renderer.setProps({ allowCustomPanels: true });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should not re-render when allowCustomPanels does not change', () => {
    renderer = initRenderer();
    const renderSpy = jest.spyOn(
      renderer.find(BaseRenderer).instance() as any,
      'render',
    );
    renderer.setProps({ allowCustomPanels: false });
    renderer.setProps({ allowCustomPanels: false });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should catch errors and render unsupported content text', () => {
    const wrapper = initRenderer(invalidDoc, {
      useSpecBasedValidator: true,
    });
    expect(wrapper.find('UnsupportedBlockNode')).toHaveLength(1);
    wrapper.unmount();
  });

  it('should call onError callback when catch error', () => {
    const onError = jest.fn();
    const wrapper = initRenderer(invalidDoc, {
      useSpecBasedValidator: true,
      onError,
    });
    expect(onError).toHaveBeenCalled();
    wrapper.unmount();
  });

  describe('react-intl-next', () => {
    describe('when IntlProvider is not in component ancestry', () => {
      renderer = initRenderer(intlRequiredDoc, { useSpecBasedValidator: true });
      it('should not throw an error', () => {
        expect(() => renderer).not.toThrow();
      });
      it('should setup a default IntlProvider with locale "en"', () => {
        const renderer = initRenderer(intlRequiredDoc, {
          useSpecBasedValidator: true,
        });
        const intlProviderWrapper = renderer.find(IntlProvider);
        expect(intlProviderWrapper.length).toEqual(1);
        expect(intlProviderWrapper.props()).toEqual(
          expect.objectContaining({ locale: 'en' }),
        );
      });
    });
    describe('when IntlProvider is in component ancestry', () => {
      const rendererWithIntl = mount(
        <IntlProvider locale="es">
          <Renderer document={intlRequiredDoc} useSpecBasedValidator />
        </IntlProvider>,
      );
      it('should not throw an error', () => {
        expect(() => rendererWithIntl).not.toThrow();
      });
      it('should use the provided IntlProvider, and not setup a default IntlProvider', () => {
        const intlProviderWrapper = rendererWithIntl.find(IntlProvider);
        expect(intlProviderWrapper.length).toEqual(1);
        expect(intlProviderWrapper.props()).toEqual(
          expect.objectContaining({ locale: 'es' }),
        );
      });
    });
  });

  describe('Stage0', () => {
    describe('captions', () => {
      const captionText = 'this is a caption';
      const docWithCaption = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaSingle',
            attrs: {
              layout: 'center',
            },
            content: [
              {
                type: 'media',
                attrs: {
                  id: '0a7b3495-d1e5-4b27-90fb-a2589cd96e3b',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  width: 1874,
                  height: 1078,
                },
              },
              {
                type: 'caption',
                content: [{ type: 'text', text: captionText }],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };
      xit('should render caption text', () => {
        renderer = initRenderer(docWithCaption);
        expect(renderer.text()).toContain(captionText);
      });
    });
    describe('marks', () => {
      const docWithStage0Mark = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
        renderer = initRenderer(docWithStage0Mark);
        expect(renderer.find('ConfluenceInlineComment')).toHaveLength(0);
      });

      it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
        renderer = initRenderer(docWithStage0Mark, { adfStage: 'stage0' });
        expect(renderer.find('ConfluenceInlineComment')).toHaveLength(1);
      });
    });

    describe('alt text', () => {
      const docWithAltText = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaSingle',
            attrs: {
              layout: 'center',
            },
            content: [
              {
                type: 'media',
                attrs: {
                  id: '0a7b3495-d1e5-4b27-90fb-a2589cd96e3b',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  width: 1874,
                  height: 1078,
                  alt: 'This is an alt text',
                },
              },
            ],
          },
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };

      it.each<[string, boolean]>([
        [
          'should add alt text on images if flag allowAltTextOnImages is on',
          true,
        ],
        [
          'should not add alt text on images if flag allowAltTextOnImages is off',
          false,
        ],
      ])('%s', async (_, altTextFlag: boolean) => {
        renderer = initRenderer(docWithAltText, {
          allowAltTextOnImages: altTextFlag,
        });
        // need to preload and update to make LoadableComponent removed and media rendered
        await Loadable.preloadAll();
        renderer.update();

        expect(
          renderer.find('MediaCardInternal[alt="This is an alt text"]').length,
        ).toBe(altTextFlag ? 1 : 0);
      });
    });

    it('should not render link mark around mediaSingle if media.allowLinking is undefined', () => {
      renderer = initRenderer(linkDoc, {});
      const media = renderer.find(Media);
      const dataBlockLink = media.find('[data-block-link]');
      expect(dataBlockLink.length).toEqual(0);
    });

    it('should not render link mark around media if media.allowLinking is false', () => {
      renderer = initRenderer(linkDoc, {});
      const media = renderer.find(Media);
      const dataBlockLink = media.find('[data-block-link]');
      expect(dataBlockLink.length).toEqual(0);
    });

    it('should render link mark around media if media.allowLinking is true', () => {
      renderer = initRenderer(linkDoc, {
        media: { allowLinking: true },
      });
      const media = renderer.find(Media);
      const dataBlockLink = media.find('[data-block-link]');
      expect(dataBlockLink.length).not.toEqual(0);
    });
  });

  describe('Truncated Renderer', () => {
    it('should truncate to 95px when truncated prop is true and maxHeight is undefined', () => {
      renderer = initRenderer(initialDoc, { truncated: true });

      expect(renderer.find('TruncatedWrapper')).toHaveLength(1);

      const wrapper = renderer.find('TruncatedWrapper').childAt(0);
      expect(wrapper.props().height).toEqual(95);
    });

    it('should truncate to custom height when truncated prop is true and maxHeight is defined', () => {
      renderer = initRenderer(initialDoc, { truncated: true, maxHeight: 100 });
      expect(renderer.find('TruncatedWrapper')).toHaveLength(1);
      expect(renderer.find('TruncatedWrapper').props().height).toEqual(100);
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is defined", () => {
      renderer = initRenderer(initialDoc, { maxHeight: 100 });
      expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is undefined", () => {
      renderer = initRenderer();
      expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
    });

    it('should truncate and adjust fade out if fadeoutHeight prop is defined', () => {
      renderer = initRenderer(initialDoc, {
        truncated: true,
        maxHeight: 100,
        fadeOutHeight: 50,
      });
      expect(renderer.find('TruncatedWrapper')).toHaveLength(1);
      expect(
        (renderer.find('TruncatedWrapper').props() as any).fadeHeight,
      ).toEqual(50);
    });
  });

  describe('Analytics', () => {
    let client: AnalyticsWebClient;

    const initRendererWithAnalytics = (props: Partial<Props> = {}) =>
      mount(
        <FabricAnalyticsListeners client={client}>
          <Renderer document={initialDoc} {...props} />
        </FabricAnalyticsListeners>,
      );

    beforeEach(() => {
      client = analyticsClient();
      jest.useFakeTimers();
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((fn: Function) => fn());
    });

    afterEach(() => {
      (window.requestAnimationFrame as jest.Mock).mockRestore();
      jest.useRealTimers();
    });

    describe('renderer tti tracking (time-to-interactive)', () => {
      describe('when rendererTtiTracking is enabled', () => {
        const tti = 1000;
        const ttiFromInvocation = 500;

        it('should fire a tti event after renderer has mounted', (done) => {
          const mockAnalyticsClient = (
            done: jest.DoneCallback,
          ): AnalyticsWebClient => {
            const analyticsEventHandler = (
              event: GasPurePayload | GasPureScreenEventPayload,
            ) => {
              expect(event).toEqual(
                expect.objectContaining({
                  action: 'tti',
                  actionSubject: 'renderer',
                  attributes: expect.objectContaining({
                    tti,
                    ttiFromInvocation,
                    canceled: false,
                  }),
                }),
              );

              mockMeasureTTI.mockClear();
              done();
            };
            return analyticsClient(analyticsEventHandler);
          };

          mount(
            <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
              <Renderer
                document={initialDoc}
                featureFlags={{ 'renderer-tti-tracking': true }}
              />
            </FabricAnalyticsListeners>,
          );

          const [ttiCallback] = mockMeasureTTI.mock.calls[0];
          ttiCallback(tti, ttiFromInvocation, false);
        });
      });

      describe('when rendererTtiTracking is not enabled', () => {
        it('should not fire a tti event after renderer has mounted', () => {
          mount(
            <Renderer
              document={initialDoc}
              featureFlags={{ 'renderer-tti-tracking': false }}
            />,
          );

          expect(measureTTI).not.toHaveBeenCalled();
        });
      });
    });

    describe('renderer reRendered tracking (render count)', () => {
      describe('when rendererRenderTracking is enabled', () => {
        const { expectAnalyticsEventAfterNthRenders } =
          setupMultipleRendersTestHelper();

        const renderTrackingEnabled = {
          ['renderer-render-tracking']: JSON.stringify({
            renderer: {
              enabled: true,
              useShallow: false,
            },
          }),
        };

        const TestRenderer = (props: Partial<Props>) => (
          <Renderer
            document={initialDoc}
            featureFlags={renderTrackingEnabled}
            {...props}
          />
        );

        describe('props changing on each render', () => {
          const changingProps = [
            { propA: 10 },
            { propA: 99 },
            { propA: 30 },
            { propA: 200 },
          ];

          it('should fire debounced "renderer reRendered" event with correct total render count and latest prop differences', (done) => {
            const expectedEvent = expect.objectContaining({
              action: 'reRendered',
              actionSubject: 'renderer',
              attributes: expect.objectContaining({
                // we expect 3 not 4 because render count is 0 based.
                count: 3,
                propsDifference: {
                  added: [],
                  changed: expect.arrayContaining([
                    { key: 'propA', oldValue: 30, newValue: 200 },
                  ]),
                  removed: [],
                },
                componentId: expect.any(String),
              }),
            });

            expectAnalyticsEventAfterNthRenders(
              TestRenderer,
              4,
              changingProps,
              expectedEvent,
              done,
            );
          });
        });

        describe('props changing 1 times out of 5', () => {
          const changingProps = [
            { propA: 'a' },
            { propA: 'b' },
            { propA: 'b' },
            { propA: 'b' },
            { propA: 'b' },
          ];
          it('should fire debounced "renderer reRendered" event with correct total render count and latest prop differences', (done) => {
            const expectedEvent = expect.objectContaining({
              action: 'reRendered',
              actionSubject: 'renderer',
              attributes: expect.objectContaining({
                // we expect 1 not 2 because render count is 0 based.
                // we expect 1 re-render because despite force rendering 5 times, we only changed the props once.
                count: 1,
                propsDifference: {
                  added: [],
                  changed: expect.arrayContaining([
                    { key: 'propA', oldValue: 'a', newValue: 'b' },
                  ]),
                  removed: [],
                },
                componentId: expect.any(String),
              }),
            });

            expectAnalyticsEventAfterNthRenders(
              TestRenderer,
              5,
              changingProps,
              expectedEvent,
              done,
            );
          });
        });
      });
    });

    it('should fire heading anchor hit analytics event', () => {
      const oldHash = window.location.hash;
      window.location.hash = '#test';

      renderer = mount(
        <FabricAnalyticsListeners client={client}>
          <Renderer document={validDoc} />
        </FabricAnalyticsListeners>,
        {
          attachTo: document.body,
        },
      );

      jest.runAllTimers();

      expect(client.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'viewed',
          actionSubject: 'anchorLink',
          attributes: expect.objectContaining({
            platform: 'web',
            mode: 'renderer',
          }),
        }),
      );

      renderer.detach();
      window.location.hash = oldHash;
    });

    it('should fire analytics event on renderer started', () => {
      renderer = initRendererWithAnalytics();

      expect(client.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'started',
          actionSubject: 'renderer',
          attributes: expect.objectContaining({ platform: 'web' }),
        }),
      );
    });

    const appearances: {
      appearance: RendererAppearance;
      analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
    }[] = [
      {
        appearance: 'full-page',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH,
      },
      {
        appearance: 'comment',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.COMMENT,
      },
      {
        appearance: 'full-width',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
      },
    ];
    appearances.forEach((appearance) => {
      it(`adds appearance to analytics events for ${appearance.appearance} renderer`, () => {
        renderer = initRendererWithAnalytics({
          appearance: appearance.appearance,
        });

        expect(client.sendUIEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              appearance: appearance.analyticsAppearance,
            }),
          }),
        );
      });
    });
  });

  describe('Custom components', () => {
    const table = (props: any) => (
      <table className="custom-component">
        <tbody>{props.children}</tbody>
      </table>
    );
    it('should find the prop nodeComponents', () => {
      const renderer = initRenderer(tableLayout, { nodeComponents: { table } });
      expect(renderer.props()).toEqual(
        expect.objectContaining({ nodeComponents: { table } }),
      );
    });
    it('should render the custom table component', () => {
      const renderer = initRenderer(tableLayout, { nodeComponents: { table } });
      expect(renderer.find(table)).toHaveLength(12);
    });
    it('should render default tables', () => {
      const renderer = initRenderer(tableLayout);
      expect(renderer.find(table)).toHaveLength(0);
      expect(renderer.find('table')).toHaveLength(12);
    });
  });
});
