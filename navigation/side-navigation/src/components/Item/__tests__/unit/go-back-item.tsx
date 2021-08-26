import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { GoBackItem } from '../../index';

describe('<GoBackItem />', () => {
  it('should callback on click only once', () => {
    const callback = jest.fn();
    const { getByText } = render(
      <GoBackItem onClick={callback}>Go Back</GoBackItem>,
    );

    fireEvent.click(getByText('Go Back'));
    fireEvent.click(getByText('Go Back'));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
