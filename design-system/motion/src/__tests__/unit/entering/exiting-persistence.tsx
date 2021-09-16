/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { useEffect } from 'react';

import { act, render } from '@testing-library/react';

import ExitingPersistence, {
  useExitingPersistence,
} from '../../../entering/exiting-persistence';
import KeyframesMotion from '../../../entering/keyframes-motion';
import { isReducedMotion } from '../../../utils/accessibility';

jest.mock('../../../utils/accessibility');

const Motion = (props: { id: string; color?: string; onRender?: Function }) => {
  const exiting = useExitingPersistence();
  useEffect(() => {
    props.onRender && props.onRender();

    const id = setTimeout(
      () => exiting.isExiting && exiting.onFinish && exiting.onFinish(),
      100,
    );

    return () => {
      clearTimeout(id);
    };
  });
  return (
    <div data-testid={props.id} data-color={props.color}>
      hello, world
    </div>
  );
};

describe('<ExitingPersistence />', () => {
  beforeEach(() => {
    jest.useRealTimers();
    (isReducedMotion as jest.Mock).mockReturnValue(false);
  });

  it('should not persist if reduced motion is preferred', () => {
    (isReducedMotion as jest.Mock).mockReturnValue(true);
    const { baseElement, rerender } = render(
      <ExitingPersistence>
        <Motion id="element" />
      </ExitingPersistence>,
    );

    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    expect(baseElement.querySelector('[data-testid=element]')).toEqual(null);
  });

  it('should persist a single child when being removed', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <Motion id="element" />
      </ExitingPersistence>,
    );

    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    expect(getByTestId('element')).toBeDefined();
  });

  it('should remove the child once the exit motion is finished', () => {
    jest.useFakeTimers();
    const { baseElement, rerender } = render(
      <ExitingPersistence>
        <div>
          <Motion id="element" />
        </div>
      </ExitingPersistence>,
    );
    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    act(() => jest.runAllTimers());

    expect(baseElement.querySelector('[data-testid=element]')).toEqual(null);
  });

  it('should persist a removed child inside a list', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    expect(getByTestId('element2')).toBeDefined();
  });

  it('should remove the child inside a list when the motion is finished', () => {
    jest.useFakeTimers();
    const { baseElement, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );
    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    act(() => jest.runAllTimers());

    expect(baseElement.querySelector('[data-testid=element2]')).toEqual(null);
  });

  it('should add back a child that was removed from the list in a previous render', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="Bitbucket" />,
          <Motion id="element2" key="Confluence" />,
          <Motion id="element3" key="Jira Service Management" />,
          <Motion id="element4" key="Jira Software" />,
          <Motion id="element5" key="Opsgenie" />,
          <Motion id="element6" key="Statuspage" />,
        ]}
      </ExitingPersistence>,
    );
    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="Bitbucket" />,
          <Motion id="element2" key="Confluence" />,
          <Motion id="element4" key="Jira Software" />,
          <Motion id="element5" key="Opsgenie" />,
          <Motion id="element6" key="Statuspage" />,
        ]}
      </ExitingPersistence>,
    );
    act(() => jest.runAllTimers());

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="Bitbucket" />,
          <Motion id="element2" key="Confluence" />,
          <Motion id="element3" key="Jira Service Management" />,
          <Motion id="element4" key="Jira Software" />,
          <Motion id="element5" key="Opsgenie" />,
          <Motion id="element6" key="Statuspage" />,
        ]}
      </ExitingPersistence>,
    );

    expect(getByTestId('element3')).toBeDefined();
  });

  it('should persist the child if it is replaced with another element', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element3" key="element3" />,
          <Motion id="element4" key="element4" />,
        ]}
      </ExitingPersistence>,
    );

    expect(getByTestId('element2')).toBeDefined();
  });

  it('should persist a list of children if they are all removed', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    expect(getByTestId('element1')).toBeDefined();
    expect(getByTestId('element2')).toBeDefined();
    expect(getByTestId('element3')).toBeDefined();
  });

  it('should ensure when persisting children other child elements are updated', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" color="purple" />,
          <Motion id="element2" key="element2" color="red" />,
          <Motion id="element3" key="element3" color="blurple" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" color="blue" />,
          <Motion id="element3" key="element3" color="red" />,
        ]}
      </ExitingPersistence>,
    );

    expect(getByTestId('element1').getAttribute('data-color')).toEqual('blue');
  });

  it('should persist a child when being removed when there are multiple conditional children', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <Motion id="element1" />
        <Motion id="element2" />
        <Motion id="element3" />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <Motion id="element1" />
        {false}
        <Motion id="element3" />
      </ExitingPersistence>,
    );

    expect(getByTestId('element2')).toBeDefined();
  });

  it('should remove a child when motion is finished when there are multiple conditional children', () => {
    jest.useFakeTimers();
    const { baseElement, rerender } = render(
      <ExitingPersistence>
        <Motion id="element1" />
        <Motion id="element2" />
        <Motion id="element3" />
      </ExitingPersistence>,
    );
    rerender(
      <ExitingPersistence>
        <Motion id="element1" />
        {false}
        <Motion id="element3" />
      </ExitingPersistence>,
    );

    act(() => jest.runAllTimers());

    expect(baseElement.querySelector('[data-testid=element2]')).toEqual(null);
  });

  it('should not remount other children when a child is persisted', () => {
    const UnmountCallback = (props: { onUnmount: () => void }) => {
      // We only want this to fire on mount and never again.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => () => props.onUnmount(), []);
      return <div />;
    };
    const callback = jest.fn();
    const { rerender } = render(
      <ExitingPersistence>
        <Motion id="element1" />
        <UnmountCallback onUnmount={callback} />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <UnmountCallback onUnmount={callback} />
      </ExitingPersistence>,
    );

    expect(callback).not.toHaveBeenCalled();
  });

  it('should mount a new child at the same time as one is exiting', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <Motion id="element1" key="1" />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <Motion id="element2" key="2" />
      </ExitingPersistence>,
    );

    expect(getByTestId('element2')).toBeDefined();
  });

  it('should splice new children added at the same time as some are exiting', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element4" key="element4" />,
        ]}
      </ExitingPersistence>,
    );

    const element3 = getByTestId('element3');
    const element4 = getByTestId('element4');
    expect(element3.nextElementSibling).toBe(element4);
  });

  it('should persist an element when switching to and from during an inflight motion', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <Motion id="element1" key="1" />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <Motion id="element2" key="2" />
      </ExitingPersistence>,
    );
    jest.advanceTimersByTime(50);

    rerender(
      <ExitingPersistence>
        <Motion id="element1" key="1" />
      </ExitingPersistence>,
    );

    expect(getByTestId('element1')).toBeDefined();
    expect(getByTestId('element2')).toBeDefined();
  });

  it('should persist exiting children when sequential exits happen during another exit motion', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );
    jest.advanceTimersByTime(99);
    rerender(
      <ExitingPersistence>
        {[<Motion id="element3" key="element3" />]}
      </ExitingPersistence>,
    );
    jest.advanceTimersByTime(99);
    rerender(<ExitingPersistence>{[]}</ExitingPersistence>);
    jest.advanceTimersByTime(99);

    expect(getByTestId('element1')).toBeDefined();
    expect(getByTestId('element2')).toBeDefined();
    expect(getByTestId('element3')).toBeDefined();
  });

  it('should remove sequential exiting children after all inflight exits have finished', () => {
    jest.useFakeTimers();
    const { baseElement, rerender } = render(
      <ExitingPersistence>
        {[
          <Motion id="element1" key="element1" />,
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        {[
          <Motion id="element2" key="element2" />,
          <Motion id="element3" key="element3" />,
        ]}
      </ExitingPersistence>,
    );
    act(() => jest.advanceTimersByTime(99));
    rerender(
      <ExitingPersistence>
        {[<Motion id="element3" key="element3" />]}
      </ExitingPersistence>,
    );
    act(() => jest.advanceTimersByTime(99));
    rerender(<ExitingPersistence>{[]}</ExitingPersistence>);
    act(() => jest.runAllTimers());

    expect(baseElement.querySelector('[data-testid=element1]')).toEqual(null);
    expect(baseElement.querySelector('[data-testid=element2]')).toEqual(null);
    expect(baseElement.querySelector('[data-testid=element3]')).toEqual(null);
  });

  it('should remove exiting elements before entering new ones', () => {
    const { baseElement, rerender } = render(
      <ExitingPersistence exitThenEnter>
        <Motion id="element1" key="1" />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence exitThenEnter>
        <Motion id="element2" key="2" />
      </ExitingPersistence>,
    );

    expect(baseElement.querySelector('[data-testid=element2]')).toEqual(null);
  });

  it('should render entering elements after exiting elements have left', () => {
    jest.useFakeTimers();
    const { getByTestId, rerender } = render(
      <ExitingPersistence exitThenEnter>
        <Motion id="element1" key="1" />
      </ExitingPersistence>,
    );
    rerender(
      <ExitingPersistence exitThenEnter>
        <Motion id="element2" key="2" />
      </ExitingPersistence>,
    );

    act(() => jest.runAllTimers());

    expect(getByTestId('element2')).toBeDefined();
  });

  it('should re-render once', () => {
    const onRender = jest.fn();
    const { rerender } = render(
      <ExitingPersistence>
        <Motion id="target" onRender={onRender} />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <Motion id="target" onRender={onRender} />
      </ExitingPersistence>,
    );

    // Once for initial render, twice for rerender
    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('should re-render non-exiting element once', () => {
    jest.useFakeTimers();
    const onRender = jest.fn();
    const { rerender } = render(
      <ExitingPersistence>
        <Motion id="persisted" onRender={onRender} />
        <Motion id="target" />
      </ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <Motion id="persisted" onRender={onRender} />
        {false}
      </ExitingPersistence>,
    );
    act(() => jest.runAllTimers());

    // Once for initial render, twice for rerender
    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('should allow child motions to appear on initial mount', () => {
    const { getByTestId } = render(
      <ExitingPersistence appear>
        <KeyframesMotion
          enteringAnimation={{}}
          animationTimingFunction={() => 'linear'}
          duration={100}
        >
          {(props) => <div {...props} data-testid="target" />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '100ms',
    );
  });

  it('should immediately show child motions on initial mount', () => {
    const { getByTestId } = render(
      <ExitingPersistence>
        <KeyframesMotion
          enteringAnimation={{}}
          animationTimingFunction={() => 'linear'}
          duration={100}
        >
          {(props) => <div {...props} data-testid="target" />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );

    expect(getByTestId('target')).not.toHaveStyleDeclaration(
      'animation-play-state',
      'running',
    );
  });

  it('should have child elements appear after the initial mount when initial mount was immediate', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>{false}</ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence>
        <KeyframesMotion
          enteringAnimation={{}}
          animationTimingFunction={() => 'linear'}
          duration={100}
        >
          {(props) => <div {...props} data-testid="target" />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '100ms',
    );
  });

  it('should have child elements appear after the initial mount when initial mount they appeared', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence appear>{false}</ExitingPersistence>,
    );

    rerender(
      <ExitingPersistence appear>
        <KeyframesMotion
          enteringAnimation={{}}
          animationTimingFunction={() => 'linear'}
          duration={100}
        >
          {(props) => <div {...props} data-testid="target" />}
        </KeyframesMotion>
      </ExitingPersistence>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '100ms',
    );
  });

  it('should let motions appear by default outside of a exiting persistence', () => {
    const { getByTestId } = render(
      <KeyframesMotion
        enteringAnimation={{}}
        animationTimingFunction={() => 'linear'}
        duration={100}
      >
        {(props) => <div {...props} data-testid="target" />}
      </KeyframesMotion>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '100ms',
    );
  });
});
