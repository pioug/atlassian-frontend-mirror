import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ShallowWrapper } from 'enzyme';
import React from 'react';

// TODO remove once TypeScript 3.5 is available in Ak
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// extracted from @atlaskit/type-helpers, from whom it can't be consumed
export type PropsOf<C> = C extends new (props: infer P) => React.Component
  ? P
  : C extends (props: infer P) => React.ReactElement<any> | null
  ? P
  : C extends React.Component<infer P>
  ? P
  : never;

// TODO remove this when we upgrade enzyme to 3.8
export const renderProp = <P, S>(
  wrapper: ShallowWrapper<P, S>,
  renderProp: keyof P,
  ...args: any[]
): ShallowWrapper<any> => {
  const prop = wrapper.prop(renderProp);
  if (prop && typeof prop === 'function') {
    const Wrapper = () => prop(...args);
    return shallowWithIntl(<Wrapper />);
  }
  throw new Error(`renderProp ${renderProp} is not a function`);
};

export const createMockEvent: any = (
  type: string,
  properties?: { [key: string]: any },
) => {
  const noop = () => {};
  return {
    bubbles: false,
    cancelable: false,
    currentTarget: document,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    nativeEvent: Event,
    preventDefault: noop,
    isDefaultPrevented: false,
    stopPropagation: noop,
    isPropagationStopped: false,
    target: document,
    timeStamp: new Date(),
    type,
    ...properties,
  };
};
