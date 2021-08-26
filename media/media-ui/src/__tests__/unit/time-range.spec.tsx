import React from 'react';
import { shallow } from 'enzyme';
import { TimeRange, TimeRangeProps } from '../../customMediaPlayer/timeRange';
import {
  CurrentTimeLine,
  BufferedTime,
  CurrentTimeTooltip,
  Thumb,
  TimeRangeWrapper,
} from '../../customMediaPlayer/styled';

describe('<TimeRange />', () => {
  const setup = (props?: Partial<TimeRangeProps>) => {
    const onChange = jest.fn();
    const onChanged = jest.fn();
    const component = shallow(
      <TimeRange
        currentTime={10}
        duration={20}
        bufferedTime={5}
        onChange={onChange}
        onChanged={onChanged}
        {...props}
      />,
    );

    return {
      component,
      onChange,
      onChanged,
    };
  };

  it('should render the current time', () => {
    const { component } = setup();

    expect(component.find(CurrentTimeLine).prop('style')).toEqual({
      width: `50%`,
    });
  });

  it('should render the buffered time', () => {
    const { component } = setup();

    expect(component.find(BufferedTime).prop('style')).toEqual({
      width: `25%`,
    });
  });

  it('should render the thumb element', () => {
    const { component } = setup();

    expect(component.find(Thumb)).toHaveLength(1);
  });

  it('should render the current time with the right format', () => {
    const { component } = setup();

    expect(component.find(CurrentTimeTooltip).dive().text()).toEqual('0:10');
  });

  it('should notify changes when user clicks on the timeline', () => {
    const { component, onChange, onChanged } = setup();

    (component as any).instance()['wrapperElementWidth'] = 100;
    component.find(TimeRangeWrapper).simulate('mouseDown', {
      target: {},
      nativeEvent: {
        offsetX: 5,
      },
      preventDefault: () => {},
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).lastCalledWith(1);

    const mouseMove = new Event('mousemove');
    const mouseUp = new Event('mouseup');
    window.document.dispatchEvent(mouseMove);
    window.document.dispatchEvent(mouseUp);

    expect(onChanged).toHaveBeenCalledTimes(1);
  });

  it('should not display tooltip on top of thumb when flag disableThumbTooltip is set', () => {
    const { component } = setup({
      disableThumbTooltip: true,
    });

    expect(component.find(CurrentTimeTooltip)).toHaveLength(0);
  });
});
