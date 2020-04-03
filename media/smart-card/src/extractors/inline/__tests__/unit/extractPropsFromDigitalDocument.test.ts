import { extractInlineViewPropsFromDigitalDocument } from '../../extractPropsFromDigitalDocument';
import { ReactElement } from 'react';
import { shallow } from 'enzyme';

describe('extractInlineViewPropsFromDigitalDocument', () => {
  it('should set the icon to the appropriate default icon', () => {
    const props = extractInlineViewPropsFromDigitalDocument({
      name: 'title yeee',
    });
    expect(props).toHaveProperty('title', 'title yeee');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    expect(iconRendered.prop('label')).toEqual('title yeee');
  });

  it('should set the icon to the appropriate mime type icon', () => {
    const props = extractInlineViewPropsFromDigitalDocument({
      name: 'title yeee',
      fileFormat: 'text/plain',
    });
    expect(props).toHaveProperty('title', 'title yeee');
    expect(props).toHaveProperty('icon');

    const icon = props.icon as ReactElement<any>;
    const iconRendered = shallow(icon);
    // Since we are delegating to React Loadable to import a
    // relevant icon component, we expect the top wrapper
    // to still be loading.
    // This indicates the component is being 'fetched'.
    expect(iconRendered.prop('isLoading')).toEqual(true);
  });
});
