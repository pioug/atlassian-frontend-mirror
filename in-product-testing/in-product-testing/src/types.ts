// complains about devDependencies instead of dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { cy as cyType } from 'local-cypress';

export interface InProductCommonTestCaseOpts {
  runOnly?: string[];
}

export type CypressType = typeof cyType;
