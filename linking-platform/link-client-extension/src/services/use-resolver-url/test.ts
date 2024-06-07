import { renderHook } from '@testing-library/react-hooks';

import { CardClient } from '@atlaskit/link-provider';

import { useResolverUrl } from './index';

describe('useResolverUrl', () => {
	it('returns default resolver url', () => {
		const { result } = renderHook(() => {
			const cardClient = new CardClient();
			return useResolverUrl(cardClient);
		});

		expect(result.current).toBeDefined();
	});

	it('returns resolver url defined by provided environment', () => {
		const { result } = renderHook(() => {
			const cardClient = new CardClient('stg');
			return useResolverUrl(cardClient);
		});
		expect(result.current).toEqual(expect.stringMatching(/.*?pug\.jira-dev.*?\/object-resolver/));
	});

	it('returns resolver url defined by provided override url', () => {
		const { result } = renderHook(() => {
			const cardClient = new CardClient('stg', 'https://trellis.coffee/gateway/api');
			return useResolverUrl(cardClient);
		});
		expect(result.current).toEqual('https://trellis.coffee/gateway/api/object-resolver');
	});
});
