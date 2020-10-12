import React from 'react';

import { render } from '@testing-library/react';

import { IconButton } from '../../index';

describe('<IconButton />', () => {
  it('should pass down test id', () => {
    const { getByTestId } = render(
      <IconButton tooltip="test" icon={<div />} testId="icon" />,
    );

    expect(() => getByTestId('icon')).not.toThrow();
  });
});
