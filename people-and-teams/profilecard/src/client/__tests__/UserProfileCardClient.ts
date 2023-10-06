import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { buildUserQuery } from '../UserProfileCardClient';

describe('TeamCentralCardClient', () => {
  parseAndTestGraphQLQueries([buildUserQuery('', '').query]);
});
