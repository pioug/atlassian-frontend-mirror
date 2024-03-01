import React from 'react';

import { render, screen } from '@testing-library/react';

import forEachType from './_util/for-each-type';

forEachType(({ name, Component }) => {
  it(`${name}: should have a stable class name when re-rendering`, () => {
    const { rerender } = render(<Component testId="button">Save</Component>);
    const button = screen.getByTestId('button');
    const original: string = button.className;

    rerender(<Component testId="button">Save</Component>);

    expect(original).toBe(button.className);
  });
});
