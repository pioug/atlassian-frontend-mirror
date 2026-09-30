import { IconType } from '../../../../constants';
import extractJiraTaskIcon from '../extract-jira-task-icon';

describe('extractJiraTaskIcon', () => {
	it.each([
		['JiraBug', IconType.Bug, 'Bug'],
		['JiraChange', IconType.Change, 'Change'],
		['JiraEpic', IconType.Epic, 'Epic'],
		['JiraIncident', IconType.Incident, 'Incident'],
		['JiraProblem', IconType.Problem, 'Problem'],
		['JiraServiceRequest', IconType.ServiceRequest, 'Service request'],
		['JiraStory', IconType.Story, 'Story'],
		['JiraSubTask', IconType.SubTask, 'Sub-task'],
		['JiraTask', IconType.Task, 'Task'],
	])('returns the %s icon with its semantic label', (taskType, icon, label) => {
		expect(extractJiraTaskIcon(taskType)).toEqual({ icon, label });
	});

	it.each(['random', undefined])('returns the default icon for task type %s', (taskType) => {
		expect(extractJiraTaskIcon(taskType)).toEqual({ icon: IconType.Task, label: 'Task' });
	});
});
