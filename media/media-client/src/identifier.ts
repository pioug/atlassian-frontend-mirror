/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type Identifier = FileIdentifier | ExternalImageIdentifier;

export interface FileIdentifier {
	readonly mediaItemType: 'file';
	readonly id: string;
	readonly occurrenceKey?: string;
	readonly collectionName?: string; // files can exist outside of a collection
}

export interface ExternalImageIdentifier {
	readonly mediaItemType: 'external-image';
	readonly dataURI: string;
	readonly name?: string;
}

/**
 * @deprecated Use `import { isFileIdentifier } from '@atlaskit/media-client'` instead.
 */
export { isFileIdentifier } from './is-file-identifier';
/**
 * @deprecated Use `import { isExternalImageIdentifier } from '@atlaskit/media-client'` instead.
 */
export { isExternalImageIdentifier } from './is-external-image-identifier';
/**
 * @deprecated Use `import { isDifferentIdentifier } from '@atlaskit/media-client'` instead.
 */
export { isDifferentIdentifier } from './is-different-identifier';
