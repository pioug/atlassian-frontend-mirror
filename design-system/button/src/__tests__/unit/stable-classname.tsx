import React from 'react';

import { render } from '@testing-library/react';

import forEachType from './_util/for-each-type';

forEachType(({ name, Component }) => {
  it(`${name}: should have a stable class name when re-rendering`, () => {
    const { getByTestId, rerender } = render(<Component testId="button" />);
    const button = getByTestId('button');
    const original: string = button.className;

    rerender(<Component testId="button" />);

    expect(original).toBe(button.className);
  });
});
