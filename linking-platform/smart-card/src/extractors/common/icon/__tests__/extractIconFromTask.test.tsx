import { render, screen } from '@testing-library/react';

import {
	JIRA_BUG,
	JIRA_CHANGE,
	JIRA_CUSTOM_TASK_TYPE,
	JIRA_EPIC,
	JIRA_GENERATOR_ID,
	JIRA_INCIDENT,
	JIRA_PROBLEM,
	JIRA_SERVICE_REQUEST,
	JIRA_STORY,
	JIRA_SUB_TASK,
	JIRA_TASK,
} from '../../../constants';
import { TEST_URL } from '../../__mocks__/jsonld';
import { withIntl } from '../../__mocks__/withIntl';
import { extractIconFromTask } from '../extractIconFromTask';

describe('extractors.icon.task', () => {
	it('returns default icon if no opts given', async () => {
		const icon = extractIconFromTask({});
		render(withIntl(icon));
		expect(await screen.findByTestId('default-task-icon')).toBeVisible();
	});

	it('returns jira icon if jira task', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_TASK },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-task-icon')).toBeVisible();
	});

	it('returns jira icon if jira sub task', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_SUB_TASK },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-subtask-icon')).toBeVisible();
	});

	it('returns jira icon if jira story', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_STORY },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-story-icon')).toBeVisible();
	});

	it('returns jira icon if jira bug', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_BUG },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-bug-icon')).toBeVisible();
	});

	it('returns jira icon if jira epic', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_EPIC },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-epic-icon')).toBeVisible();
	});

	it('returns jira icon if jira incident', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_INCIDENT },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-incident-icon')).toBeVisible();
	});

	it('returns jira icon if jira service request', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_SERVICE_REQUEST },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-service-request-icon')).toBeVisible();
	});

	it('returns jira icon if jira change', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_CHANGE },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-change-icon')).toBeVisible();
	});

	it('returns jira icon if jira problem', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_PROBLEM },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('jira-problem-icon')).toBeVisible();
	});

	it('returns icon if jira custom task - task type icon defined', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_CUSTOM_TASK_TYPE, icon: TEST_URL },
		});
		expect(icon).toBe(TEST_URL);
	});

	it('returns icon if jira custom task - top-level icon defined', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_CUSTOM_TASK_TYPE },
			icon: TEST_URL,
		});
		expect(icon).toBe(TEST_URL);
	});

	it('returns icon if jira custom task - provider icon defined', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira', icon: TEST_URL },
			taskType: { id: JIRA_CUSTOM_TASK_TYPE },
		});
		expect(icon).toBe(TEST_URL);
	});

	it('returns icon if jira custom task - default fallback icon', async () => {
		const icon = extractIconFromTask({
			provider: { id: JIRA_GENERATOR_ID, text: 'Jira' },
			taskType: { id: JIRA_CUSTOM_TASK_TYPE },
		});
		render(withIntl(icon));
		expect(await screen.findByTestId('default-task-icon')).toBeVisible();
	});
});
