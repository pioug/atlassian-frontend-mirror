import { render } from '@testing-library/react';
import React from 'react';

import Avatar from '../../Avatar';

describe('Avatar should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const testId = 'myAvatar';
    const { getByTestId } = render(
      <Avatar name="xxlarge" size="xxlarge" testId={testId} />,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
