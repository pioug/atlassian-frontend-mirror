import React, { createRef, RefObject } from 'react';

import { render } from '@testing-library/react';

import Star from '../../../components/star';

describe('<Star />', () => {
  it('should forward the ref to the label element', () => {
    const ref: RefObject<any> = createRef();
    render(
      <Star label="GREAT" testId="star" id="great" value="great" ref={ref} />,
    );

    expect(ref.current.getAttribute('data-testid')).toEqual('star--label');
  });
});
