import React, { MouseEvent } from 'react';
import { mount } from 'enzyme';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  AnalyticsListener,
  UIAnalyticsEvent,
} from '../..';

interface Props extends WithAnalyticsEventsProps {
  onClick?: (
    e: MouseEvent<HTMLButtonElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: Props) => (
  <button onClick={onClick}>{children}</button>
);

it('should create and fire analytics event', () => {
  const onEvent = jest.fn();
  const createAndFireOnAtlaskit = createAndFireEvent('atlaskit');

  const ButtonWithAnalytics = withAnalyticsEvents({
    onClick: createAndFireOnAtlaskit({ action: 'click' }),
  })(Button);

  const AppButton = () => (
    <ButtonWithAnalytics
      onClick={(
        e: MouseEvent<HTMLButtonElement>,
        analyticsEvent?: UIAnalyticsEvent,
      ) => analyticsEvent!.fire()}
    >
      Save
    </ButtonWithAnalytics>
  );

  mount(
    <AnalyticsListener onEvent={onEvent}>
      <div>
        <AnalyticsListener channel="atlaskit" onEvent={onEvent}>
          <AppButton />
        </AnalyticsListener>
        ,
      </div>
    </AnalyticsListener>,
  )
    .find(Button)
    .simulate('click');
  expect(onEvent).toHaveBeenCalledTimes(2);
});
