import React from 'react';
import { shallow } from 'enzyme';
import { InactivityDetector, WithShowControlMethodProp } from '../..';
import { asMock } from '@atlaskit/media-test-helpers';
import { InactivityDetectorWrapper } from '../../inactivityDetector/styled';

class DummyChild extends React.Component<WithShowControlMethodProp> {
  render() {
    return null;
  }
}

describe('InactivityDetector', () => {
  const setup = () => {
    const component = shallow(
      <InactivityDetector>
        {(triggerActivityCallback) => (
          <DummyChild showControls={triggerActivityCallback} />
        )}
      </InactivityDetector>,
    );

    return {
      component,
    };
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render children', () => {
    const { component } = setup();
    expect(component.find(DummyChild)).toBeDefined();
  });

  it('should provide triggerActivityCallback as render function argument', () => {
    const { component } = setup();
    expect(component.find(DummyChild).props().showControls).toBeDefined();
  });

  it('should give moseMovement resetting function as part of showControlsRegister call', () => {
    const { component } = setup();
    const activityActivationFunction = component.find(DummyChild).props()
      .showControls;

    // Controls are visible in the beginning
    expect(component.state('controlsAreVisible')).toBeTruthy();
    // User waits
    jest.runOnlyPendingTimers();
    // Controls should disappear now.
    expect(component.state('controlsAreVisible')).toBeFalsy();
    // One of the child components calls given function
    activityActivationFunction!();
    // Controls should be visible again
    expect(component.state('controlsAreVisible')).toBeTruthy();
  });

  it('should handle mouse move', () => {
    const { component } = setup();

    expect(component.state('controlsAreVisible')).toBeTruthy();
    component.find(InactivityDetectorWrapper).simulate('mouseMove');
    jest.runOnlyPendingTimers();
    expect(component.state('controlsAreVisible')).toBeFalsy();
  });

  it('should handle mouse out', () => {
    const { component } = setup();

    expect(component.state('controlsAreVisible')).toBeTruthy();
    component.find(InactivityDetectorWrapper).simulate('mouseOut');
    jest.runOnlyPendingTimers();
    expect(component.state('controlsAreVisible')).toBeFalsy();
  });

  it('should keep controls visible when user is hovering them', () => {
    const { component } = setup();
    const elementWithControls = document.createElement('div');

    elementWithControls.classList.add('mvng-hide-controls');
    component.find(InactivityDetectorWrapper).simulate('mouseMove', {
      target: elementWithControls,
    });
    jest.runOnlyPendingTimers();
    expect(component.state('controlsAreVisible')).toBeTruthy();
  });

  it('should start with controls visible', () => {
    const { component } = setup();

    expect(
      component.find(InactivityDetectorWrapper).prop('controlsAreVisible'),
    ).toBeTruthy();
  });

  it('should clear the timeout when component gets unmounted', () => {
    const { component } = setup();
    const callsNumber = asMock(clearTimeout).mock.calls.length;
    jest.runOnlyPendingTimers();
    component.unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(callsNumber + 1);
  });
});
