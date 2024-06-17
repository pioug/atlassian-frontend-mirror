import {
	TEST_DOCUMENT_WITH_ARI,
	TEST_RESOLVED_META_DATA,
	TEST_RESOLVED_META_DATA_WITH_AI_SUMMARY,
} from '../../../common/__mocks__/jsonld';
import { extractAISummaryAction } from '../extract-ai-summary-action';
import { type AISummaryConfig } from '../../../../state/hooks/use-ai-summary-config/types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const TEST_URL = 'https://my.url.com';

const TEST_AI_SUMMARY_OPTIONS: AISummaryConfig = {
	isAdminHubAIEnabled: true,
};

describe('extractAISummaryAction', () => {
	const generateResponse = () => ({
		data: {
			...TEST_DOCUMENT_WITH_ARI,
		},
		meta: TEST_RESOLVED_META_DATA_WITH_AI_SUMMARY,
	});

	describe('returns AI summary action', () => {
		ffTest(
			'platform.linking-platform.smart-card.hover-card-ai-summaries',
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					undefined,
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual({ url: TEST_URL });
			},
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					undefined,
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual(undefined);
			},
		);
	});

	describe('does return AI summary action if the actionOptions are defined', () => {
		ffTest(
			'platform.linking-platform.smart-card.hover-card-ai-summaries',
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					{ hide: false },
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual({ url: TEST_URL });
			},
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					undefined,
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual(undefined);
			},
		);
	});

	describe('does return AI summary action if the actionOptions are undefined', () => {
		ffTest(
			'platform.linking-platform.smart-card.hover-card-ai-summaries',
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					undefined,
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual({ url: TEST_URL });
			},
			() => {
				const response = generateResponse();
				const action = extractAISummaryAction(
					response,
					TEST_URL,
					undefined,
					TEST_AI_SUMMARY_OPTIONS,
				);

				expect(action).toEqual(undefined);
			},
		);
	});

	describe('does not return AI summary action if the URL is not defined', () => {
		ffTest('platform.linking-platform.smart-card.hover-card-ai-summaries', () => {
			const response = generateResponse();
			const action = extractAISummaryAction(response, undefined);

			expect(action).toBe(undefined);
		});
	});

	describe('does not return AI summary action if isAdminHubAIEnabled is false', () => {
		ffTest('platform.linking-platform.smart-card.hover-card-ai-summaries', () => {
			const response = generateResponse();
			const action = extractAISummaryAction(response, TEST_URL, undefined, {
				...TEST_AI_SUMMARY_OPTIONS,
				isAdminHubAIEnabled: false,
			});

			expect(action).toBe(undefined);
		});
	});

	describe('does not return AI summary action if link is not support AI Summary', () => {
		ffTest('platform.linking-platform.smart-card.hover-card-ai-summaries', () => {
			const action = extractAISummaryAction(
				{ data: TEST_DOCUMENT_WITH_ARI, meta: TEST_RESOLVED_META_DATA },
				undefined,
			);

			expect(action).toBe(undefined);
		});
	});
});
