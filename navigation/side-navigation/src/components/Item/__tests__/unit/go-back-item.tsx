import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { itemHoverBackgroundColor } from '../../../../common/constants';
import { GoBackItem } from '../../index';

describe('<GoBackItem />', () => {
  it('should appear selected when clicked', () => {
    const { getByText, getByTestId } = render(
      <GoBackItem testId="go-back">Go Back</GoBackItem>,
    );

    fireEvent.click(getByText('Go Back'));

    expect(getByTestId('go-back')).toHaveStyleDeclaration(
      'background-color',
      itemHoverBackgroundColor.replace(/ /g, ''),
    );
  });

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
