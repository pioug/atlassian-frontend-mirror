import React from 'react';
import { shallow } from 'enzyme';
import { LoadingRateLimited } from '../loadingRateLimited';
import {
  WarningIconWrapper,
  CouldntLoadWrapper,
  ErrorWrapper,
} from '../styled';

describe('When a card is rate limited (429 error) with no metadata', () => {
  it('the appropriate UI (icon, 429 error and text) should be rendered', () => {
    const previewText = shallow(<LoadingRateLimited />);
    const warningIcon = previewText.find(WarningIconWrapper);
    const rateLimited429 = previewText.find(ErrorWrapper);
    const couldntLoadText = previewText.find(CouldntLoadWrapper);

    expect(warningIcon).toHaveLength(1);
    expect(rateLimited429).toHaveLength(1);
    expect(couldntLoadText).toHaveLength(1);
  });
});
