import React from 'react';

import { render } from '@testing-library/react';

import { variants } from '../../../utils/variants';

variants.forEach(({ name, Component }) => {
  it(`${name} should not add unnecessary \`tabIndex={0}\` to enable focus`, async () => {
    const { getByTestId } = render(<Component testId={name}>Button</Component>);

    expect(getByTestId(name).getAttribute('tabIndex')).toBeNull();
  });

  it(`${name} should not add unnecessary \`tabIndex={-1}\` to disable focus`, async () => {
    const { getByTestId } = render(
      <Component testId={name} isDisabled>
        Button
      </Component>,
    );

    expect(getByTestId(name).getAttribute('tabIndex')).toBeNull();
  });
});
