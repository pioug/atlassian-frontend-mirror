import { fg } from '@atlaskit/platform-feature-flags';

import { IconType } from '../../../constants';

import { type IconDescriptor } from './types';

const extractJiraTaskIcon = (taskType?: string, label?: string): IconDescriptor | undefined => {
	const getLabel = (hardcodedLabel: string) =>
		fg('platform_navx_smart_link_icon_label_a11y') ? hardcodedLabel : label || 'Task';
	switch (taskType) {
		case 'JiraBug':
			return { icon: IconType.Bug, label: getLabel('Bug') };
		case 'JiraChange':
			return { icon: IconType.Change, label: getLabel('Change') };
		case 'JiraEpic':
			return { icon: IconType.Epic, label: getLabel('Epic') };
		case 'JiraIncident':
			return { icon: IconType.Incident, label: getLabel('Incident') };
		case 'JiraProblem':
			return { icon: IconType.Problem, label: getLabel('Problem') };
		case 'JiraServiceRequest':
			return { icon: IconType.ServiceRequest, label: getLabel('Service request') };
		case 'JiraStory':
			return { icon: IconType.Story, label: getLabel('Story') };
		case 'JiraSubTask':
			return { icon: IconType.SubTask, label: getLabel('Sub-task') };
		case 'JiraTask':
		default:
			return { icon: IconType.Task, label: getLabel('Task') };
	}
};

export default extractJiraTaskIcon;
