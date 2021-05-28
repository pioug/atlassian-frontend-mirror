import { shallow } from 'enzyme';
import React from 'react';
import {
  getComponentClassWithStore,
  mockState,
  mockStore,
} from '@atlaskit/media-test-helpers';
import DropboxIcon from '@atlaskit/icon/glyph/dropbox';
import GoogleDriveIcon from '@atlaskit/icon/glyph/googledrive';
import { StatelessSidebar, default as ConnectedSidebar } from '../../sidebar';

const ConnectedSidebarWithStore = getComponentClassWithStore(ConnectedSidebar);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = shallow(<ConnectedSidebarWithStore store={store} />).find(
    StatelessSidebar,
  );
  return { component, dispatch };
};

describe('<Sidebar />', () => {
  it('should deliver all required props to stateless component', () => {
    const { component } = createConnectedComponent();
    const props = component.props();
    expect(props.selected).toEqual(mockState.view.service.name);
  });

  describe('#render()', () => {
    it('should not render built-in plugins when useForgePlugins=true', () => {
      const element = shallow(<StatelessSidebar useForgePlugins selected="" />);
      expect(element.find(DropboxIcon)).toHaveLength(0);
      expect(element.find(GoogleDriveIcon)).toHaveLength(0);
    });
  });
});
