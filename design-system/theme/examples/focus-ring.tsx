/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { focusRing, colors } from '../src';

const InteractiveElement = ({ color, outlineWidth, children, testId }: any) => (
  <div
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex={0}
    data-testid={testId}
    // @ts-ignore
    css={css`
      ${focusRing(color, outlineWidth)};
      padding: 16px;
      border-radius: 3px;
    `}
  >
    {children}
  </div>
);

export default () => {
  return (
    <div data-testid="outerDiv">
      <InteractiveElement testId="default">Default</InteractiveElement>
      <InteractiveElement testId="customColor" color={colors.G200}>
        Custom color
      </InteractiveElement>
      <InteractiveElement
        testId="customOutlineWidth"
        color={colors.Y200}
        outlineWidth={5}
      >
        Custom outline width
      </InteractiveElement>
    </div>
  );
};
