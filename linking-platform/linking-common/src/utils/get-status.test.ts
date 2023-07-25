import { mocks } from '../__tests__/__mocks__/mockJsonLdResponse';

import { getStatus } from './get-status';

describe('getStatus', () => {
  describe('when forbidden access', () => {
    it('should return forbidden for visibility != not_found', () => {
      const status = getStatus(mocks.forbidden);
      expect(status).toBe('forbidden');
    });
    it('should return not_found for visibility = not_found and no accessType', () => {
      const status = getStatus(mocks.notFound);
      expect(status).toBe('not_found');
    });
    it('should return not_found for visibility = not_found and accessType is ACCESS_EXISTS', () => {
      const jsonLdResponse = {
        ...mocks.notFound,
        meta: {
          ...mocks.notFound.meta,
          requestAccess: {
            accessType: 'ACCESS_EXISTS',
          },
        },
      };
      const status = getStatus(jsonLdResponse);
      expect(status).toBe('not_found');
    });
    it('should return forbidden for visibility = not_found and accessType is not ACCESS_EXISTS', () => {
      const jsonLdResponse = {
        ...mocks.notFound,
        meta: {
          ...mocks.notFound.meta,
          requestAccess: {
            accessType: 'DIRECT_ACCESS',
          },
        },
      };
      const status = getStatus(jsonLdResponse);
      expect(status).toBe('forbidden');
    });
  });
  it('should return resolved for access that is no forbidden or unauthorized', () => {
    const status = getStatus(mocks.success);
    expect(status).toBe('resolved');
  });

  it('should return unauthorized for unauthorized access', () => {
    const status = getStatus(mocks.unauthorized);
    expect(status).toBe('unauthorized');
  });
});
