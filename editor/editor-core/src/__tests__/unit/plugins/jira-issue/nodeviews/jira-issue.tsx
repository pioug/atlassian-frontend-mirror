import React from 'react';
import { mount } from 'enzyme';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import ReactJIRAIssueNode from '../../../../../plugins/jira-issue/nodeviews/jira-issue';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { confluenceJiraIssue } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

describe('jiraIssue - React component', () => {
  it('should return a node of type span', () => {
    const node = confluenceJiraIssue({ issueKey: 'test' })()(defaultSchema);
    const wrapper = mount(<ReactJIRAIssueNode node={node} />);
    expect(wrapper.find('span[data-testid="jira-issue-node"]').length).toEqual(
      1,
    );
    wrapper.unmount();
  });

  it('should use JiraLogo component', () => {
    const node = confluenceJiraIssue({ issueKey: 'test' })()(defaultSchema);
    const wrapper = mount(<ReactJIRAIssueNode node={node} />);
    expect(wrapper.find(JiraIcon).length).toBe(1);
    wrapper.unmount();
  });
});
