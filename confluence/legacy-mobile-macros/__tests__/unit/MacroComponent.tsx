import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { MacroComponent, macroExtensionHandlerKey } from '../../src/ui';

import { getMockMacroComponentProps } from './props.mock';

describe('MacroComponent', () => {
  it('should render fallback when rendering strategy is unrecognized', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'example unrecognized strategy';

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const fallback = queryByTestId('macro-fallback');
    expect(fallback).toBeTruthy();
  });

  it('should render inline macro for inline strategy when inline implementation exists', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'inline';
    props.extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
      parameters: {
        macroParams: {
          '': {
            value: 'anchorName',
          },
        },
      },
    };

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('inline-macro');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeTruthy();
    expect(fallback).toBeFalsy();
  });

  it('should render fallback for inline strategy when inline implementation does not exist', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'inline';

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('inline-macro');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeFalsy();
    expect(fallback).toBeTruthy();
  });

  it('should render fallback for fallback strategy', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'fallback';
    props.extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
      parameters: {
        macroParams: {
          '': {
            value: 'anchorName',
          },
        },
      },
    };

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('inline-macro');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeFalsy();
    expect(fallback).toBeTruthy();
  });

  it('should render ssr for inlineStatic strategy', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'inlineStatic';
    props.extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
      parameters: {
        macroParams: {
          '': {
            value: 'anchorName',
          },
        },
      },
    };

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('ssr-macro-MOBILE');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeTruthy();
    expect(fallback).toBeFalsy();
  });

  it('should render ssr for inlineDynamic strategy', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'inlineDynamic';
    props.extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
      parameters: {
        macroParams: {
          '': {
            value: 'anchorName',
          },
        },
      },
    };

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('ssr-macro-DESKTOP');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeTruthy();
    expect(fallback).toBeFalsy();
  });

  it('should render fallback when no strategy is specified', () => {
    let props = getMockMacroComponentProps();
    props.extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
      parameters: {
        macroParams: {
          '': {
            value: 'anchorName',
          },
        },
      },
    };

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const inline = queryByTestId('inline-macro');
    const fallback = queryByTestId('macro-fallback');
    expect(inline).toBeFalsy();
    expect(fallback).toBeTruthy();
  });
});
