import React, { memo } from 'react';
import { render } from '@testing-library/react';
import Theme from '../../Theme';
import AtlaskitThemeProvider from '../../AtlaskitThemeProvider';

interface RenderCountProps {
  onRender: () => void;
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

describe('<Theme />', () => {
  it('should render without having a parent provider', done => {
    render(
      <Theme.Consumer>
        {(t: any) => {
          expect(t).toEqual({ mode: 'light' });
          done();
        }}
      </Theme.Consumer>,
    );
  });

  it('should inherit its parents context', done => {
    const backgroundColor = '#fff';
    const textColor = '#000';
    render(
      <Theme.Provider value={t => ({ backgroundColor, ...t({}) })}>
        <Theme.Provider value={t => ({ ...t({}), textColor })}>
          <Theme.Consumer>
            {(t: any) => {
              expect(t).toEqual({ backgroundColor, mode: 'light', textColor });
              done();
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
});
