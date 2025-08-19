import { renderHook } from '@testing-library/react-hooks';

import { useCreateContainers } from '../use-create-containers';
import { useTeamContainers } from '../use-team-containers';

import { INTERVAL_TIME, TIMEOUT_DURATION, useRefreshOnContainerCreated } from './index';

jest.mock('../use-create-containers');
jest.mock('../use-team-containers');

const teamId = 'team-123';

beforeEach(() => {
	jest.clearAllMocks();
	jest.useFakeTimers();
});

function mockCreateContainers() {
	const updateContainerLoading = jest.fn();
	let state = {
		Jira: { isCreated: false },
		Confluence: { isCreated: false },
		Loom: { isCreated: false },
	};
	(useCreateContainers as jest.Mock).mockImplementation(() => [state, { updateContainerLoading }]);
	const setContainers = (value: Partial<typeof state>) => {
		state = { ...state, ...value };
	};
	return { updateContainerLoading, setContainers, getState: () => state };
}

function mockTeamContainers() {
	const refetchTeamContainers = jest.fn();
	let teamContainersState: any[] = [];
	(useTeamContainers as jest.Mock).mockImplementation(() => ({
		refetchTeamContainers,
		teamContainers: teamContainersState,
	}));
	const setTeamContainers = (
		value: { type: 'JiraProject' | 'ConfluenceSpace' | 'LoomSpace' }[],
	) => {
		teamContainersState = value;
	};
	return { refetchTeamContainers, setTeamContainers, getTeamContainers: () => teamContainersState };
}

test('will refresh containers when a new container is created', () => {
	const { updateContainerLoading, setContainers } = mockCreateContainers();
	const { refetchTeamContainers, setTeamContainers } = mockTeamContainers();
	const { rerender } = renderHook(() => useRefreshOnContainerCreated(teamId));

	expect(refetchTeamContainers).not.toHaveBeenCalled();

	setContainers({ Jira: { isCreated: true } });
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(2);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(3);

	setTeamContainers([{ type: 'JiraProject' }]);
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);

	expect(updateContainerLoading).toHaveBeenCalledWith('Jira', false);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(3);
});

test('will do nothing if no new containers are created', () => {
	mockCreateContainers();
	const { refetchTeamContainers } = mockTeamContainers();
	renderHook(() => useRefreshOnContainerCreated(teamId));
	jest.advanceTimersByTime(INTERVAL_TIME * 3);
	expect(refetchTeamContainers).not.toHaveBeenCalled();
});

test('can handle multiple created containers', () => {
	const { setContainers, updateContainerLoading } = mockCreateContainers();
	const { refetchTeamContainers, setTeamContainers } = mockTeamContainers();
	const { rerender } = renderHook(() => useRefreshOnContainerCreated(teamId));

	setContainers({ Jira: { isCreated: true } });
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(1);

	setContainers({ Jira: { isCreated: true }, Loom: { isCreated: true } });
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(2);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(3);

	setTeamContainers([{ type: 'JiraProject' }]);
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(4);

	expect(updateContainerLoading).toHaveBeenCalledWith('Jira', false);

	setTeamContainers([{ type: 'LoomSpace' }]);
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);

	expect(updateContainerLoading).toHaveBeenCalledWith('Loom', false);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(4);

	setContainers({ Confluence: { isCreated: true } });
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(5);

	setTeamContainers([{ type: 'ConfluenceSpace' }]);
	rerender();

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(updateContainerLoading).toHaveBeenCalledWith('Confluence', false);
});

test('will timeout if no new containers are created within the timeout period', () => {
	const { setContainers, updateContainerLoading } = mockCreateContainers();
	const { refetchTeamContainers } = mockTeamContainers();
	const { rerender } = renderHook(() => useRefreshOnContainerCreated(teamId));

	setContainers({ Jira: { isCreated: true } });
	rerender();

	jest.advanceTimersByTime(TIMEOUT_DURATION);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(14);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(refetchTeamContainers).toHaveBeenCalledTimes(14);

	expect(updateContainerLoading).toHaveBeenCalledWith('Jira', false);

	jest.advanceTimersByTime(INTERVAL_TIME);
	expect(updateContainerLoading).toHaveBeenCalledTimes(1);
});
