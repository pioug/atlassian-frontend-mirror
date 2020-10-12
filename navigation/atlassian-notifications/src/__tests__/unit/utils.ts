import { getNotificationsSrc } from '../../utils';

describe('getNotificationsSrc', () => {
  it('returns the correct url when no locale or product is provided', () => {
    expect(getNotificationsSrc({})).toEqual(
      '/home/notificationsDrawer/iframe.html',
    );
  });

  it('returns the correct url when a locale is provided', () => {
    expect(getNotificationsSrc({ locale: 'en-us' })).toEqual(
      '/home/notificationsDrawer/iframe.html?locale=en-us',
    );
  });

  it('returns the correct url when a product is provided', () => {
    expect(getNotificationsSrc({ product: 'jira' })).toEqual(
      '/home/notificationsDrawer/iframe.html?product=jira',
    );
  });

  it('returns the correct url when a locale and product is provided', () => {
    expect(getNotificationsSrc({ locale: 'en-us', product: 'jira' })).toEqual(
      '/home/notificationsDrawer/iframe.html?locale=en-us&product=jira',
    );
  });
});
