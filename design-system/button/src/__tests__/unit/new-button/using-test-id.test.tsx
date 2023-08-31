import React from 'react';

import { render } from '@testing-library/react';

import { variants } from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  it(`${name} should render test ID`, async () => {
    const { getByTestId } = render(<Component testId={name}>Button</Component>);

    expect(getByTestId(name)).toBeInTheDocument();
  });
});
