import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { name } from '../../../../version.json';
import Navigator from '../../../../components/Navigators/Navigator';

const createAnalyticsEventMock = jest.fn();

function NavigatorWithAnalytics(props: any) {
  return (
    <Navigator createAnalyticsEvent={createAnalyticsEventMock} {...props} />
  );
}

describe(`${name} - navigator`, () => {
  it('should render the node passed as children', () => {
    const wrapper = mount(
      <NavigatorWithAnalytics createAnalyticsEvent={createAnalyticsEventMock}>
        <div>$</div>
      </NavigatorWithAnalytics>,
    );
    expect(wrapper.text()).toBe('$');
  });

  it('should pass in aria-label to button', () => {
    const wrapper = mount(<NavigatorWithAnalytics aria-label="pehla" />);
    expect(wrapper.find(Button).prop('aria-label')).toBe('pehla');
  });
  it('should pass in isDisabled as aria-label to button', () => {
    const wrapper = mount(<NavigatorWithAnalytics isDisabled />);
    expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
  });
  it('should call the provided onClick function with the aria-label value', () => {
    const onClickSpy = jest.fn();
    const wrapper = mount(
      <NavigatorWithAnalytics onClick={onClickSpy} aria-label="label" />,
    );
    wrapper.simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
});
