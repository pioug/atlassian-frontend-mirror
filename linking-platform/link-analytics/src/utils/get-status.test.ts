import { mocks } from '../__fixtures__/mocks';

import { getStatus } from './get-status';

describe('getStatus', () => {
  it('returns resolved for success response', () => {
    const status = getStatus(mocks.success);
    expect(status).toBe('resolved');
  });
  it('returns not_found for success response', () => {
    const status = getStatus(mocks.notFound);
    expect(status).toBe('not_found');
  });
  it('returns forbidden for success response', () => {
    const status = getStatus(mocks.forbidden);
    expect(status).toBe('forbidden');
  });
  it('returns unauthorized for success response', () => {
    const status = getStatus(mocks.unauthorized);
    expect(status).toBe('unauthorized');
  });
});
