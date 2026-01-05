import React from 'react';

import { renderHook } from '@testing-library/react';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { SmartCardProvider } from '@atlaskit/link-provider';

import useResolveHyperlinkValidator from '../useResolveHyperlinkValidator';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: jest.fn(() => true),
}));

const useExperimentGateMock = jest.spyOn(FeatureGates, 'getExperimentValue');

// See more detailed tests in platform/packages/linking-platform/smart-card/src/view/LinkUrl/__tests__/hyperlink-resolver.test.tsx
describe('useResolveHyperlinkValidator', () => {
	const wrapper = ({ children }: { children?: React.ReactNode }) => (
		<SmartCardProvider>{children}</SmartCardProvider>
	);

	beforeEach(() => {
		useExperimentGateMock.mockReturnValue(true);
	});

	it('should return false when SmartCardProvider is not available', () => {
		const { result } = renderHook(() => useResolveHyperlinkValidator('link-url'));
		expect(result.current).toBeFalsy();
	});

	it('should returns true for sharepoint urls', () => {
		const { result } = renderHook(
			() => useResolveHyperlinkValidator('https://atlassianmpsa-my.sharepoint.com/personal/test'),
			{ wrapper },
		);
		expect(result.current).toBeTruthy();
	});

	it('should returns true for google urls', () => {
		const { result } = renderHook(
			() => useResolveHyperlinkValidator('https://docs.google.com/document/d/123/edit'),
			{ wrapper },
		);
		expect(result.current).toBeTruthy();
	});
});
