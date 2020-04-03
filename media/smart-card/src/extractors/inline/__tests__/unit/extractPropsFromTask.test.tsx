import { shallow } from 'enzyme';
import { ReactElement } from 'react';

import { extractInlineViewPropsFromTask } from '../../extractPropsFromTask';
import { JiraTasks } from '../../../../../examples-helpers/_jsonLDExamples/atlassian.task';

const JiraTaskTypes = JiraTasks.slice(0, JiraTasks.length - 2);
const JiraTaskCustomType = JiraTasks[JiraTasks.length - 2];
const JiraTaskCustomTypeWithIcon = JiraTasks[JiraTasks.length - 1];

describe('extractInlineViewPropsFromTask', () => {
  it('should return default icon when a generator is not specified', () => {
    const props = extractInlineViewPropsFromTask({});
    expect(props).toHaveProperty('title', '');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('');
  });

  it('should return task lozenge when tag details are present', () => {
    const props = extractInlineViewPropsFromTask({
      tag: { name: 'hellooooo', appearance: 'success' },
    });
    expect(props).toHaveProperty(
      'lozenge',
      expect.objectContaining({
        text: 'hellooooo',
        appearance: 'success',
      }),
    );
  });

  it('should return task lozenge when taskStatus details are present', () => {
    const props = extractInlineViewPropsFromTask({
      'atlassian:taskStatus': { name: 'byeeeeee' },
    });
    expect(props).toHaveProperty(
      'lozenge',
      expect.objectContaining({
        text: 'byeeeeee',
        appearance: 'success',
      }),
    );
  });

  // Note: Custom issue type does not return a React element - tested separately below.
  JiraTaskTypes.map(task => {
    it(`should return an icon when a Jira generator is provided, with issue type: ${task['atlassian:taskType'].name}`, () => {
      const props = extractInlineViewPropsFromTask(task);
      expect(props).toHaveProperty('title');
      expect(props).toHaveProperty('icon');

      const icon = props.icon as ReactElement<any>;
      const iconRendered = shallow(icon);
      expect(iconRendered.prop('label')).toEqual(task.name || '');
    });
  });

  // For Jira custom issue type:
  it('should return an icon when a Jira generator is provided, with issue type: custom', () => {
    const props = extractInlineViewPropsFromTask(JiraTaskCustomType);
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty('icon', JiraTaskCustomType.icon.url);
  });

  // For Jira custom issue type with a custom issue type icon:
  it('should return an icon when a Jira generator is provided, with issue type: custom and a custom icon', () => {
    let props;
    // With "atlassian:taskType"
    props = extractInlineViewPropsFromTask(JiraTaskCustomTypeWithIcon);
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty(
      'icon',
      JiraTaskCustomTypeWithIcon['atlassian:taskType'].icon.url,
    );

    // With "taskType"
    const modifiedJiraTask = JSON.parse(
      JSON.stringify(JiraTaskCustomTypeWithIcon),
    );
    modifiedJiraTask.taskType = modifiedJiraTask['atlassian:taskType'];
    delete modifiedJiraTask['atlassian:taskType'];

    props = extractInlineViewPropsFromTask(JiraTaskCustomTypeWithIcon);
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty(
      'icon',
      JiraTaskCustomTypeWithIcon['atlassian:taskType'].icon.url,
    );
  });
});
