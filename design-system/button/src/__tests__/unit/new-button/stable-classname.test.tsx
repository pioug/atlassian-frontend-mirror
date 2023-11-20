import React from 'react';

import { render, screen } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  it(`${name} should have a stable class name when re-rendering`, () => {
    const { rerender } = render(<Component testId="button">Button</Component>);
    const button = screen.getByTestId('button');
    const original: string = button.className;

    rerender(<Component testId="button">Button</Component>);

    expect(original).toBe(button.className);
  });
});
