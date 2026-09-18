import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { JIRA_GENERATOR_ID } from '../constants';
import { extractInlineProps } from './index';

jest.mock('@atlaskit/link-extractors/extract-smart-link-inline-icon', () => ({
	extractSmartLinkInlineIcon: jest.fn(() => 'copied-inline-icon'),
}));

const { extractSmartLinkInlineIcon: extractSmartLinkInlineIconFromLinkExtractors } =
	jest.requireMock('@atlaskit/link-extractors/extract-smart-link-inline-icon') as {
		extractSmartLinkInlineIcon: jest.Mock;
	};

const JIRA_CUSTOM_ICON_URL = 'https://jira.example.com/custom-issue-icon.png';

const createJiraCustomTaskResponse = (taskTypeName: string): SmartLinkResponse =>
	({
		meta: {
			access: 'granted',
			visibility: 'restricted',
			resourceType: 'issue',
		},

		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': ['atlassian:Task', 'Object'],
			generator: {
				'@type': 'Application',
				'@id': JIRA_GENERATOR_ID,
				name: 'Jira',
			},
			taskType: {
				'@type': ['Object', 'atlassian:TaskType'],
				'@id': 'https://www.atlassian.com/#JiraCustomTaskType',
				name: taskTypeName,
				icon: {
					'@type': 'Image',
					url: JIRA_CUSTOM_ICON_URL,
				},
			},
			icon: {
				'@type': 'Image',
				url: JIRA_CUSTOM_ICON_URL,
			},
		},
	}) as SmartLinkResponse;

const response: SmartLinkResponse = {
	meta: {
		access: 'granted',
		visibility: 'public',
	},
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
	},
};

describe('extractInlineProps', () => {
	beforeEach(() => {
		extractSmartLinkInlineIconFromLinkExtractors.mockClear();
	});

	it('should return the type of the response', () => {
		const result = extractInlineProps(response);
		expect(result.type).toEqual(['Document']);
	});

	it.each(['Bug', 'Epic', 'Task'])(
		'returns the Jira custom issue icon with its %s subtype label when the gate is on',
		(taskTypeName) => {
			passGate('platform_navx_jira_issue_type_icon_label_a11y');

			const result = extractInlineProps(createJiraCustomTaskResponse(taskTypeName));

			expect(result.icon).toEqual([JIRA_CUSTOM_ICON_URL, taskTypeName]);
		},
	);

	it('preserves the unlabeled Jira custom issue icon URL when the gate is off', () => {
		failGate('platform_navx_jira_issue_type_icon_label_a11y');

		const result = extractInlineProps(createJiraCustomTaskResponse('Bug'));

		expect(result.icon).toBe(JIRA_CUSTOM_ICON_URL);
	});

	it('uses the Jira subtype label when the resolved inline card disables legacy icon labels', () => {
		passGate('platform_navx_jira_issue_type_icon_label_a11y');

		const result = extractInlineProps(
			createJiraCustomTaskResponse('Bug'),
			undefined,
			undefined,
			false,
		);

		expect(result.icon).toEqual([JIRA_CUSTOM_ICON_URL, 'Bug']);
	});

	it('should use the link-extractors inline icon helper when experiment is enabled', () => {
		mockExpEnabled('confluence_1p_and_3p_connection_byline_experiment');

		const result = extractInlineProps(response);

		expect(result.icon).toBe('copied-inline-icon');
		expect(extractSmartLinkInlineIconFromLinkExtractors).toHaveBeenCalledWith(response, true);
	});

	it('should keep using the local inline icon helper when experiment is disabled', () => {
		mockExpDisabled('confluence_1p_and_3p_connection_byline_experiment');

		const result = extractInlineProps({
			...response,
			data: {
				...response.data,
				generator: {
					'@type': 'Application',
					name: 'Google Drive',
					icon: {
						'@type': 'Image',
						url: 'https://provider-icon.com/icon.png',
					},
				},
			},
		} as SmartLinkResponse);

		expect(result.icon).toBe('https://provider-icon.com/icon.png');
		expect(extractSmartLinkInlineIconFromLinkExtractors).not.toHaveBeenCalled();
	});

	it('should use entity icon url and label tuple', () => {
		const result = extractInlineProps({
			...response,
			meta: {
				...response.meta,
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

		expect(result.icon).toEqual(['https://entity-icon.com/icon.png', 'document']);
	});
});
