import React, { memo } from 'react';

import { render } from '@testing-library/react';

import type { ThemeModes } from '../../../types';
import AtlaskitThemeProvider from '../../atlaskit-theme-provider';
import Theme, { useGlobalTheme } from '../../theme';

interface RenderCountProps {
  onRender: (...args: any[]) => void;
}
const RenderCount = (props: RenderCountProps) => {
  props.onRender();
  return <div>hello world</div>;
};
/**
 * This will re-render even if props didn't change if theme has an unstable reference.
 */
const ThemedComponent = memo((props: RenderCountProps) => {
  return (
    <Theme.Consumer>
      {() => <RenderCount onRender={props.onRender} />}
    </Theme.Consumer>
  );
});

/**
 * This will re-render even if props didn't change if theme has an unstable reference.
 */
const HookThemedComponent = memo((props: RenderCountProps) => {
  const theme = useGlobalTheme();
  props.onRender(theme.mode);
  return null;
});

describe('<Theme />', () => {
  it('should render without having a parent provider', (done) => {
    render(
      <Theme.Consumer>
        {(tokens) => {
          expect(tokens).toEqual({ mode: 'light' });
          done();
          return null;
        }}
      </Theme.Consumer>,
    );
  });

  it('should inherit its parents context', (done) => {
    const backgroundColor = '#fff';
    const textColor = '#000';
    render(
      <Theme.Provider value={(t) => ({ backgroundColor, ...t() })}>
        <Theme.Provider value={(t) => ({ ...t(), textColor })}>
          <Theme.Consumer>
            {(tokens) => {
              expect(tokens).toEqual({
                backgroundColor,
                mode: 'light',
                textColor,
              });
              done();
              return null;
            }}
          </Theme.Consumer>
        </Theme.Provider>
      </Theme.Provider>,
    );
  });

  it('should render child once when parent theme is rerendered many times when memod', () => {
    const callback = jest.fn();
    const markup = () => (
      <Theme.Provider>
        <ThemedComponent onRender={callback} />
      </Theme.Provider>
    );
    const { rerender } = render(markup());

    rerender(markup());
    rerender(markup());
    rerender(markup());
    rerender(markup());

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should render child once when parent legacy theme is rerendered many times when memod', () => {
    const callback = jest.fn();
    const markup = () => (
      <AtlaskitThemeProvider>
        <ThemedComponent onRender={callback} />
      </AtlaskitThemeProvider>
    );
    const { rerender } = render(markup());

    rerender(markup());
    rerender(markup());
    rerender(markup());
    rerender(markup());

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should re-render child when parent legacy theme mode updates', () => {
    const callback = jest.fn();
    const markup = (mode: ThemeModes = 'light') => (
      <AtlaskitThemeProvider mode={mode}>
        <ThemedComponent onRender={callback} />
      </AtlaskitThemeProvider>
    );

    // expecting initial render => update when prop changes => update again when prop changes
    const { rerender } = render(markup());

    rerender(markup('dark'));
    rerender(markup('dark'));
    rerender(markup('light'));
    rerender(markup());

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should get new hook state when parent legacy theme mode updates', () => {
    const callback = jest.fn();
    const markup = (mode: ThemeModes = 'light') => (
      <AtlaskitThemeProvider mode={mode}>
        <HookThemedComponent onRender={callback} />
      </AtlaskitThemeProvider>
    );

    // expecting initial render => update when prop changes => update again when prop changes
    const { rerender } = render(markup());

    rerender(markup('dark'));
    rerender(markup('dark'));
    rerender(markup('light'));
    rerender(markup());

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, 'light');
    expect(callback).toHaveBeenNthCalledWith(2, 'dark');
    expect(callback).toHaveBeenNthCalledWith(3, 'light');
  });
});
