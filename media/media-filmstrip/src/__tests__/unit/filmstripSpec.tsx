import React from 'react';
import { shallow } from 'enzyme';
import { Filmstrip, FilmstripView, FilmstripProps, FilmstripItem } from '../..';
import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';
import { Card, CardLoading } from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';

describe('<Filmstrip />', () => {
  const firstIdenfier: Identifier = {
    id: 'id-1',
    mediaItemType: 'file',
  };
  const secondIdentifier: Identifier = {
    id: 'id-2',
    mediaItemType: 'file',
  };
  type Arguments = {
    items?: FilmstripProps['items'];
    shouldOpenMediaViewer?: FilmstripProps['shouldOpenMediaViewer'];
    mediaClientConfig?: FilmstripProps['mediaClientConfig'];
  };
  const setup = (props: Arguments = {}) => {
    const mediaClientConfig: MediaClientConfig = getDefaultMediaClientConfig();
    const items: FilmstripItem[] = [
      {
        identifier: firstIdenfier,
      },
      {
        identifier: secondIdentifier,
      },
    ];
    const component = shallow(
      <Filmstrip
        mediaClientConfig={mediaClientConfig}
        items={items}
        {...props}
      />,
    );

    return {
      component,
      mediaClientConfig,
    };
  };

  it('should render a FilmstripView with the right amount of Cards', () => {
    const { component } = setup();

    expect(component.find(FilmstripView)).toHaveLength(1);
    expect(component.find(FilmstripView).find(Card)).toHaveLength(2);
  });

  it('should use right React key for Cards', () => {
    const { component } = setup();

    expect(component.find(FilmstripView).find(Card).at(0).key()).toEqual(
      'id-1',
    );
    expect(component.find(FilmstripView).find(Card).at(1).key()).toEqual(
      'id-2',
    );
  });

  it('should pass properties down to Cards', () => {
    const { component, mediaClientConfig } = setup({
      items: [
        {
          identifier: firstIdenfier,
          selectable: true,
          selected: true,
        },
        {
          identifier: secondIdentifier,
        },
      ],
      shouldOpenMediaViewer: true,
    });

    expect(component.find(FilmstripView).find(Card).first().props()).toEqual(
      expect.objectContaining({
        mediaClientConfig,
        selectable: true,
        selected: true,
        identifier: {
          id: 'id-1',
          mediaItemType: 'file',
        },
        shouldOpenMediaViewer: true,
        mediaViewerDataSource: { list: [firstIdenfier, secondIdentifier] },
      }),
    );
  });

  it('should not activate media-viewer by default', () => {
    const { component } = setup({
      items: [{ identifier: firstIdenfier }, { identifier: secondIdentifier }],
    });

    expect(component.find(FilmstripView).find(Card).first().props()).toEqual(
      expect.objectContaining({
        shouldOpenMediaViewer: undefined,
        mediaViewerDataSource: undefined,
      }),
    );
  });

  it('should not activate media-viewer if shouldOpenMediaViewer is false', () => {
    const { component } = setup({
      items: [{ identifier: firstIdenfier }, { identifier: secondIdentifier }],
      shouldOpenMediaViewer: false,
    });

    expect(component.find(FilmstripView).find(Card).first().props()).toEqual(
      expect.objectContaining({
        shouldOpenMediaViewer: false,
        mediaViewerDataSource: undefined,
      }),
    );
  });

  it('should render loading cards if mediaClientConfig is missing', () => {
    const { component } = setup({
      mediaClientConfig: undefined,
    });
    expect(component.find(CardLoading)).toHaveLength(2);
  });
});
