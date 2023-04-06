import { JsonLd } from 'json-ld-types';

import { extractEmbedProps } from '../../../embed';
import { mocks } from '../../../../utils/mocks';

describe('extractEmbedProps', () => {
  it('extracts embed props', () => {
    const props = extractEmbedProps(
      mocks.unauthorized.data as JsonLd.Data.BaseData,
      mocks.unauthorized.meta,
      'web',
    );

    expect(props).toEqual({
      isTrusted: true,
      link: 'https://some.url',
      title: 'I love cheese',
      isSupportTheming: false,
    });
  });

  it('extracts embed props with provider details', () => {
    const data = {
      ...mocks.unauthorized.data,
      generator: {
        '@type': 'Application',
        name: 'provider-name',
        icon: {
          '@type': 'Image',
          url: 'https://some.image.icon',
        },
        image: {
          '@type': 'Image',
          url: 'https://some.image.url',
        },
      },
    } as JsonLd.Data.BaseData;
    const props = extractEmbedProps(data, mocks.unauthorized.meta, 'web');

    expect(props).toEqual({
      context: {
        icon: 'https://some.image.icon',
        image: 'https://some.image.url',
        text: 'provider-name',
      },
      isTrusted: true,
      isSupportTheming: false,
      link: 'https://some.url',
      title: 'I love cheese',
    });
  });
});
