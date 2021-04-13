import React from 'react';
import { fakeIntl, asMock } from '@atlaskit/media-test-helpers';
import { shallow } from 'enzyme';
import { CardPlatform } from '@atlaskit/smart-card';
import {
  ProviderFactory,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { doc, p, inlineCard } from '@atlaskit/editor-test-helpers/doc-builder';
import { CardOptions } from '@atlaskit/editor-common';
import { HyperlinkToolbarAppearance } from '../../HyperlinkToolbarAppearance';
import { LinkToolbarAppearance } from '../../../../plugins/card/ui/LinkToolbarAppearance';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe('<HyperlinkToolbarAppearance />', () => {
  class TestCardProvider implements CardProvider {
    resolve = jest.fn().mockReturnValue(Promise.resolve({}));
    findPattern = jest.fn().mockReturnValue(Promise.resolve(true));
  }
  const setup = () => {
    const editorState = createEditorState(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      ),
    );
    const providerFactory = new ProviderFactory();
    const cardProvider = Promise.resolve(new TestCardProvider());
    providerFactory.setProvider('cardProvider', cardProvider);
    const url = 'some-url';
    const platform: CardPlatform = 'web';
    const cardOptions: CardOptions = { allowEmbeds: true };
    const component = shallow(
      <HyperlinkToolbarAppearance
        intl={fakeIntl}
        editorState={editorState}
        providerFactory={providerFactory}
        url={url}
        platform={platform}
        cardOptions={cardOptions}
      />,
    );

    return { component, cardProvider, url };
  };
  it('should render null while url is resolving', () => {
    const { component } = setup();

    expect(component.isEmptyRender()).toBeTruthy();
  });

  it('should render null if the url is not supported', async () => {
    const { component, cardProvider, url } = setup();
    const resolvedCardProvider = await cardProvider;

    asMock(resolvedCardProvider.findPattern).mockReturnValue(false);
    await resolvedCardProvider.findPattern(url);
    await nextTick();
    component.update();

    expect(resolvedCardProvider.findPattern).toBeCalledWith(url);
    expect(component.isEmptyRender()).toBeTruthy();
  });

  it('should render <LinkToolbarAppearance /> with the right props', async () => {
    const { component, cardProvider, url } = setup();

    await (await cardProvider).resolve(url);
    await nextTick();
    component.update();

    expect(component.find(LinkToolbarAppearance)).toHaveLength(1);
    expect(component.find(LinkToolbarAppearance).props()).toEqual(
      expect.objectContaining({
        url,
        allowEmbeds: true,
        platform: 'web',
      }),
    );
  });

  it('should resolve new url when props change', async () => {
    const { component, cardProvider, url } = setup();
    const resolvedCardProvider = await cardProvider;

    await nextTick();
    expect(resolvedCardProvider.findPattern).toBeCalledWith(url);

    component.setProps({
      url: 'new-url',
    });
    await nextTick();

    expect(resolvedCardProvider.findPattern).toBeCalledTimes(2);
    expect(resolvedCardProvider.findPattern).toHaveBeenLastCalledWith(
      'new-url',
    );
  });
});
