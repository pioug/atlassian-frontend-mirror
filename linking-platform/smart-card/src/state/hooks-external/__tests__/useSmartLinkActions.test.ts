jest.mock('@atlaskit/link-provider', () => {
	return {
		...jest.requireActual<Object>('@atlaskit/link-provider'),
		useFeatureFlag: jest.fn(),
	};
});

import { renderHook } from '@testing-library/react-hooks';
import { type JsonLd } from 'json-ld-types';
import { mocked } from 'ts-jest/utils';

import { mocks } from '../../../utils/mocks';
import { useSmartCardState } from '../../store';
import { useSmartLinkActions } from '../useSmartLinkActions';
import { type CardState } from '../../types';
import { extractBlockProps } from '../../../extractors/block';

jest.mock('../../actions', () => ({
	useSmartCardActions: jest.fn(),
}));
jest.mock('../../analytics', () => ({
	useSmartLinkAnalytics: jest.fn(),
}));
jest.mock('../../store', () => ({
	useSmartCardState: jest.fn(),
}));
jest.mock('../../../extractors/block', () => ({
	extractBlockProps: jest.fn(),
}));

const url = 'https://start.atlassian.com';
const appearance = 'block';
const analytics = () => {};

const mockNoActions = () => {
	const details = { ...mocks.success };
	(details.data as JsonLd.Data.BaseData).preview = undefined;
	(details.data as JsonLd.Data.BaseData)['schema:potentialAction'] = undefined;

	const state: CardState = { details, status: 'resolved' };
	const props = { icon: {}, actions: [] };

	mocked(useSmartCardState).mockReturnValueOnce(state);
	mocked(extractBlockProps).mockReturnValueOnce(props);
};

const mockWithActions = () => {
	const handler = jest.fn().mockResolvedValue(true);

	const state: CardState = { details: mocks.success, status: 'resolved' };
	const props = {
		icon: {},
		actions: [
			{ id: 'comment', text: 'Comment', promise: handler },
			{ id: 'preview', text: 'Preview', promise: handler },
		],
	};

	mocked(useSmartCardState).mockImplementation(() => state);
	mocked(extractBlockProps).mockImplementation(() => props);

	return handler;
};

const mockLifecycle = () => {
	const handler = jest.fn().mockResolvedValue(true);

	const pendingState: CardState = { status: 'pending' };
	const resolvingState: CardState = { status: 'resolving' };
	const resolvedState: CardState = {
		details: mocks.success,
		status: 'resolved',
	};

	mocked(useSmartCardState)
		.mockImplementationOnce(() => pendingState)
		.mockImplementationOnce(() => resolvingState)
		.mockImplementationOnce(() => resolvedState);

	const props = {
		icon: {},
		actions: [
			{ id: 'comment', text: 'Comment', promise: handler },
			{ id: 'preview', text: 'Preview', promise: handler },
		],
	};

	mocked(extractBlockProps).mockImplementation(() => props);
};

describe(useSmartLinkActions.name, () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns empty list when no data available', () => {
		mockNoActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		expect(result.current).toEqual([]);
	});

	it('returns list of actions when data available', () => {
		mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		expect(result.current).toHaveLength(2);
	});

	it('returns server-based action', () => {
		mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		expect(result.current?.[0]).toMatchObject({ id: 'comment' });
	});

	it('returns client-based action', () => {
		mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		expect(result.current?.[1]).toMatchObject({ id: 'preview' });
	});

	it('invokes correct promise on trigger of action (first)', () => {
		const actionHandler = mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		result.current?.[0].invoke();
		expect(actionHandler).toHaveBeenCalledTimes(1);
	});

	it('invokes correct promise on trigger of action (second)', () => {
		const actionHandler = mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

		result.current?.[1].invoke();
		expect(actionHandler).toHaveBeenCalledTimes(1);
	});

	it('returns no actions when actionOptions.hide is true', () => {
		mockWithActions();

		const { result } = renderHook(() =>
			useSmartLinkActions({
				url,
				appearance,
				analyticsHandler: analytics,
				actionOptions: { hide: true },
			}),
		);

		expect(result.current).toEqual([]);
	});

	it('returns actions as expected when useSmartCardState changes', () => {
		mockLifecycle();

		const { result, rerender } = renderHook(() =>
			useSmartLinkActions({ url, appearance, analyticsHandler: analytics }),
		);

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
