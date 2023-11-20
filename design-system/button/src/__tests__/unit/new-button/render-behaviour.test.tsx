import React from 'react';

import { render } from '@testing-library/react';

import variants from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  it(`${name}: should only render once on initial render`, () => {
    const mock = jest.fn();
    function App() {
      mock();
      return null;
    }

    render(
      <Component>
        <App />
      </Component>,
    );

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
