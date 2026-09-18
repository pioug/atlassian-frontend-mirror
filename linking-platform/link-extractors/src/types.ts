/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

/*
 * ###########################################################################
 * Generic extraction helpers
 * ###########################################################################
 *
 * Utilities for selecting extractor functions based on JSON-LD object type.
 */
export interface ExtractorFunction<T> {
	(json: any): T;
}

export interface ExtractOptions<T> {
	defaultExtractorFunction: ExtractorFunction<T>;
	extractorFunctionsByType: { [type: string]: ExtractorFunction<T> };
	extractorPrioritiesByType: { [type: string]: number };
	json: any;
}

/*
 * ###########################################################################
 * Shared public types
 * ###########################################################################
 *
 * Types that are shared across multiple extraction groups.
 */
export type CardPlatform = JsonLd.Primitives.Platforms;

export interface LinkProvider {
	icon?: React.ReactNode;
	iconLabel?: string;
	id?: string;
	image?: string;
	text: string;
}

/*
 * ###########################################################################
 * Date extraction
 * ###########################################################################
 *
 * Extractors for created, updated, and viewed date metadata.
 */
export type LinkTypeCreated =
	| JsonLd.Data.Document
	| JsonLd.Data.Page
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodeCommit
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task
	| JsonLd.Data.TaskType;

/*
 * ###########################################################################
 * People extraction
 * ###########################################################################
 *
 * Extractors for JSON-LD people, owners, members, assignees, creators, and updaters.
 */
export interface LinkPerson {
	name: string;
	src?: string;
}

export type LinkPersonUpdatedBy = Array<LinkPerson>;

export type LinkTypeUpdatedBy =
	| JsonLd.Data.Document
	| JsonLd.Data.Project
	| JsonLd.Data.SourceCodePullRequest
	| JsonLd.Data.SourceCodeReference
	| JsonLd.Data.SourceCodeRepository
	| JsonLd.Data.Task;

export interface LinkPreview {
	aspectRatio?: number;
	content?: string;
	src?: string;
}

export type EmbedIframeUrlType = 'href' | 'interactiveHref';
