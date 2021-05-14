import { NotificationsProps } from './types';

type Args = Pick<
  NotificationsProps,
  '_url' | 'locale' | 'product' | 'subproduct' | 'isNewExperience'
>;

const DEFAULT_URL = '/home/notificationsDrawer/iframe.html';
const NEW_EXPERIENCE_URL = '/home/notificationList/index.html';

export const getNotificationsSrc = ({
  _url,
  locale,
  product,
  subproduct,
  isNewExperience,
}: Args) => {
  // if a testing url has been passed through, just use that
  if (_url) {
    return _url;
  }

  const path = isNewExperience ? NEW_EXPERIENCE_URL : DEFAULT_URL;
  const query = [];

  if (locale) {
    query.push(`locale=${encodeURIComponent(locale)}`);
  }

  if (product) {
    query.push(`product=${encodeURIComponent(product)}`);
  }

  if (subproduct && isNewExperience) {
    query.push(`subproduct=${encodeURIComponent(subproduct)}`);
  }

  if (!query.length) {
    return path;
  }

  return `${path}?${query.join('&')}`;
};
