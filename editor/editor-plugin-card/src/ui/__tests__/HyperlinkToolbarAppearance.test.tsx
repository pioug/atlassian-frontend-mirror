import React from 'react';

import { render, screen } from '@testing-library/react';

import { CardOptions } from '@atlaskit/editor-common/card';
import {
  CardProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { asMock, fakeIntl } from '@atlaskit/media-test-helpers';
import { CardPlatform } from '@atlaskit/smart-card';

import { HyperlinkToolbarAppearance } from '../HyperlinkToolbarAppearance';

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
    const { rerender } = render(
      <HyperlinkToolbarAppearance
        intl={fakeIntl}
        editorState={editorState}
        providerFactory={providerFactory}
        url={url}
        platform={platform}
        cardOptions={cardOptions}
        editorAnalyticsApi={undefined}
        cardActions={undefined}
      />,
    );

    return {
      rerender,
      cardProvider,
      url,
      editorState,
      providerFactory,
      platform,
      cardOptions,
    };
  };
  it('should render null while url is resolving', () => {
    setup();

    const linkToolbar = screen.queryByTestId('url-appearance');
    expect(linkToolbar).toBeNull();
  });

  it('should render null if the url is not supported', async () => {
    const { cardProvider, url } = setup();
    const resolvedCardProvider = await cardProvider;

    asMock(resolvedCardProvider.findPattern).mockReturnValue(false);
    await resolvedCardProvider.findPattern(url);
    await nextTick();

    expect(resolvedCardProvider.findPattern).toBeCalledWith(url);
    const linkToolbar = screen.queryByTestId('url-appearance');
    expect(linkToolbar).toBeNull();
  });

  it('should render <LinkToolbarAppearance /> with the right props', async () => {
    const { cardProvider, url } = setup();

    await (await cardProvider).resolve(url);
    await nextTick();
    const linkToolbar = screen.queryByTestId('url-appearance');
    expect(linkToolbar).not.toBeNull();
  });

  it('should resolve new url when props change', async () => {
    const {
      rerender,
      cardProvider,
      url,
      editorState,
      providerFactory,
      platform,
      cardOptions,
    } = setup();
    const resolvedCardProvider = await cardProvider;

    await nextTick();
    expect(resolvedCardProvider.findPattern).toBeCalledWith(url);

    rerender(
      <HyperlinkToolbarAppearance
        intl={fakeIntl}
        editorState={editorState}
        providerFactory={providerFactory}
        url={'new-url'}
        platform={platform}
        cardOptions={cardOptions}
        editorAnalyticsApi={undefined}
        cardActions={undefined}
      />,
    );
    await nextTick();

    expect(resolvedCardProvider.findPattern).toBeCalledTimes(2);
    expect(resolvedCardProvider.findPattern).toHaveBeenLastCalledWith(
      'new-url',
    );
  });
});
