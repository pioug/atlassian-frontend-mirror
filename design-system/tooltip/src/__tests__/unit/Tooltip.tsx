import React, { forwardRef } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Tooltip from '../../Tooltip';
import { TooltipPrimitiveProps } from '../../TooltipPrimitive';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should not be shown by default', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, unmount } = render(jsx);
      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should get tooltip that uses wrapped approach by role', () => {
    const { getByRole } = render(
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );
    expect(getByRole('presentation')).not.toBeNull();
  });

  it('should be visible when trigger is hovered', () => {
    const onShow = jest.fn();
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" onShow={onShow}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" onShow={onShow}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');
      expect(onShow).toHaveBeenCalledTimes(1);
      onShow.mockClear();
      unmount();
    });
  });

  it('should abort showing if there is a mouseout while waiting for the delay', () => {
    const onShow = jest.fn();
    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        onShow={onShow}
        delay={300}
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        onShow={onShow}
        delay={300}
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Trigger showing tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runTimersToTime(299);
      });
      expect(queryByTestId('tooltip')).toBeNull();
      expect(onShow).not.toHaveBeenCalled();

      // hide the tooltip
      fireEvent.mouseOut(trigger);

      // Now we can flush the delay and still the tooltip won't show
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      expect(onShow).not.toHaveBeenCalled();
      onShow.mockClear();
      unmount();
    });
  });

  it('should be hidden when trigger is unhovered', () => {
    const onHide = jest.fn();
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" onHide={onHide}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" onHide={onHide}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Trigger showing tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // Trigger hiding tooltip
      fireEvent.mouseOut(trigger);
      // flush delay
      act(() => {
        jest.runOnlyPendingTimers();
      });
      // flush motion
      act(() => {
        jest.runOnlyPendingTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      expect(onHide).toHaveBeenCalledTimes(1);
      onHide.mockClear();
      unmount();
    });
  });

  it('should abort hiding if there is a mouseover while waiting for the delay to hide', () => {
    const onHide = jest.fn();

    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        onHide={onHide}
        delay={300}
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        onHide={onHide}
        delay={300}
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      // This mockClear has to run first because onHide will run on unmount
      onHide.mockClear();

      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Trigger showing tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // Trigger hiding tooltip
      fireEvent.mouseOut(trigger);
      // don't quite finish delay
      act(() => {
        jest.runTimersToTime(299);
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // Going back over the tooltip
      fireEvent.mouseOver(trigger);
      // Flushing any pending delays
      act(() => {
        jest.runAllTimers();
      });
      // Being safe and flushing motion if there was one
      act(() => {
        jest.runAllTimers();
      });
      // Tooltip is still around being awesome
      expect(queryByTestId('tooltip')).toBeTruthy();
      expect(onHide).toHaveBeenCalledTimes(0);
      unmount();
    });
  });

  it('should abort hiding if there is a mouseover while animating out', () => {
    const onHide = jest.fn();
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" onHide={onHide}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" onHide={onHide}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      // This mockClear has to run first because onHide will run on unmount
      onHide.mockClear();
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Trigger showing tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // Trigger hiding tooltip
      fireEvent.mouseOut(trigger);
      // flush delay
      act(() => {
        jest.runOnlyPendingTimers();
      });
      // go partially through the motion
      act(() => {
        jest.runTimersToTime(1);
      });
      // tooltip is visible but fading out
      expect(queryByTestId('tooltip')).toBeTruthy();
      // on hide not called yet
      expect(onHide).toHaveBeenCalledTimes(0);

      // mouseover the trigger again
      fireEvent.mouseOver(trigger);
      // this would normally trigger the tooltip to hide
      act(() => {
        jest.runAllTimers();
      });

      // But the tooltip is back and being awesome
      expect(queryByTestId('tooltip')).toBeTruthy();
      expect(onHide).toHaveBeenCalledTimes(0);
      unmount();
    });
  });

  it('should show the tooltip when the trigger is focused', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.focus(trigger);
      act(() => {
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');
      unmount();
    });
  });

  it('should hide the tooltip when the trigger loses focus', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, rerender, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.focus(trigger);
      act(() => {
        jest.runAllTimers();
      });

      fireEvent.blur(trigger);
      act(() => {
        jest.runAllTimers();
      });

      rerender(jsx);

      // Waits for exit animation to finish
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should be visible after trigger is clicked', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.mouseOver(trigger);
      fireEvent.click(trigger);
      act(() => {
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');
      unmount();
    });
  });

  it('should be hidden after trigger click with hideTooltipOnClick set', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnClick>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnClick>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');

      fireEvent.click(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should be hidden after trigger click with hideTooltipOnMouseDown set', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');

      fireEvent.mouseDown(trigger);
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should be hidden after Escape pressed', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" hideTooltipOnMouseDown>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').textContent).toEqual('hello world');

      act(() => {
        fireEvent.keyDown(trigger, { key: 'Escape' });
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should render whatever is passed to component prop', () => {
    const CustomTooltip = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
      ({ style, testId }, ref) => (
        <strong ref={ref} style={style} data-testid={testId}>
          Im a custom tooltip
        </strong>
      ),
    );
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" component={CustomTooltip}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" component={CustomTooltip}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      const tooltip = getByTestId('tooltip');
      expect(tooltip.textContent).toEqual('Im a custom tooltip');
      expect(tooltip.tagName).toEqual('STRONG');
      unmount();
    });
  });

  it('should render a wrapping div element by default when using the wrapped approach', () => {
    const { getByTestId } = render(
      <Tooltip testId="tooltip" content="hello world">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    expect(trigger.parentElement!.tagName).toEqual('DIV');
  });

  it('should render a wrapping span element is supplied by the tag prop when using the wrapped approach', () => {
    const { getByTestId } = render(
      <Tooltip testId="tooltip" content="hello world" tag="span">
        <button data-testid="trigger">focus me</button>
      </Tooltip>,
    );

    const trigger = getByTestId('trigger');

    expect(trigger.parentElement!.tagName).toEqual('SPAN');
  });

  it('should wait a default delay before showing', () => {
    const onShow = jest.fn();
    const wrapped = (
      <Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={300}>
        <button data-testid="trigger">click me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={300}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            click me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Start showing
      fireEvent.mouseOver(trigger);

      // Delay not completed yet
      act(() => {
        jest.runTimersToTime(299);
      });
      expect(onShow).toHaveBeenCalledTimes(0);
      // Delay completed
      act(() => {
        jest.runTimersToTime(1);
      });

      expect(onShow).toHaveBeenCalledTimes(1);
      expect(queryByTestId('tooltip')).not.toBeNull();
      onShow.mockClear();
      unmount();
    });
  });

  it('should wait a configurable delay before showing', () => {
    const onShow = jest.fn();
    const wrapped = (
      <Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={1000}>
        <button data-testid="trigger">click me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Tooltip" onShow={onShow} delay={1000}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            click me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      fireEvent.mouseOver(trigger);

      act(() => {
        jest.runTimersToTime(999);
      });
      expect(onShow).toHaveBeenCalledTimes(0);
      expect(queryByTestId('tooltip')).toBeNull();

      act(() => {
        jest.runTimersToTime(1);
      });
      expect(onShow).toHaveBeenCalledTimes(1);
      expect(queryByTestId('tooltip')).not.toBeNull();
      unmount();
      onShow.mockClear();
    });
  });

  it('should wait a default delay before hiding', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="Tooltip">
        <button data-testid="trigger">click me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Tooltip">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            click me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Show tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).not.toBeNull();

      // start hiding
      fireEvent.mouseOut(trigger);
      act(() => {
        jest.runTimersToTime(299);
      });
      // haven't waited long enough
      expect(queryByTestId('tooltip')).not.toBeNull();

      // finish delay
      act(() => {
        jest.runTimersToTime(1);
      });

      // Still present because we haven't flushed motion
      expect(queryByTestId('tooltip')).not.toBeNull();

      // Flushing motion
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should wait a configurable delay before hiding', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="Tooltip" delay={1000}>
        <button data-testid="trigger">click me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Tooltip" delay={1000}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            click me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, queryByTestId, rerender, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).not.toBeNull();

      act(() => {
        fireEvent.mouseOut(trigger);
        jest.runTimersToTime(999);
      });

      rerender(jsx);

      expect(queryByTestId('tooltip')).not.toBeNull();

      act(() => {
        jest.runTimersToTime(1);
      });

      rerender(jsx);

      // Waits for exit animation to finish
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should not show when content is null', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content={null}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content={null}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should not show when content is undefined', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content={undefined}>
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content={undefined}>
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should not show when content is an empty string', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(queryByTestId('tooltip')).toBeNull();
      unmount();
    });
  });

  it('should position tooltip to the left of the mouse', () => {
    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
        'left',
      );
      unmount();
    });
  });

  it('should position tooltip to the bottom of trigger when interacting with keyboard and position is mouse', () => {
    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="right"
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="right"
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.focus(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
        'right',
      );
      unmount();
    });
  });

  it('should position tooltip to the top of trigger when interacting with keyboard', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="hello world" position="left">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="hello world" position="left">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.focus(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip').getAttribute('data-placement')).toEqual(
        'left',
      );
      unmount();
    });
  });

  it('should stay visible when hover tooltip', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="Tooltip">
        <button data-testid="trigger">click me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Tooltip">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            click me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // Trigger showing tooltip
      fireEvent.mouseOver(trigger);
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // Trigger hiding tooltip
      fireEvent.mouseOut(trigger);
      // flush delay
      act(() => {
        jest.runOnlyPendingTimers();
      });
      // flush motion
      act(() => {
        fireEvent.mouseOver(queryByTestId('tooltip')!);
        jest.runOnlyPendingTimers();
      });

      expect(queryByTestId('tooltip')).not.toBeNull();
      unmount();
    });
  });

  it('should send analytics event when tooltip becomes visible', () => {
    const onAnalyticsEvent = jest.fn();
    const wrapped = (
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Tooltip content="Tooltip content">
          <p data-testid="trigger">Foo</p>
        </Tooltip>
      </AnalyticsListener>
    );
    const renderProp = (
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Tooltip content="Tooltip content">
          {(tooltipProps) => (
            <p {...tooltipProps} data-testid="trigger">
              Foo
            </p>
          )}
        </Tooltip>
      </AnalyticsListener>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, rerender, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      rerender(jsx);

      expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: 'displayed',
            actionSubject: 'tooltip',
            attributes: {
              componentName: 'tooltip',
              packageName,
              packageVersion,
            },
          },
        }),
        'atlaskit',
      );
      unmount();
      onAnalyticsEvent.mockClear();
    });
  });

  it('should send analytics event when tooltip is hidden', () => {
    const onAnalyticsEvent = jest.fn();
    const wrapped = (
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Tooltip content="Tooltip content" testId="tooltip">
          <p data-testid="trigger">Foo</p>
        </Tooltip>
      </AnalyticsListener>
    );
    const renderProp = (
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Tooltip content="Tooltip content" testId="tooltip">
          {(tooltipProps) => (
            <p {...tooltipProps} data-testid="trigger">
              Foo
            </p>
          )}
        </Tooltip>
      </AnalyticsListener>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { queryByTestId, getByTestId, rerender, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      // show tooltip
      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });
      expect(queryByTestId('tooltip')).toBeTruthy();

      // hide tooltip
      fireEvent.mouseOut(trigger);
      // flush delay
      act(() => {
        jest.runOnlyPendingTimers();
      });
      // flush motion
      act(() => {
        jest.runOnlyPendingTimers();
      });

      rerender(jsx);

      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            action: 'hidden',
            actionSubject: 'tooltip',
            attributes: {
              componentName: 'tooltip',
              packageName,
              packageVersion,
            },
          },
        }),
        'atlaskit',
      );
      unmount();
      onAnalyticsEvent.mockClear();
    });
  });

  it('should have strategy as fixed by default', () => {
    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip--wrapper').getAttribute('style')).toEqual(
        'position: fixed; left: 0px; top: 0px;',
      );
      unmount();
    });
  });

  it('should have strategy as absolute for popper', () => {
    const wrapped = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
        strategy="absolute"
      >
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip
        testId="tooltip"
        content="hello world"
        position="mouse"
        mousePosition="left"
        strategy="absolute"
      >
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      expect(getByTestId('tooltip--wrapper').getAttribute('style')).toEqual(
        'position: absolute; left: 0px; top: 0px;',
      );
      unmount();
    });
  });

  it('should link correct aria-describedby attribute to the trigger and correct id to the tooltip', () => {
    const wrapped = (
      <Tooltip testId="tooltip" content="Save">
        <button data-testid="trigger">focus me</button>
      </Tooltip>
    );
    const renderProp = (
      <Tooltip testId="tooltip" content="Save">
        {(tooltipProps) => (
          <button {...tooltipProps} data-testid="trigger">
            focus me
          </button>
        )}
      </Tooltip>
    );

    [wrapped, renderProp].forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const trigger = getByTestId('trigger');

      act(() => {
        fireEvent.mouseOver(trigger);
        jest.runAllTimers();
      });

      const triggerDescriptionId = trigger.getAttribute('aria-describedby');
      const tooltipId = getByTestId('tooltip').getAttribute('id');

      expect(triggerDescriptionId).toEqual(tooltipId);
      unmount();
    });
  });
});
