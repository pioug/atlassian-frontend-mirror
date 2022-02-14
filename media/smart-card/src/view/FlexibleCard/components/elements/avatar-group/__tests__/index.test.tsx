import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AvatarGroup from '..';

describe('Element: Avatar Group', () => {
  const testId = 'smart-element-avatar-group--avatar-group';
  const authorsWithNoImages = [
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Spaghetti' },
  ];

  it('renders element', async () => {
    const { getByTestId } = render(<AvatarGroup items={authorsWithNoImages} />);

    const element = await waitForElement(() => getByTestId(testId));

    expect(element).toBeTruthy();
  });
});
