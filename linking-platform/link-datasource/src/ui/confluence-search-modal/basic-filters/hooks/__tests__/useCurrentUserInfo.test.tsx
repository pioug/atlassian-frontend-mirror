import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl-next';

import {
	failedUserQueryResponse,
	successfulUserQueryResponse,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { useBasicFilterAGG } from '../../../../../services/useBasicFilterAGG';
import { useCurrentUserInfo } from '../useCurrentUserInfo';

jest.mock('../../../../../services/useBasicFilterAGG');

describe('Testing: useCurrentUserInfo', () => {
	const setup = ({
		mockAggResponse = successfulUserQueryResponse,
	}: {
		mockAggResponse?: object;
	}) => {
		const getCurrentUserInfo = jest.fn().mockResolvedValue(mockAggResponse);

		asMock(useBasicFilterAGG).mockReturnValue({
			getCurrentUserInfo,
		});

		const wrapper = ({ children }: { children?: React.ReactNode }) => (
			<IntlProvider locale="en">{children}</IntlProvider>
		);

		const { result, waitForNextUpdate, rerender } = renderHook(() => useCurrentUserInfo(), {
			wrapper,
		});

		return {
			getCurrentUserInfo,
			result,
			waitForNextUpdate,
			rerender,
		};
	};

	it('Should set user state correctly when success is received from AGG', async () => {
		const { result, waitForNextUpdate } = setup({
			mockAggResponse: successfulUserQueryResponse,
		});

		await waitForNextUpdate();

		expect(result.current.user).toEqual({
			accountId: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
			id: 'ari:cloud:identity::user/70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
		});
	});

	// undefined is the default value so state will not be updated for error on initial render
	// We set user to another value to test that the hook manually unsets user for error response
	it('Should set user state to undefined when error is received from AGG', async () => {
		const { result, waitForNextUpdate, getCurrentUserInfo } = setup({
			mockAggResponse: successfulUserQueryResponse,
		});

		await waitForNextUpdate();
		expect(result.current.user).toEqual({
			accountId: '70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
			id: 'ari:cloud:identity::user/70121:97052100-1513-42bc-a2f0-d77e71f0b7eb',
		});

		getCurrentUserInfo.mockResolvedValue(failedUserQueryResponse);
		result.current.getCurrentUserInfo();

		await waitForNextUpdate();

		expect(result.current.user).toEqual(undefined);
	});

	it('Should call AGG for user info when hook is rendered', async () => {
		const { getCurrentUserInfo, waitForNextUpdate } = setup({
			mockAggResponse: successfulUserQueryResponse,
		});
		await waitForNextUpdate();

		expect(getCurrentUserInfo).toHaveBeenCalled();
	});
});
