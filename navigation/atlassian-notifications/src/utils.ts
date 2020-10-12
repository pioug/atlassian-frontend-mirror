import { NotificationsProps } from './types';

type Args = Pick<NotificationsProps, '_url' | 'locale' | 'product'>;

const DEFAULT_URL = '/home/notificationsDrawer/iframe.html';

export const getNotificationsSrc = ({ _url, locale, product }: Args) => {
  // if a testing url has been passed through, just use that
  if (_url) {
    return _url;
  }

  const path = DEFAULT_URL;
  const query = [];

  if (locale) {
    query.push(`locale=${encodeURIComponent(locale)}`);
  }

  if (product) {
    query.push(`product=${encodeURIComponent(product)}`);
  }

  if (!query.length) {
    return path;
  }

  return `${path}?${query.join('&')}`;
};
