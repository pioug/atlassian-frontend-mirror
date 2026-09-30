import { IconType } from '../../../constants';
import { type IconDescriptor } from './types';

const extractJiraTaskIcon = (taskType?: string): IconDescriptor | undefined => {
	const getIconDescriptor = (icon: IconType, label: string): IconDescriptor => ({ icon, label });
	switch (taskType) {
		case 'JiraBug':
			return getIconDescriptor(IconType.Bug, 'Bug');
		case 'JiraChange':
			return getIconDescriptor(IconType.Change, 'Change');
		case 'JiraEpic':
			return getIconDescriptor(IconType.Epic, 'Epic');
		case 'JiraIncident':
			return getIconDescriptor(IconType.Incident, 'Incident');
		case 'JiraProblem':
			return getIconDescriptor(IconType.Problem, 'Problem');
		case 'JiraServiceRequest':
			return getIconDescriptor(IconType.ServiceRequest, 'Service request');
		case 'JiraStory':
			return getIconDescriptor(IconType.Story, 'Story');
		case 'JiraSubTask':
			return getIconDescriptor(IconType.SubTask, 'Sub-task');
		case 'JiraTask':
		default:
			return getIconDescriptor(IconType.Task, 'Task');
	}
};

export default extractJiraTaskIcon;
