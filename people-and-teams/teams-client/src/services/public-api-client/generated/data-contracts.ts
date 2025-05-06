/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PublicApiFetchResponsePublicApiMembershipAccountId {
	pageInfo?: PublicApiPageInfoAccountId;
	results?: PublicApiMembership[];
}

export interface PublicApiMembership {
	accountId?: string;
}

export interface PublicApiMembershipAddPayload {
	/**
	 * @maxItems 50
	 * @minItems 1
	 * @uniqueItems true
	 */
	members: PublicApiMembership[];
}

export interface PublicApiMembershipAddResponse {
	/** @uniqueItems true */
	errors?: PublicApiMembershipCodedError[];
	/** @uniqueItems true */
	members?: PublicApiMembership[];
}

export interface PublicApiMembershipCodedError {
	accountId?: string;
	code?: string;
	message?: string;
}

export interface PublicApiMembershipFetchPayload {
	/** Pagination cursor, only members after the cursor will be returned */
	after?: string;
	/**
	 * Maximum number of members to be returned
	 * @format int32
	 * @max 50
	 * @default 50
	 */
	first?: number;
}

export interface PublicApiMembershipRemovePayload {
	/**
	 * @maxItems 50
	 * @minItems 1
	 * @uniqueItems true
	 */
	members: PublicApiMembership[];
}

export interface PublicApiMembershipRemoveResponse {
	/** @uniqueItems true */
	errors?: PublicApiMembershipCodedError[];
}

export interface PublicApiOverallCodedError {
	code?: string;
	message?: string;
}

export interface PublicApiPageInfoAccountId {
	endCursor?: string;
	hasNextPage?: boolean;
}

export interface PublicApiTeamCreationPayload {
	/**
	 * @minLength 0
	 * @maxLength 360
	 */
	description: string;
	/**
	 * @minLength 1
	 * @maxLength 80
	 */
	displayName: string;
	/**
	 * @minLength 1
	 * @maxLength 255
	 */
	siteId?: string;
	teamType: 'OPEN' | 'MEMBER_INVITE';
}

export interface PublicApiTeamResponse {
	description?: string;
	displayName?: string;
	organizationId?: string;
	teamId?: string;
	teamType?: 'OPEN' | 'MEMBER_INVITE';
	userPermissions?: PublicApiUserPermissions;
}

export interface PublicApiTeamResponseWithMembers {
	description?: string;
	displayName?: string;
	/** @uniqueItems true */
	members?: PublicApiMembership[];
	organizationId?: string;
	teamId?: string;
	teamType?: 'OPEN' | 'MEMBER_INVITE';
	userPermissions?: PublicApiUserPermissions;
}

export interface PublicApiTeamUpdatePayload {
	/**
	 * @minLength 0
	 * @maxLength 360
	 */
	description?: string;
	/**
	 * @minLength 1
	 * @maxLength 80
	 * @pattern .*\S+.*
	 */
	displayName?: string;
}

export interface PublicApiUserPermissions {
	ADD_MEMBERS?: boolean;
	DELETE_TEAM?: boolean;
	REMOVE_MEMBERS?: boolean;
	UPDATE_TEAM?: boolean;
}
