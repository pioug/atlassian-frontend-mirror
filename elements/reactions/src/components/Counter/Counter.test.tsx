import React from 'react';
import { act, screen } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import { constants } from '../../shared';
import {
  Counter,
  RENDER_COUNTER_TESTID,
  CounterProps,
  RENDER_COMPONENT_WRAPPER,
  RENDER_LABEL_TESTID,
} from './Counter';
import * as styles from './styles';

expect.extend(matchers);

const renderCounter = (props: CounterProps) => {
  return renderWithIntl(<Counter {...props} />);
};

describe('@atlaskit/reactions/components/Counter', () => {
  mockReactDomWarningGlobal();
  useFakeTimers();

  it('should render counter', async () => {
    const value = 10;
    renderCounter({ value });
    const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
    expect(labelWrapper).toBeInTheDocument();
    expect(labelWrapper.textContent).toEqual(value.toString());
  });

  it('should render over limit label', async () => {
    const value = 1000;
    renderCounter({ value });
    const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
    expect(labelWrapper).toBeInTheDocument();
    expect(labelWrapper.textContent).toEqual(
      constants.DEFAULT_OVER_THE_LIMIT_REACTION_LABEL,
    );
  });

  it('should render using custom limit and label', async () => {
    const value = 10;
    const limit = 10;
    const overLimitLabel = '9+';
    renderCounter({
      value,
      limit,
      overLimitLabel,
    });
    const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
    expect(labelWrapper).toBeInTheDocument();
    expect(labelWrapper.textContent).toEqual(overLimitLabel);
  });

  it('should add highlight class', async () => {
    const value = 10;
    const highlight = true;
    renderCounter({ value, highlight });
    const labelWrapper = await screen.findByTestId(RENDER_LABEL_TESTID);
    expect(labelWrapper).toBeInTheDocument();
    expect(labelWrapper.className.endsWith(styles.highlightStyle.name)).toBe(
      true,
    );
  });

  it('should set width to avoid resizing', async () => {
    renderWithIntl(<Counter value={11} />);

    const wrapperDiv = await screen.findByTestId(RENDER_COMPONENT_WRAPPER);
    expect(wrapperDiv).toHaveStyleRule('width', '14px');
  });

  describe('should animate number', () => {
    const animationDuration = 300;

    it('new entering ', async () => {
      const { rerender } = renderCounter({
        value: 5,
        animationDuration,
      });

      const animatedContainer = await screen.findByTestId(
        RENDER_COUNTER_TESTID,
      );
      expect(animatedContainer).toBeInTheDocument();

      rerender(<Counter value={6} animationDuration={animationDuration} />);

      // in the middle of animation
      act(() => {
        jest.runTimersToTime(animationDuration * 2);
      });

      expect(animatedContainer).toHaveStyle('animation-duration: 150ms');
      expect(animatedContainer).toHaveStyle('position: absolute');
    });

    it('value decreases', async () => {
      const { rerender } = renderCounter({
        value: 5,
        animationDuration,
      });

      const animatedContainer = await screen.findByTestId(
        RENDER_COUNTER_TESTID,
      );
      expect(animatedContainer).toBeInTheDocument();

      rerender(<Counter value={4} animationDuration={animationDuration} />);

      // in the middle of animation
      act(() => {
        jest.runTimersToTime(animationDuration * 2);
      });

      expect(animatedContainer).toHaveStyle('animation-duration: 150ms');
      expect(animatedContainer).toHaveStyle('position: absolute');
    });
  });
});
