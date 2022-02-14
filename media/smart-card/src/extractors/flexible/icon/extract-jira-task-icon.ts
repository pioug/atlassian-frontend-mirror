import { IconDescriptor } from './types';
import { IconType } from '../../../constants';

const extractJiraTaskIcon = (
  taskType?: string,
  label = 'Task',
): IconDescriptor | undefined => {
  switch (taskType) {
    case 'JiraBug':
      return [IconType.Bug, label];
    case 'JiraChange':
      return [IconType.Change, label];
    case 'JiraEpic':
      return [IconType.Epic, label];
    case 'JiraIncident':
      return [IconType.Incident, label];
    case 'JiraProblem':
      return [IconType.Problem, label];
    case 'JiraServiceRequest':
      return [IconType.ServiceRequest, label];
    case 'JiraStory':
      return [IconType.Story, label];
    case 'JiraSubTask':
      return [IconType.SubTask, label];
    case 'JiraTask':
    default:
      return [IconType.Task, label];
  }
};

export default extractJiraTaskIcon;
