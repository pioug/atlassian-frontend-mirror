import { UserSiteDataErrorReason } from '../errors/user-site-data-error';

export type CLLoggableErrorReason =
  | UserSiteDataErrorReason
  | 'usd_unknown'
  | 'custom_links_api_error';
