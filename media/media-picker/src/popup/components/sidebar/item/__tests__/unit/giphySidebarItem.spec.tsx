import { shallow } from 'enzyme';
import React from 'react';
import { changeService, searchGiphy } from '../../../../../actions';
import {
  mockStore,
  getComponentClassWithStore,
} from '@atlaskit/media-test-helpers';

import { StatelessSidebarItem } from '../../sidebarItem';
import {
  StatelessGiphySidebarItem,
  default as ConnectedGiphySidebarItem,
} from '../../giphySidebarItem';
import { GiphyIcon } from '../../../icons';

const ConnectedSidebarItemStoreWithStore = getComponentClassWithStore(
  ConnectedGiphySidebarItem,
);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = shallow(
    <ConnectedSidebarItemStoreWithStore store={store} isActive={false} />,
  ).find(StatelessGiphySidebarItem);
  return { dispatch, component };
};

describe('Connected GiphySidebarItem component', () => {
  it('should dispatch an action when onChangeService is called', () => {
    const { component, dispatch } = createConnectedComponent();
    component.props().onChangeService();

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toBeCalledWith(changeService('giphy'));
    expect(dispatch).toBeCalledWith(searchGiphy('', false));
  });
});

describe('StatelessGiphySidebarItem component', () => {
  it('should call onChangeService cb when StatelessSidebarItem fires onChangeService callback', () => {
    const onChangeServiceStub = jest.fn();
    const component = shallow(
      <StatelessGiphySidebarItem
        isActive={false}
        onChangeService={onChangeServiceStub}
      />,
    );

    component.simulate('changeService');
    expect(onChangeServiceStub).toHaveBeenCalledTimes(1);
  });

  describe('#render()', () => {
    it('should render StatelessSidebarItem and GiphyIcon', () => {
      const element = shallow(
        <StatelessGiphySidebarItem
          isActive={true}
          onChangeService={jest.fn()}
        />,
      );

      expect(element.find(StatelessSidebarItem)).toHaveLength(1);
      expect(element.find(GiphyIcon)).toHaveLength(1);
    });

    it('should pass isActive and onChangeService prop through to ServiceName component', () => {
      const onChangeServiceStub = jest.fn();

      const element = shallow(
        <StatelessGiphySidebarItem
          isActive={true}
          onChangeService={onChangeServiceStub}
        />,
      );

      expect(element.find(StatelessSidebarItem).props().isActive).toBe(true);
      expect(element.find(StatelessSidebarItem).props().onChangeService).toBe(
        onChangeServiceStub,
      );
    });
  });
});
