import React from 'react';
import { shallow } from 'enzyme';
import AkButton from '@atlaskit/button/custom-theme-button';

import { startAuth } from '../../../../../../actions';
import { ServiceAccountLink } from '../../../../../../domain';
import { mockState, mockStore } from '@atlaskit/media-test-helpers';
import { StatelessAuth, default as ConnectedAuth } from '../../auth';

import { getComponentClassWithStore } from '@atlaskit/media-test-helpers';

const ConnectedAuthWithStore = getComponentClassWithStore(ConnectedAuth);

const createConnectedComponent = () => {
  const store = mockStore();
  const dispatch = store.dispatch;
  const component = shallow(<ConnectedAuthWithStore store={store} />).find(
    StatelessAuth,
  );
  return { component, dispatch };
};

describe('<StatelessAuth />', () => {
  it('should call onStartAuth when button is clicked', () => {
    const onStartAuthStub = jest.fn();
    const service: ServiceAccountLink = {
      accountId: 'some-account-id',
      name: 'google',
    };
    const component = shallow(
      <StatelessAuth service={service} onStartAuth={onStartAuthStub} />,
    );
    component.find(AkButton).simulate('click');
    expect(onStartAuthStub).toHaveBeenCalledWith('google');
  });
});

describe('<Auth />', () => {
  it('should deliver all required props to stateless component', () => {
    const { component } = createConnectedComponent();
    const props = component.props();
    // component.find(AkButton).simulate('click');

    expect(props.service).toEqual(mockState.view.service);
  });

  it('should call startAuth action when onStartAuth called', () => {
    const { component, dispatch } = createConnectedComponent();
    const props = component.props();
    props.onStartAuth('google');
    expect(dispatch).toBeCalledWith(startAuth('google'));
  });
});
