import React from 'react';

import { render } from '@testing-library/react';

import MediaSvg from './media-svg';

describe('MediaSvg', () => {
  it('should find MediaSvg by its testid', async () => {
    const testId = 'media-svg';
    const { getByTestId } = render(<MediaSvg testId={testId} />);

    expect(getByTestId(testId)).toBeTruthy();
  });
});
