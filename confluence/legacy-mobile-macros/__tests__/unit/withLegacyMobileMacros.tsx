import React from 'react';

import { render } from '@testing-library/react';

import { withLegacyMobileMacros } from '../../src';

import { createPromise, eventDispatcher } from './props.mock';

const MockChildComponent = jest.fn(() => {
  return <div>Child component</div>;
});

const ComponentWithMacros = withLegacyMobileMacros(
  MockChildComponent,
  createPromise,
  eventDispatcher,
  true,
);

const ComponentWithoutMacros = withLegacyMobileMacros(
  MockChildComponent,
  createPromise,
  eventDispatcher,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('withLegacyMobileMacros', () => {
  it('should add "extensionHandlers" prop to child component', () => {
    render(<ComponentWithMacros />);
    expect(MockChildComponent).toBeCalled();
    const callParams = (MockChildComponent.mock.calls[0] as any[])[0];
    expect(callParams).toHaveProperty('extensionHandlers');
  });

  it('should return child component without changes "enableLegacyMobileMacros" prop is falsy', () => {
    render(<ComponentWithoutMacros />);
    expect(MockChildComponent).toBeCalled();
    const callParams = (MockChildComponent.mock.calls[0] as any[])[0];
    expect(callParams).toEqual({});
  });
});
