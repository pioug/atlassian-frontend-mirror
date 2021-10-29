import React from 'react';

import { render } from '@testing-library/react';

import { withLegacyMobileMacros } from '../../src';
import { macroExtensionHandlerKey } from '../../src/ui/constants';
import { InlineMacroComponent } from '../../src/ui/InlineMacroComponent';
import { MacroFallbackComponent } from '../../src/ui/MacroFallbackComponent';

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

  it('should render macro fallback for macros not supported inline', () => {
    render(<ComponentWithMacros />);
    expect(MockChildComponent).toBeCalled();
    const callParams = (MockChildComponent.mock.calls[0] as any[])[0];
    expect(callParams).toHaveProperty('extensionHandlers');
    const extensionHandlers = callParams.extensionHandlers;
    expect(extensionHandlers[macroExtensionHandlerKey]).toBeDefined();
    const macroExtensionHandler = extensionHandlers[macroExtensionHandlerKey];
    const ext = {
      extensionKey: 'toc',
      extensionType: macroExtensionHandlerKey,
    };
    const result = macroExtensionHandler(ext);
    expect(result.type).toEqual(MacroFallbackComponent);
  });

  it('should render inline macro for a supported extension type', () => {
    render(<ComponentWithMacros />);
    expect(MockChildComponent).toBeCalled();
    const callParams = (MockChildComponent.mock.calls[0] as any[])[0];
    expect(callParams).toHaveProperty('extensionHandlers');
    const extensionHandlers = callParams.extensionHandlers;
    expect(extensionHandlers[macroExtensionHandlerKey]).toBeDefined();
    const macroExtensionHandler = extensionHandlers[macroExtensionHandlerKey];
    const ext = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
    };
    const result = macroExtensionHandler(ext);
    expect(result.type).toEqual(InlineMacroComponent);
  });
});
