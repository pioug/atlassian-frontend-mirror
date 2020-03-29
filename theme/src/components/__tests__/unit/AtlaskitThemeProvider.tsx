import React, { memo } from 'react';
import { render } from '@testing-library/react';
import styled from 'styled-components';
import AtlaskitThemeProvider from '../../AtlaskitThemeProvider';

interface RenderCountProps {
  onRender: () => void;
}
const StyledComponent = styled.div`
  ${props => props.theme};
`;
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
});
