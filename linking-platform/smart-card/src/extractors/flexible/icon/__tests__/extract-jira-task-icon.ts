import { ffTest } from '@atlassian/feature-flags-test-utils';

import { IconType } from '../../../../constants';
import extractJiraTaskIcon from '../extract-jira-task-icon';

describe('extractJiraTaskIcon', () => {
	ffTest.on('platform_navx_smart_link_icon_label_a11y', 'semantic labels when flag is on', () => {
		describe.each([
			['bug', 'JiraBug', IconType.Bug, 'Bug'],
			['change', 'JiraChange', IconType.Change, 'Change'],
			['epic', 'JiraEpic', IconType.Epic, 'Epic'],
			['incident', 'JiraIncident', IconType.Incident, 'Incident'],
			['problem', 'JiraProblem', IconType.Problem, 'Problem'],
			['service request', 'JiraServiceRequest', IconType.ServiceRequest, 'Service request'],
			['story', 'JiraStory', IconType.Story, 'Story'],
			['subtask', 'JiraSubTask', IconType.SubTask, 'Sub-task'],
			['task', 'JiraTask', IconType.Task, 'Task'],
		])('%s icon', (_, taskType, expectedIconType, expectedLabel) => {
			it(`returns ${expectedIconType} with semantic label`, () => {
				const { icon, label } = extractJiraTaskIcon(taskType) || {};

				expect(icon).toEqual(expectedIconType);
				expect(label).toEqual(expectedLabel);
			});
		});

		it('returns default icon if task type does not match', () => {
			const { icon, label } = extractJiraTaskIcon('random') || {};

			expect(icon).toEqual(IconType.Task);
			expect(label).toEqual('Task');
		});
	});

	ffTest.off(
		'platform_navx_smart_link_icon_label_a11y',
		'uses link title when flag off (legacy)',
		() => {
			describe.each([
				['bug', 'JiraBug', IconType.Bug],
				['change', 'JiraChange', IconType.Change],
				['epic', 'JiraEpic', IconType.Epic],
				['incident', 'JiraIncident', IconType.Incident],
				['problem', 'JiraProblem', IconType.Problem],
				['service request', 'JiraServiceRequest', IconType.ServiceRequest],
				['story', 'JiraStory', IconType.Story],
				['subtask', 'JiraSubTask', IconType.SubTask],
				['task', 'JiraTask', IconType.Task],
			])('%s icon', (_, taskType, expectedIconType) => {
				it(`returns ${expectedIconType} with default label`, () => {
					const { icon, label } = extractJiraTaskIcon(taskType) || {};

					expect(icon).toEqual(expectedIconType);
					expect(label).toEqual('Task');
				});

				it(`returns ${expectedIconType} with custom label`, () => {
					const customLabel = 'custom-label';
					const { icon, label } = extractJiraTaskIcon(taskType, customLabel) || {};

					expect(icon).toEqual(expectedIconType);
					expect(label).toEqual(customLabel);
				});
			});

			it('returns default icon if task type does not match', () => {
				const { icon, label } = extractJiraTaskIcon('random') || {};

				expect(icon).toEqual(IconType.Task);
				expect(label).toEqual('Task');
			});

			it('returns default icon with custom label when title passed', () => {
				const customLabel = 'Fallback title';
				const { icon, label } = extractJiraTaskIcon('random', customLabel) || {};

				expect(icon).toEqual(IconType.Task);
				expect(label).toEqual(customLabel);
			});
		},
	);

	ffTest.on(
		'platform_navx_smart_link_icon_label_a11y',
		'prefers semantic label over title when flag is on',
		() => {
			it('prefers semantic label over title when flag is on', () => {
				const { icon, label } = extractJiraTaskIcon('JiraBug', 'My bug title') || {};

				expect(icon).toEqual(IconType.Bug);
				expect(label).toEqual('Bug');
			});
		},
	);

	ffTest.off(
		'platform_navx_smart_link_icon_label_a11y',
		'uses title for label when flag off and title is provided',
		() => {
			it('uses title for label when flag off and title is provided', () => {
				const { icon, label } = extractJiraTaskIcon('JiraBug', 'My bug title') || {};

				expect(icon).toEqual(IconType.Bug);
				expect(label).toEqual('My bug title');
			});
		},
	);
});
