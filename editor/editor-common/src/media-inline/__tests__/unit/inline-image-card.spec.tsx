import React from 'react';

jest.mock('@atlaskit/media-file-preview', () => {
  const actualModule = jest.requireActual('@atlaskit/media-file-preview');
  return {
    __esModule: true,
    ...actualModule,
    useFilePreview: jest.fn(actualModule.useFilePreview),
  };
});
import { render } from '@testing-library/react';

import type { FileIdentifier } from '@atlaskit/media-client';
import { useFilePreview } from '@atlaskit/media-file-preview';

import { InlineImageCard } from '../../inline-image-card';

const identifier: FileIdentifier = {
  id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
  mediaItemType: 'file',
};

describe('<InlineImageCard />', () => {
  const onImageError = jest.fn();
  const onImageLoad = jest.fn();

  beforeEach(() => {
    (useFilePreview as jest.Mock).mockReset();
    onImageError.mockReset();
    onImageLoad.mockReset();
  });

  it('render loading view when preview is null', () => {
    (useFilePreview as jest.Mock).mockImplementation(() => {
      return {
        preview: null,
        error: null,
        onImageError,
        onImageLoad,
      };
    });

    const { getByTestId } = render(
      <InlineImageCard
        identifier={identifier}
        renderError={() => {
          return <div>error</div>;
        }}
      />,
    );

    expect(getByTestId('media-inline-image-card-loading-view')).toBeTruthy();
  });

  it('render image when preview exist', () => {
    (useFilePreview as jest.Mock).mockImplementation(() => {
      return {
        preview: {
          dataURI: 'host.com/image.jpg',
          source: 'remote',
        },
        error: null,
        onImageError,
        onImageLoad,
      };
    });

    const { getByTestId } = render(
      <InlineImageCard
        identifier={identifier}
        renderError={() => {
          return <div>error</div>;
        }}
      />,
    );

    expect(getByTestId('media-image').getAttribute('src')).toBe(
      'host.com/image.jpg',
    );
  });

  it('render error view when useFilePreview returns error', () => {
    (useFilePreview as jest.Mock).mockImplementation(() => {
      return {
        preview: {
          dataURI: 'host.com/image.jpg',
          source: 'remote',
        },
        error: new Error('something went wrong'),
        onImageError,
        onImageLoad,
      };
    });

    const { getByTestId } = render(
      <InlineImageCard
        identifier={identifier}
        renderError={() => {
          return <div data-testid="test-error">error</div>;
        }}
      />,
    );

    expect(getByTestId('test-error')).toBeTruthy();
  });
});
