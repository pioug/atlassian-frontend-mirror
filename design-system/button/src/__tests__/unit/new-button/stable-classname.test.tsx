import React from 'react';

import { render } from '@testing-library/react';

import { variants } from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  it(`${name} should have a stable class name when re-rendering`, () => {
    const { getByTestId, rerender } = render(
      <Component testId="button">Button</Component>,
    );
    const button = getByTestId('button');
    const original: string = button.className;

    rerender(<Component testId="button">Button</Component>);

    expect(original).toBe(button.className);
  });
});
