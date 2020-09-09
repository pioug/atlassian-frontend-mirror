import { shallow } from 'enzyme';
import React from 'react';
import { ServiceIcon, Wrapper, ServiceName } from '../../styled';
import { changeService } from '../../../../../actions';
import {
  mockStore,
  getComponentClassWithStore,
} from '@atlaskit/media-test-helpers';
import {
  StatelessSidebarItem,
  default as ConnectedSidebarItem,
} from '../../sidebarItem';

const ConnectedSidebarItemStoreWithStore = getComponentClassWithStore(
  ConnectedSidebarItem,
);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = shallow(
    <ConnectedSidebarItemStoreWithStore
      store={store}
      serviceName="google"
      serviceFullName="Google"
      isActive={false}
    />,
  ).find(StatelessSidebarItem);
  return { dispatch, component };
};

describe('Connected SidebarItem component', () => {
  it('should dispatch an action when onChangeService is called', () => {
    const { component, dispatch } = createConnectedComponent();
    component.props().onChangeService('google');
    expect(dispatch).toBeCalledWith(changeService('google'));
  });
});

describe('StatelessSidebarItem component', () => {
  it('should call onChangeService cb when item is clicked', () => {
    const onChangeServiceStub = jest.fn();
    const component = shallow(
      <StatelessSidebarItem
        serviceName="google"
        serviceFullName="Mighty Google"
        isActive={false}
        onChangeService={onChangeServiceStub}
      />,
    );
    component.simulate('click');
    expect(onChangeServiceStub).toBeCalledWith('google');
  });

  describe('#render()', () => {
    it('should render ServiceIcon, ServiceName and props.children', () => {
      const element = shallow(
        <StatelessSidebarItem
          serviceName="dropbox"
          serviceFullName="Dropbox"
          isActive={true}
          onChangeService={jest.fn()}
        >
          <div id="childrenyo" />
        </StatelessSidebarItem>,
      );

      expect(element.find(ServiceIcon)).toHaveLength(1);
      expect(element.find(ServiceName)).toHaveLength(1);
      expect(element.find(ServiceIcon).childAt(0)).toHaveLength(1);
    });

    it('should pass isActive prop through to ServiceName component', () => {
      const element = shallow(
        <StatelessSidebarItem
          serviceName="upload"
          serviceFullName="Upload"
          isActive={true}
          onChangeService={jest.fn()}
        />,
      );

      expect(element.find(Wrapper).first().prop('isActive')).toBe(true);
    });
  });
});
