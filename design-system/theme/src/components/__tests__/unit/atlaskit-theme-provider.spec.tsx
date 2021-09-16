import React, { FC, memo } from 'react';

import { render } from '@testing-library/react';

import AtlaskitThemeProvider from '../../atlaskit-theme-provider';
import { useGlobalTheme } from '../../theme';

interface RenderCountProps {
  onRender: () => void;
}
const StyledComponent: FC = (props) => {
  const theme = useGlobalTheme();
  return <div {...theme} {...props} />;
};
const RenderCount = (props: RenderCountProps) => {
  props.onRender();
  return <div>hello world</div>;
};
/**
 * This will re-render even if props didn't change if theme has an unstable reference.
 */
const RenderCountWithMemo = memo((props: RenderCountProps) => {
  return (
    <StyledComponent>
      <RenderCount {...props} />
    </StyledComponent>
  );
});

describe('<AtlaskitThemeProvider />', () => {
  it('should render child once when parent is rerendered many times when memod', () => {
    const callback = jest.fn();
    const markup = () => (
      <AtlaskitThemeProvider>
        <RenderCountWithMemo onRender={callback} />
      </AtlaskitThemeProvider>
    );
    const { rerender } = render(markup());

    rerender(markup());
    rerender(markup());
    rerender(markup());
    rerender(markup());

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should render one style element when AKThemeProvider is mounted', () => {
    render(
      <AtlaskitThemeProvider>
        <div>Hello</div>
      </AtlaskitThemeProvider>,
    );

    expect(
      document.querySelectorAll('head style:not([data-emotion=css])'),
    ).toHaveLength(1);
  });

  it('should still render one style element when multiple AKThemeProviders are mounted', () => {
    render(
      <AtlaskitThemeProvider>
        <AtlaskitThemeProvider>
          <div>Hello</div>
        </AtlaskitThemeProvider>
      </AtlaskitThemeProvider>,
    );

    expect(
      document.querySelectorAll('head style:not([data-emotion=css])'),
    ).toHaveLength(1);
  });
});
