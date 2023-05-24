import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { MacroComponent, macroExtensionHandlerKey } from '../../src/ui';
import {
  FALLBACK_TEST_ID,
  OPEN_IN_BROWSER_TEST_ID,
} from '../../src/ui/MacroComponent/MacroFallbackComponent/constants';

import { getMockMacroComponentProps } from './props.mock';

describe('MacroComponent', () => {
  it('should render default strategy when rendering strategy is unrecognized and default is provided', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'example unrecognized strategy';
    props.defaultRenderingStrategy = 'openInBrowser';

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const fallback = queryByTestId(OPEN_IN_BROWSER_TEST_ID);
    expect(fallback).toBeTruthy();
  });

  it('should render fallback when rendering strategy is unrecognized and no default is provided', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'example unrecognized strategy';

    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <MacroComponent {...props} />
      </IntlProvider>,
    );

    const fallback = queryByTestId(FALLBACK_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
    expect(inline).toBeFalsy();
    expect(fallback).toBeTruthy();
  });

  it('should render open in browser for openInBrowser strategy', () => {
    let props = getMockMacroComponentProps();
    props.renderingStrategy = 'openInBrowser';
    props.defaultRenderingStrategy = 'fallback';
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

    const inline = queryByTestId(FALLBACK_TEST_ID);
    const fallback = queryByTestId(OPEN_IN_BROWSER_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
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
    const fallback = queryByTestId(FALLBACK_TEST_ID);
    expect(inline).toBeFalsy();
    expect(fallback).toBeTruthy();
  });
});
