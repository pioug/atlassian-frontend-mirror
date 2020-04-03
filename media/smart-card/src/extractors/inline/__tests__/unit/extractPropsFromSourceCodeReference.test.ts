import { extractInlineViewPropsFromSourceCodeReference } from '../../extractPropsFromSourceCodeReference';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromSourceCodeReference', () => {
  it('should set the name with both repo name and internal id', () => {
    const props = extractInlineViewPropsFromSourceCodeReference({
      '@type': 'atlassian:SourceCodeReference',
      url: 'https://bitbucket.org/atlassian/pull-requests/190',
      name: 'my-branch',
      context: {
        '@type': 'atlassian:SourceCodeRepository',
        name: 'my-repo',
      },
    });
    expect(props).toHaveProperty('title', 'my-repo/my-branch');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('my-branch');
  });
});
