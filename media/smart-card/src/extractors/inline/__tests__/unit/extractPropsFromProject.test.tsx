import { shallow } from 'enzyme';
import { ReactElement } from 'react';

import { extractInlineViewPropsFromProject } from '../../extractPropsFromProject';

describe('extractInlineViewPropsFromProject', () => {
  it('should return default icon when a generator is not specified', () => {
    const props = extractInlineViewPropsFromProject({});
    expect(props).toHaveProperty('title', '');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('Project');
  });

  it('should return an icon when an appropriate generator is provided', () => {
    const props = extractInlineViewPropsFromProject({
      icon: { url: 'https://some/icon/url' },
      generator: { '@id': 'https://www.atlassian.com/#Confluence' },
    });
    expect(props).toHaveProperty('title');
    expect(props).toHaveProperty('icon', 'https://some/icon/url');
  });
});
