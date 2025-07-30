import React from 'react';

import { act, renderHook as rtlRenderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { type FlagProps } from '@atlaskit/flag';
import { ContainerType } from '@atlaskit/teams-client/types';

import { type ContainerTypes } from '../../../common/types';
import { useTeamContainers } from '../use-team-containers';

import { POLLING_DURATION, POLLING_INTERVAL } from './utils';

import { useRequestedContainers } from './index';

jest.mock('../use-team-containers');
jest.mock('@atlaskit/feature-gate-js-client');

const teamId = 'abc-123';
const cloudId = '123-abc';

function urlSearchParams(search: string) {
	const mockGet = jest.fn();
	const realParams = new URLSearchParams(search);
	mockGet.mockReturnValue(realParams.get('requestedContainers'));
	jest.spyOn(window, 'URLSearchParams').mockImplementation(() => ({ get: mockGet }) as any);
}

function setUpTeamContainers(containers: ContainerTypes[] = []) {
	const refetchTeamContainers = jest.fn();
	(useTeamContainers as jest.Mock).mockReturnValue({
		refetchTeamContainers,
		teamContainers: containers.map((type) => ({ type })),
	});
	return refetchTeamContainers;
}

function refetchContainers(rerender: () => void, containers: ContainerTypes[] = []) {
	(useTeamContainers as jest.Mock).mockReturnValue({
		refetchTeamContainers: jest.fn(),
		teamContainers: containers.map((type) => ({ type })),
	});
	rerender();
}

async function advancePolling() {
	await act(() => jest.advanceTimersByTime(POLLING_INTERVAL));
}

async function advancePollingTimeout() {
	await act(() => jest.advanceTimersByTime(POLLING_DURATION));
}

function renderHook() {
	const onRequestedContainerTimeout = jest.fn();
	const view = rtlRenderHook(
		() => useRequestedContainers({ teamId, cloudId, onRequestedContainerTimeout }),
		{
			wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
		},
	);
	return { ...view, onRequestedContainerTimeout };
}

beforeEach(() => {
	(useTeamContainers as jest.Mock).mockReturnValue({
		refetchTeamContainers: jest.fn(),
		teamContainers: [],
	});
	jest.useFakeTimers();
});

beforeEach(() => {
	(FeatureGates.initializeCalled as jest.Mock).mockReturnValue(true);
	(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue('profile_page');
});

afterEach(() => {
	jest.restoreAllMocks();
});

test('checks containers from the URL params and waits until they are available', () => {
	setUpTeamContainers();
	const requestedContainers = [
		ContainerType.CONFLUENCE_SPACE,
		ContainerType.JIRA_PROJECT,
		ContainerType.LOOM_SPACE,
	];

	urlSearchParams(`?requestedContainers=${requestedContainers.join(',')}`);

	const { result, rerender } = renderHook();
	expect(result.current.requestedContainers).toEqual([
		'ConfluenceSpace',
		'JiraProject',
		'LoomSpace',
	]);

	refetchContainers(rerender, ['ConfluenceSpace']);
	expect(result.current.requestedContainers).toEqual(['JiraProject', 'LoomSpace']);

	refetchContainers(rerender, ['ConfluenceSpace', 'JiraProject']);
	expect(result.current.requestedContainers).toEqual(['LoomSpace']);

	refetchContainers(rerender, ['ConfluenceSpace', 'JiraProject', 'LoomSpace']);
	expect(result.current.requestedContainers).toEqual([]);
});

describe('experiment cohort checks', () => {
	beforeEach(() => {
		setUpTeamContainers();
		const requestedContainers = [ContainerType.CONFLUENCE_SPACE];
		urlSearchParams(`?requestedContainers=${requestedContainers.join(',')}`);
	});

	test('control - no access', () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue('control');
		const { result } = renderHook();
		expect(result.current.requestedContainers).toEqual([]);
	});

	test('profile_page - can access', () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue('profile_page');
		const { result } = renderHook();
		expect(result.current.requestedContainers).toEqual(['ConfluenceSpace']);
	});

	test('universal_create - can access', () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue('universal_create');
		const { result } = renderHook();
		expect(result.current.requestedContainers).toEqual(['ConfluenceSpace']);
	});
});

test('removes invalid container types for the search params', () => {
	urlSearchParams('?requestedContainers=jira,loom,jira');
	const { result } = renderHook();
	expect(result.current.requestedContainers).toEqual([]);
});

test('does nothing if the requestContainers param is not provided', () => {
	urlSearchParams('?container=CONFLUENCE_SPACE');
	const { result } = renderHook();
	expect(result.current.requestedContainers).toEqual([]);
});

test('polls while it is waiting for the containers', async () => {
	const refetchTeamContainers = setUpTeamContainers();
	urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
	renderHook();

	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(2);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(3);
});

test('does not poll if there are no requested containers', async () => {
	const refetchTeamContainers = setUpTeamContainers();
	urlSearchParams('');
	renderHook();

	//verify that the polling does not start
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(0);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(0);
});

test("will time out if the containers aren't found", async () => {
	const MAX_REFETCH_CALLS = 11;
	const refetchTeamContainers = setUpTeamContainers();
	urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
	const { result, onRequestedContainerTimeout } = renderHook();
	expect(result.current.requestedContainers).toEqual(['ConfluenceSpace']);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);
	await advancePollingTimeout();
	expect(onRequestedContainerTimeout).toHaveBeenCalled();

	//verify that the polling stops after the timeout
	expect(refetchTeamContainers).toHaveBeenCalledTimes(MAX_REFETCH_CALLS);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(MAX_REFETCH_CALLS);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(MAX_REFETCH_CALLS);
});

test('will not make any calls if the containers are found when the hook is first called', async () => {
	const refetchTeamContainers = setUpTeamContainers(['ConfluenceSpace']);
	urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
	const { result } = renderHook();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(0);
	expect(result.current.requestedContainers).toEqual([]);

	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(0);
	expect(result.current.requestedContainers).toEqual([]);
});

test('will not call refetchTeamContainers if there is already a request in progress', async () => {
	const timeout = POLLING_INTERVAL * 2;
	const refetchTeamContainers = jest
		.fn()
		.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve([]), timeout)));

	(useTeamContainers as jest.Mock).mockReturnValue({ refetchTeamContainers, teamContainers: [] });
	urlSearchParams(`?requestedContainers=${ContainerType.LOOM_SPACE}`);

	renderHook();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(0);

	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);
	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);

	await advancePolling();
	expect(refetchTeamContainers).toHaveBeenCalledTimes(2);
});

describe('on timeout', () => {
	test('calls onRequestedContainerTimeout if provided', async () => {
		urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
		const { onRequestedContainerTimeout } = renderHook();

		await advancePollingTimeout();
		expect(onRequestedContainerTimeout).toHaveBeenCalled();
	});

	test('user has option to try again', async () => {
		urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
		const { onRequestedContainerTimeout } = renderHook();

		const onAction = jest.fn();

		onRequestedContainerTimeout.mockImplementation((createFlag) => {
			const flag = createFlag({ onAction });
			const tryAgain = flag.actions[0].onClick;
			tryAgain?.({ flagId: flag.id });
		});

		await advancePollingTimeout();

		expect(onAction).toHaveBeenCalled();
	});

	test("if user has tried again, and containers still aren't available then they provided the option to contact support", async () => {
		urlSearchParams(`?requestedContainers=${ContainerType.CONFLUENCE_SPACE}`);
		const { onRequestedContainerTimeout } = renderHook();
		let flags: FlagProps[] = [];

		const onAction = jest.fn();

		onRequestedContainerTimeout.mockImplementation((createFlag) => {
			const flag = createFlag({ onAction });
			flags.push(flag);
			const tryAgain = flag.actions[0].onClick;
			tryAgain?.({ flagId: flag.id });
		});

		await advancePollingTimeout();
		await advancePollingTimeout();

		expect(flags.length).toBe(2);

		expect(renderToString(flags[0].actions?.[0].content)).toContain('Try again');
		expect(renderToString(flags[1].actions?.[0].content)).toContain('Contact support');
	});
});
