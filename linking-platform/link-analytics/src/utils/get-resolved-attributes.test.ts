import { mocks } from '../__fixtures__/mocks';

import { getResolvedAttributes } from './get-resolved-attributes';

describe('getResolvedAttributes', () => {
  const linkDetails = {
    url: 'some-url',
  };

  it('returns attributes for unresolved links', async () => {
    const resolvedAttributes = getResolvedAttributes(
      linkDetails,
      mocks.notFound,
    );

    expect(resolvedAttributes).toEqual(
      expect.objectContaining({
        status: 'not_found',
        displayCategory: 'link',
      }),
    );
  });

  it('returns Analytics attributes successfully', async () => {
    const resolvedAttributes = getResolvedAttributes(
      linkDetails,
      mocks.success,
    );

    expect(resolvedAttributes).toEqual(
      expect.objectContaining({
        status: 'resolved',
        displayCategory: 'smartLink',
        extensionKey: 'object-provider',
      }),
    );
  });

  it('should return `displayCategory` as `link` even if the link can be resolved', () => {
    const resolvedAttributes = getResolvedAttributes(
      { ...linkDetails, displayCategory: 'link' },
      mocks.success,
    );

    expect(resolvedAttributes).toEqual(
      expect.objectContaining({
        status: 'resolved',
        displayCategory: 'link',
        extensionKey: 'object-provider',
      }),
    );
  });
});
