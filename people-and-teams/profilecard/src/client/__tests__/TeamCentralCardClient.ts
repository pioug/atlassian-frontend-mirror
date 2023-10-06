import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import {
  buildCheckFeatureFlagQuery,
  buildReportingLinesQuery,
} from '../TeamCentralCardClient';

describe('TeamCentralCardClient', () => {
  parseAndTestGraphQLQueries([
    buildReportingLinesQuery('').query,
    buildCheckFeatureFlagQuery('').query,
  ]);
});
