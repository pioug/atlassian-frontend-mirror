// URL matchers shared by the split mock-endpoint modules. These were file-private in
// `endpoints.ts` before the Volt split; they live here so that splitting the endpoint helpers into
// their own modules does not make them part of the published `./endpoints` surface.
/* eslint-disable @typescript-eslint/no-explicit-any */

export const mockMeRegex: any = /\/gateway\/api\/me/;

export const mockMembersRegex: any = /\/gateway\/api\/.*teams\/.*\/membership\/me/;

export const mockTeamMembershipRegex: any = /\/gateway\/api\/graphql\?q=TeamMembership/;

export const mockTeamRegex: any =
	/\/gateway\/api\/.*teams\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\?siteId=.*$/;

export const mockProfileWithMutabilityRegex: any = /\/gateway\/api\/users\/manage\/.*\/profile/;

export const mockProductRecommendationsRegex: any =
	/\/gateway\/api\/invitations\/v1\/product-recommendations\?orgId=test-orgId&.*/;

export const mockJoinOrRequestDefaultAccessToProductsBulkRegex: any =
	/\/gateway\/api\/invitations\/v1\/access-requests\/bulk\/request/;
