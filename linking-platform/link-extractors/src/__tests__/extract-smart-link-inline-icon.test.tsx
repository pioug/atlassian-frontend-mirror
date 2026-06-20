import React from 'react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../constants';
import { extractSmartLinkInlineIcon } from '../extract-smart-link-inline-icon';

const baseResponse: SmartLinkResponse = {
	meta: {
		access: 'granted',
		visibility: 'public',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'Document',
	},
};

const getIconDisplayName = (icon: ReturnType<typeof extractSmartLinkInlineIcon>) =>
	React.isValidElement(icon) ? (icon.type as { displayName?: string }).displayName : undefined;

describe('extractSmartLinkInlineIcon', () => {
	it('returns the provider icon for JSON-LD responses', () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				generator: {
					'@type': 'Application',
					name: 'Google Drive',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as unknown as SmartLinkResponse);

		expect(icon).toBe('https://provider-icon.com/icon.png');
	});

	it('returns a type icon for Confluence digital documents', () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				'@type': 'schema:DigitalDocument',
				generator: {
					'@id': CONFLUENCE_GENERATOR_ID,
					'@type': 'Application',
					name: 'Confluence',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as unknown as SmartLinkResponse);

		const { getByTestId } = render(icon);
		expect(getByTestId('live-doc-icon')).toBeInTheDocument();
		expect(getIconDisplayName(icon)).toBe('LiveDocumentIconWithColor');
	});

	it('returns the copied Smart Card blog icon wrapper for blog posts', () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				'@type': 'schema:BlogPosting',
			},
		} as unknown as SmartLinkResponse);

		const { getByTestId } = render(icon);
		expect(getByTestId('blog-icon')).toBeInTheDocument();
		expect(getIconDisplayName(icon)).toBe('BlogIconWithColor');
	});

	it('returns the copied Smart Card spreadsheet icon wrapper for spreadsheets', () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				'@type': 'schema:SpreadsheetDigitalDocument',
			},
		} as SmartLinkResponse);

		const { getByTestId } = render(icon);
		expect(getByTestId('spreadsheet-icon')).toBeInTheDocument();
		expect(getIconDisplayName(icon)).toBe('ListBulletedIconWithColor');
	});

	it('returns a file-format icon ahead of a provider icon for documents', async () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				'@type': 'Document',
				'schema:fileFormat': 'image/jpeg',
				generator: {
					'@type': 'Application',
					name: 'Google Drive',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as unknown as SmartLinkResponse);

		const { findByTestId } = render(icon);
		expect(await findByTestId('document-file-format-icon')).toBeInTheDocument();
	});

	it('returns the copied Smart Card Jira issue type icon', () => {
		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			data: {
				...baseResponse.data,
				'@type': 'atlassian:Task',
				'atlassian:taskType': `${JIRA_GENERATOR_ID}#JiraBug`,
				generator: {
					'@id': JIRA_GENERATOR_ID,
					'@type': 'Application',
					name: 'Jira',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as unknown as SmartLinkResponse);

		const { getByTestId, queryByTestId } = render(icon);
		expect(getByTestId('jira-bug-icon')).toBeInTheDocument();
		expect(queryByTestId('jira-task-icon')).not.toBeInTheDocument();
	});

	it('keeps the provider icon for entities when entity icon gate is off', () => {
		failGate('platform_lp_use_entity_icon_url_for_icon');

		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			meta: {
				...baseResponse.meta,
				generator: {
					name: 'Google Drive',
					icon: {
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
			entityData: {
				displayName: 'Entity',
				id: 'entity-id',
				url: 'https://entity-url.com',
				type: {
					category: 'document',
					iconUrl: 'https://entity-icon.com/icon.png',
				},
			},
		} as SmartLinkResponse);

		expect(icon).toEqual('https://provider-icon.com/icon.png');
	});

	it('returns an entity icon tuple when entity icon gate is on', () => {
		passGate('platform_lp_use_entity_icon_url_for_icon');

		const icon = extractSmartLinkInlineIcon({
			...baseResponse,
			meta: {
				...baseResponse.meta,
				generator: {
					name: 'Google Drive',
					icon: {
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
			entityData: {
				displayName: 'Entity',
				id: 'entity-id',
				url: 'https://entity-url.com',
				type: {
					category: 'document',
					iconUrl: 'https://entity-icon.com/icon.png',
				},
			},
		} as SmartLinkResponse);

		expect(icon).toEqual(['https://entity-icon.com/icon.png', 'document']);
	});
});
