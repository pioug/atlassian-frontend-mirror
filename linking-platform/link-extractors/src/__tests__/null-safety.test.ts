import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { extractContext } from '../extract-context';
import { extractDateCreated } from '../extract-date-created';
import { extractDateUpdated } from '../extract-date-updated';
import { extractDateViewed } from '../extract-date-viewed';
import { extractImage } from '../extract-image';
import { extractMembers } from '../extract-members';
import { extractPersonAssignedTo } from '../extract-person-assigned-to';
import { extractPersonCreatedBy } from '../extract-person-created-by';
import { extractPersonOwnedBy } from '../extract-person-owned-by';
import { extractPersonUpdatedBy } from '../extract-person-updated-by';
import { extractProvider } from '../extract-provider';
import { extractSmartLinkAri } from '../extract-smart-link-ari';
import { extractSmartLinkAuthorGroup } from '../extract-smart-link-author-group';
import { extractSmartLinkCreatedBy } from '../extract-smart-link-created-by';
import { extractSmartLinkCreatedOn } from '../extract-smart-link-created-on';
import { extractSmartLinkDownloadUrl } from '../extract-smart-link-download-url';
import { extractSmartLinkEmbed } from '../extract-smart-link-embed';
import { extractSmartLinkModifiedBy } from '../extract-smart-link-modified-by';
import { extractSmartLinkModifiedOn } from '../extract-smart-link-modified-on';
import { extractSmartLinkProvider } from '../extract-smart-link-provider';
import { extractSmartLinkTitle } from '../extract-smart-link-title';
import { extractSmartLinkUrl } from '../extract-smart-link-url';
import { extractType } from '../extract-type';

type Extractor = (jsonLd: any) => unknown;

const jsonLdExtractors: Record<string, Extractor> = {
	extractContext,
	extractDateCreated,
	extractDateUpdated,
	extractDateViewed,
	extractImage,
	extractMembers,
	extractPersonAssignedTo,
	extractPersonCreatedBy,
	extractPersonOwnedBy,
	extractPersonUpdatedBy,
	extractProvider,
	extractType,
};

const responseExtractors: Record<string, Extractor> = {
	extractSmartLinkAri,
	extractSmartLinkAuthorGroup,
	extractSmartLinkCreatedBy,
	extractSmartLinkCreatedOn,
	extractSmartLinkDownloadUrl,
	extractSmartLinkEmbed,
	extractSmartLinkModifiedBy,
	extractSmartLinkModifiedOn,
	extractSmartLinkProvider,
	extractSmartLinkTitle,
	extractSmartLinkUrl,
};

const meta = {
	access: 'granted',
	auth: [],
	definitionId: 'definition-id',
	visibility: 'public',
} as JsonLd.Meta.BaseMeta;

describe('null safety', () => {
	describe.each(Object.entries(jsonLdExtractors))('%s', (_, extractor) => {
		it.each([undefined, null, {}])('returns undefined for %p', (jsonLd) => {
			expect(extractor(jsonLd)).toBeUndefined();
		});
	});

	describe.each(Object.entries(responseExtractors))('%s', (_, extractor) => {
		it.each([
			['undefined response', undefined],
			['meta only response', { meta }],
			['response with null data', { meta, data: null }],
			['response with empty data', { meta, data: {} }],
		])('does not throw for %s', (__, response) => {
			expect(() => extractor(response)).not.toThrow();
		});
	});
});
