import { Action } from 'redux';
import { ServiceName } from '../domain';

export interface Account {
  readonly id: string;
  readonly name: ServiceName;
}

export const REQUEST_UNLINK_CLOUD_ACCOUNT = 'ACCOUNT_UNLINK_CLOUD_REQUEST';

export interface RequestUnlinkCloudAccountAction extends Action {
  readonly type: 'ACCOUNT_UNLINK_CLOUD_REQUEST';
  readonly account: Account;
}

export function requestUnlinkCloudAccount(
  account: Account,
): RequestUnlinkCloudAccountAction {
  return {
    type: REQUEST_UNLINK_CLOUD_ACCOUNT,
    account,
  };
}

export const UNLINK_ACCOUNT = 'ACCOUNT_CLOUD_UNLINK';

export interface UnlinkCloudAccountAction extends Action {
  readonly type: 'ACCOUNT_CLOUD_UNLINK';
  readonly account: Account;
}

export function unlinkCloudAccount(account: Account): UnlinkCloudAccountAction {
  return {
    type: UNLINK_ACCOUNT,
    account,
  };
}
