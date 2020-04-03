import { extractInlineViewPropsFromSourceCodeCommit } from '../../extractPropsFromSourceCodeCommit';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromSourceCodeCommit', () => {
  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodeCommit({
      '@type': 'atlassian:SourceCodeCommit',
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
      '@id': 'sha1:baadf00d',
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'my-repo',
      },
    });
    expect(props).toHaveProperty('title', 'my-repo: baadf00d some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });

  it('should set the name with only repo name (no internal id)', () => {
    const props = extractInlineViewPropsFromSourceCodeCommit({
      '@type': 'atlassian:SourceCodeCommit',
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'some commit',
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'my-repo',
      },
    });
    expect(props).toHaveProperty('title', 'my-repo: some commit');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('some commit');
  });
});
