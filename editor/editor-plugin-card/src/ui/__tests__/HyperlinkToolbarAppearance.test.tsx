import React from 'react';

import { render, screen } from '@testing-library/react';

import type { CardOptions } from '@atlaskit/editor-common/card';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, inlineCard, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { nextTick } from '@atlaskit/editor-test-helpers/next-tick';
import { asMock, fakeIntl } from '@atlaskit/media-test-helpers';
import type { CardPlatform } from '@atlaskit/smart-card';

import { HyperlinkToolbarAppearance } from '../HyperlinkToolbarAppearance';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual('@atlaskit/editor-common/utils'),
  canRenderDatasource: jest.fn(),
}));

jest.mock('../useFetchDatasourceInfo', () => ({
  ...jest.requireActual('../useFetchDatasourceInfo'),
  useFetchDatasourceInfo: jest.fn(),
}));

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
    const cardOptions: CardOptions = {
      allowEmbeds: true,
      allowDatasource: true,
    };
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
    const editDatasourceButton = screen.queryByTestId(
      'card-edit-datasource-button',
    );
    expect(editDatasourceButton).toBeNull();
  });

  it('should render <LinkToolbarAppearance /> with the right props and not show edit datasource button if not resolvable to datasource', async () => {
    const { cardProvider, url } = setup();
    (canRenderDatasource as jest.Mock).mockReturnValue(true);
    (useFetchDatasourceInfo as jest.Mock).mockReturnValue({
      datasourceId: undefined,
    });
    await (await cardProvider).resolve(url);
    await nextTick();
    const linkToolbar = screen.queryByTestId('url-appearance');
    expect(linkToolbar).not.toBeNull();
    const editDatasourceButton = screen.queryByTestId(
      'card-edit-datasource-button',
    );
    expect(editDatasourceButton).toBeNull();
  });

  it('should render <LinkToolbarAppearance /> with the right props and show edit datasource button if resolvable to datasource', async () => {
    const { cardProvider, url } = setup();
    (canRenderDatasource as jest.Mock).mockReturnValue(true);
    (useFetchDatasourceInfo as jest.Mock).mockReturnValue({
      datasourceId: '123',
    });
    await (await cardProvider).resolve(url);
    await nextTick();
    const linkToolbar = screen.queryByTestId('url-appearance');
    expect(linkToolbar).not.toBeNull();
    const editDatasourceButton = screen.queryByTestId(
      'card-edit-datasource-button',
    );
    expect(editDatasourceButton).not.toBeNull();
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
