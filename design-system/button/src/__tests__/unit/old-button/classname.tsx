/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';

import Button from '../../../old-button/button';

it('should support passing in additional classnames', () => {
  const { getByTestId } = render(
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    <Button testId="button" className="hello">
      children
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  // one emotion class name and one custom class name
  expect(button.classList.length).toBe(2);
  expect(button.classList.contains('hello')).toBe(true);
});

it('should merge css props into one classname', () => {
  const { getByTestId } = render(
    <Button testId="button" css={{ color: 'red' }}>
      children
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  // one emotion class name
  expect(button.classList.length).toBe(1);
});

it('should merge css props into one classname, and independent class names separately', () => {
  const { getByTestId } = render(
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
    <Button testId="button" css={{ color: 'red' }} className="hello">
      children
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  // one emotion class name + one custom class name
  expect(button.classList.length).toBe(2);
  expect(button.classList.contains('hello')).toBe(true);
});
