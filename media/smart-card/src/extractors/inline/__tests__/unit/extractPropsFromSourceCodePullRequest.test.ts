import {
  extractInlineViewPropsFromSourceCodePullRequest,
  pullRequestStateToLozengeMap,
  PullRequestState,
} from '../../extractPropsFromSourceCodePullRequest';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromSourceCodePullRequest', () => {
  it('should set the icon to the appropriate default icon', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      '@type': 'atlassian:SourceCodePullRequest',
      name: 'title yeee',
    });
    expect(props).toHaveProperty('title', 'title yeee');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('title yeee');
  });

  it('should set the lozenge to the appropriate default lozenge', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      '@type': 'atlassian:SourceCodePullRequest',
      name: 'title yeee',
      'atlassian:state': 'labelerrino',
    });
    expect(props).toHaveProperty('lozenge', {
      text: 'labelerrino',
      appearance: 'default',
    });
  });

  for (const lozenge of Object.keys(pullRequestStateToLozengeMap)) {
    it(`should set the lozenge to a lozenge mapping for [${lozenge}]`, () => {
      const props = extractInlineViewPropsFromSourceCodePullRequest({
        '@type': 'atlassian:SourceCodePullRequest',
        name: 'title yeee',
        'atlassian:state': lozenge.toUpperCase(),
      });
      expect(props).toHaveProperty('lozenge', {
        text: lozenge.toLowerCase(),
        appearance: pullRequestStateToLozengeMap[lozenge as PullRequestState],
      });
    });
  }

  it('should just set the name properly (with no other information)', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      '@type': 'atlassian:SourceCodePullRequest',
      url: 'https://bitbucket.org/atlassian/my-repo/pull-requests/190',
      name: 'some pr',
    });
    expect(props).toHaveProperty('title', 'some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });

  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      '@type': 'atlassian:SourceCodePullRequest',
      url: 'https://bitbucket.org/atlassian/my-repo/pull-requests/190',
      name: 'some pr',
      'atlassian:internalId': 190,
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'my-repo',
      },
    });
    expect(props).toHaveProperty('title', 'my-repo: #190 some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });

  it('should set the name with only repo name (no internal id)', () => {
    const props = extractInlineViewPropsFromSourceCodePullRequest({
      '@type': 'atlassian:SourceCodePullRequest',
      url: 'https://bitbucket.org/atlassian/my-repo/pull-requests/190',
      name: 'some pr',
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'my-repo',
      },
    });
    expect(props).toHaveProperty('title', 'my-repo: some pr');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some pr');
  });
});
