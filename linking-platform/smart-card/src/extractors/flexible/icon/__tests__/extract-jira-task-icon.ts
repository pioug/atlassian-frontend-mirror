import extractJiraTaskIcon from '../extract-jira-task-icon';
import { IconType } from '../../../../constants';

describe('extractJiraTaskIcon', () => {
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
});
