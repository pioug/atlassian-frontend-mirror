import { renderHook } from '@testing-library/react-hooks';
import { type JsonLd } from 'json-ld-types';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { mocks } from '../../../utils/mocks';
import useInvokeClientAction from '../../hooks/use-invoke-client-action';
import { useSmartCardState } from '../../store';
import { type CardState } from '../../types';
import { useSmartLinkActions } from '../useSmartLinkActions';

jest.mock('../../analytics', () => ({
	useSmartLinkAnalytics: jest.fn(),
	failUfoExperience: jest.fn(),
	startUfoExperience: jest.fn(),
	succeedUfoExperience: jest.fn(),
}));

jest.mock('../../store', () => ({
	useSmartCardState: jest.fn(),
}));

jest.mock('../../hooks/use-invoke-client-action', () => ({
	__esModule: true,
	default: jest.fn(),
}));

const url = 'https://start.atlassian.com';
const appearance = 'block';

const mockNoActions = () => {
	const details = { ...mocks.success };
	(details.data as JsonLd.Data.BaseData).preview = undefined;
	(details.data as JsonLd.Data.BaseData)['schema:potentialAction'] = undefined;

	const state: CardState = { details, status: 'resolved' };

	(useSmartCardState as jest.Mock).mockReturnValue(state);
};

const mockWithActions = () => {
	const mockInvokeClientAction = jest.fn();
	(useInvokeClientAction as jest.Mock).mockReturnValue(mockInvokeClientAction);

	const state: CardState = { details: mocks.success, status: 'resolved' };

	(useSmartCardState as jest.Mock).mockReturnValue(state);

	return mockInvokeClientAction;
};

const mockLifecycle = () => {
	const pendingState: CardState = { status: 'pending' };
	const resolvingState: CardState = { status: 'resolving' };
	const resolvedState: CardState = {
		details: mocks.success,
		status: 'resolved',
	};

	(useSmartCardState as jest.Mock)
		.mockImplementationOnce(() => pendingState)
		.mockImplementationOnce(() => resolvingState)
		.mockImplementationOnce(() => resolvedState);
};

describe(useSmartLinkActions.name, () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('returns list of actions when data available', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', () => {
			mockWithActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			expect(result.current).toHaveLength(2);
		});
	});

	describe('returns server-based action', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', () => {
			mockWithActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			expect(result.current?.[0]).toMatchObject({ id: 'download-content' });
		});
	});

	describe('returns client-based action', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', () => {
			mockWithActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			expect(result.current?.[1]).toMatchObject({ id: 'preview-content' });
		});
	});

	describe('invokes correct promise on trigger of action (first)', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', async () => {
			const actionHandler = mockWithActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			await result.current?.[0].invoke();

			expect(actionHandler).toHaveBeenCalledTimes(1);
		});
	});

	describe('invokes correct promise on trigger of action (second)', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', async () => {
			const actionHandler = mockWithActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			await result.current?.[1].invoke();
			expect(actionHandler).toHaveBeenCalledTimes(1);
		});
	});

	it('returns no actions when actionOptions.hide is true', () => {
		mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({
				url,
				appearance,
				actionOptions: { hide: true },
			}),
		);

		expect(result.current).toEqual([]);
	});

	describe('returns actions as expected when useSmartCardState changes', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', () => {
			mockLifecycle();

			const { result, rerender } = renderHook(() => useSmartLinkActions({ url, appearance }));

			// pending state
			expect(result.current).toEqual([]);
			rerender();

			// resolving state
			expect(result.current).toEqual([]);
			rerender();

			// resolved state
			expect(result.current).toHaveLength(2);
		});
	});

	describe('returns empty list when no data available', () => {
		ffTest('platform-smart-card-migrate-embed-modal-analytics', () => {
			mockNoActions();

			const { result } = renderHook(() => useSmartLinkActions({ url, appearance }));

			expect(result.current).toEqual([]);
		});
	});
});
