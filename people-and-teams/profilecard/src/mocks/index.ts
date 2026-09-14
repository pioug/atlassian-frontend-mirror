/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import getMockProfileClient from '@atlaskit/profilecard/mock-profile-client'` instead.
 */
export { default as getMockProfileClient } from './mock-profile-client';
/**
 * @deprecated Use `import getMockTeamClient from '@atlaskit/profilecard/mock-team-client'` instead.
 */
export { default as getMockTeamClient } from './mock-team-client';
/**
 * @deprecated Use `import profiles from '@atlaskit/profilecard/profile-data'` instead.
 */
export { default as profiles } from './profile-data';
/**
 * @deprecated Use `import { simpleMockTeamClient, simpleMockUserClient, simpleProfileClient, simpleMockAgentClient } from '@atlaskit/profilecard/simple-mock-clients'` instead.
 */
export {
	simpleMockTeamClient,
	simpleMockUserClient,
	simpleProfileClient,
	simpleMockAgentClient,
} from './simple-mock-clients';
