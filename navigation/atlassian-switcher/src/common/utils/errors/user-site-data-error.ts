export enum UserSiteDataErrorReason {
  APS_NO_SITE_MATCH = 'aps_no_site_match',
  APS_EMPTY_RESULT = 'aps_empty_result',
  APS_PARTIAL_EMPTY_RESULT = 'aps_partial_response_empty_result',
}

export class UserSiteDataError extends Error {
  readonly reason: UserSiteDataErrorReason;
  constructor(reason: UserSiteDataErrorReason, message: string) {
    super(message);
    this.name = 'UserSiteDataError';
    this.reason = reason;
  }
}
