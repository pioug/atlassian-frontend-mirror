// example "ari:cloud:confluence::site/<CLOUD_ID>"
export type ProductARI = string;
// example "ari:cloud:confluence::role/product/member"
type RoleARI = string;
// exmaple: 400
type StatusCode = string;
export type AccessRequestBulkSimplified = Omit<AccessRequestBulk, 'resources'> & {
	productAris: ProductARI[];
};
/**
 *
 * The following types have been copied from id-invitations-service.
 * Last updated 2023-08-07.
 *
 */
// Copied from src/main/java/com/atlassian/identity/invitations/model/Product.java
export type Product =
	| 'confluence'
	| 'jira-core'
	| 'jira-servicedesk'
	| 'jira-software'
	| 'jira-incident-manager'
	| 'jira'
	| 'jira-product-discovery'
	| 'opsgenie'
	| 'statuspage'
	| 'avocado'
	| 'townsquare'
	| 'compass'
	| 'avp'
	| 'beacon'
	| 'mercury';
// Copied from src/main/java/com/atlassian/identity/invitations/model/recommendations/Capability.java
export type Capability = 'REQUEST_ACCESS' | 'DIRECT_ACCESS';
// src/main/java/com/atlassian/identity/invitations/model/requestaccess/UserAccessLevel.java
type UserAccessLevel = 'INTERNAL' | 'EXTERNAL' | 'INTERNAL_INACTIVE';
// Copied from src/main/java/com/atlassian/identity/invitations/model/recommendations/RecommendationMode.java
export type RecommendationMode = 'DOMAIN' | 'OPEN';
// Copied from src/main/java/com/atlassian/identity/invitations/model/recommendations/Recommendation.java
export type Recommendation = {
	resourceId: ProductARI;
	userAccessLevel: UserAccessLevel;
	mode?: RecommendationMode;
	roleAri: RoleARI;
	url: string;
	displayName?: string;
	avatarUrl?: string;
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/recommendations/RecommendationsResponse.java
export type RecommendationsResponse = {
	capability: {
		[K in Capability]: Recommendation[];
	};
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/Role.java
export type Role =
	| 'org/admin'
	| 'product/member'
	| 'product/helpseeker'
	| 'product/external-collaborator-writer';
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/bulk/AccessResourceRequest.java
export type Resource = {
	ari: ProductARI;
	continueUrl?: string;
	role: Role;
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/AccessRequestMode.java
export type AccessMode = 'REQUEST_ACCESS' | 'DIRECT_ACCESS';
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/bulk/AccessRequestBulk.java
export type AccessRequestBulk = {
	resources: Resource[];
	note?: string;
	accessMode?: AccessMode;
	source?: string;
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/AccessRequestCapability.java
export type AccessRequestCapability =
	| 'ACCESS_GRANTED'
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'ACCESS_EXISTS'
	| 'PENDING_REQUEST_CREATED'
	| 'PENDING_REQUEST_EXISTS'
	| 'APPROVED_REQUEST_EXISTS'
	| 'DENIED_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'VERIFICATION_REQUIRED'
	| 'ERROR';
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/AccessRequestCapabilityWithRole.java
type AccessRequestCapabilityWithRole = {
	accessMode: AccessRequestCapability;
	role: Role;
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/ErrorResponse.java
type ErrorResponse = {
	message: string;
	responseStatus: StatusCode;
	// omitted as not useful now.
	// throwable?: Throwable;
};
// Copied from src/main/java/com/atlassian/identity/invitations/model/access/bulk/AccessResourceResponse.java
export type AccessResourceResponse = {
	ari: ProductARI;
	result: AccessRequestCapability;
	resultsV2: { [K in ProductARI]: AccessRequestCapabilityWithRole[] };
	errorReason?: ErrorResponse;
};
export type AccessResourcesResponse = AccessResourceResponse[];
/**
 *
 * END of copied types from id-invitations-service.
 *
 */
