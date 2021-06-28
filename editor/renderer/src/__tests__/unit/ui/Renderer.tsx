import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { doc, p, a, b, heading, text } from '@atlaskit/adf-utils';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import Renderer, {
  Renderer as BaseRenderer,
  Props,
} from '../../../ui/Renderer';
import { RendererAppearance } from '../../../ui/Renderer/types';
import Loadable from 'react-loadable';
import { initialDoc } from '../../__fixtures__/initial-doc';
import { invalidDoc } from '../../__fixtures__/invalid-doc';
import * as linkDoc from '../../__fixtures__/links.adf.json';
import { Media } from '../../../react/nodes';

import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { IntlProvider } from 'react-intl';

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

  const initRendererWithIntl = (
    doc: any = initialDoc,
    props: Partial<Props> = {},
    locale: string = 'en',
    messages = {},
  ) =>
    mountWithIntl(
      <IntlProvider locale={locale} messages={messages}>
        <Renderer document={doc} {...props} />
      </IntlProvider>,
    );

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

  it('should catch errors and render unsupported content text', () => {
    const wrapper = initRendererWithIntl(invalidDoc, {
      useSpecBasedValidator: true,
    });
    expect(wrapper.find('UnsupportedBlockNode')).toHaveLength(1);
    wrapper.unmount();
  });

  it('should call onError callback when catch error', () => {
    const onError = jest.fn();
    const wrapper = initRendererWithIntl(invalidDoc, {
      useSpecBasedValidator: true,
      onError,
    });
    expect(onError).toHaveBeenCalled();
    wrapper.unmount();
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
      renderer = initRenderer(linkDoc, { media: { allowLinking: true } });
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
});
