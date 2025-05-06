import { MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE } from '../../../mocks/responses';
import { type Recommendation, type RecommendationsResponse } from '../types';

import { removeDuplicateRecommendations } from './index';

describe('utils', () => {
	const recommendationJSW: Recommendation =
		MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE.capability.REQUEST_ACCESS[0];
	const recommendationConnie: Recommendation =
		MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE.capability.DIRECT_ACCESS[0];

	it('should return the same result when no duplicates', () => {
		expect(removeDuplicateRecommendations(MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE)).toEqual(
			MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE,
		);
	});
	it('should override with mode = open when duplicates exist', () => {
		const withDuplicates: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'DOMAIN',
					},
					{
						...recommendationConnie,
						mode: 'OPEN',
					},
				],
			},
		};

		const expected: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'OPEN',
					},
				],
			},
		};

		expect(removeDuplicateRecommendations(withDuplicates)).toEqual(expected);
	});

	it('should override mode when duplicate mode = undefined', () => {
		const withDuplicates: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
					{
						...recommendationJSW,
						mode: undefined,
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'OPEN',
					},
					{
						...recommendationConnie,
						mode: undefined,
					},
				],
			},
		};

		const expected: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'OPEN',
					},
				],
			},
		};

		expect(removeDuplicateRecommendations(withDuplicates)).toEqual(expected);
	});

	it('should remove duplicates when mode is the same', () => {
		const withDuplicates: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'DOMAIN',
					},
					{
						...recommendationConnie,
						mode: 'DOMAIN',
					},
				],
			},
		};

		const expected: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: 'DOMAIN',
					},
				],
			},
		};

		expect(removeDuplicateRecommendations(withDuplicates)).toEqual(expected);
	});

	it('should override with direct access when duplicate has capability of request access', () => {
		const withDuplicates: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'OPEN',
					},
					{
						...recommendationConnie,
						mode: 'DOMAIN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
					{
						...recommendationConnie,
						mode: undefined,
					},
				],
			},
		};

		const expected: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [],
				DIRECT_ACCESS: [
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
					{
						...recommendationConnie,
						mode: undefined,
					},
				],
			},
		};

		expect(removeDuplicateRecommendations(withDuplicates)).toEqual(expected);
	});

	it('should remove duplicates when capability and mode are the same', () => {
		const withDuplicates: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: undefined,
					},
					{
						...recommendationConnie,
						mode: undefined,
					},
				],
			},
		};

		const expected: RecommendationsResponse = {
			capability: {
				REQUEST_ACCESS: [
					{
						...recommendationJSW,
						mode: 'DOMAIN',
					},
				],
				DIRECT_ACCESS: [
					{
						...recommendationConnie,
						mode: undefined,
					},
				],
			},
		};

		expect(removeDuplicateRecommendations(withDuplicates)).toEqual(expected);
	});
});
