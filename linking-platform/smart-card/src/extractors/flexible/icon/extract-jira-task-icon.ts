import { type IconDescriptor } from './types';
import { IconType } from '../../../constants';

const extractJiraTaskIcon = (taskType?: string, label = 'Task'): IconDescriptor | undefined => {
	switch (taskType) {
		case 'JiraBug':
			return { icon: IconType.Bug, label };
		case 'JiraChange':
			return { icon: IconType.Change, label };
		case 'JiraEpic':
			return { icon: IconType.Epic, label };
		case 'JiraIncident':
			return { icon: IconType.Incident, label };
		case 'JiraProblem':
			return { icon: IconType.Problem, label };
		case 'JiraServiceRequest':
			return { icon: IconType.ServiceRequest, label };
		case 'JiraStory':
			return { icon: IconType.Story, label };
		case 'JiraSubTask':
			return { icon: IconType.SubTask, label };
		case 'JiraTask':
		default:
			return { icon: IconType.Task, label };
	}
};

export default extractJiraTaskIcon;
