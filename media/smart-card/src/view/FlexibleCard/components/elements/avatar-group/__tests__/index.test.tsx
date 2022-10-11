/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { css } from '@emotion/react';
import AvatarGroup from '..';

describe('Element: Avatar Group', () => {
  const testId = 'smart-element-avatar-group';
  const authorsWithNoImages = [
    { name: 'Bob' },
    { name: 'Charlie' },
    { name: 'Spaghetti' },
  ];

  it('renders element', async () => {
    const { getByTestId } = render(<AvatarGroup items={authorsWithNoImages} />);

    const element = await getByTestId(testId);
    const avatarGroup = await getByTestId(`${testId}--avatar-group`);

    expect(element).toBeTruthy();
    expect(
      element.getAttribute('data-smart-element-avatar-group'),
    ).toBeTruthy();
    expect(avatarGroup).toBeTruthy();
  });

  it('renders override css', async () => {
    const overrideCss = css`
      background-color: blue;
    `;
    const { getByTestId } = render(
      <AvatarGroup items={authorsWithNoImages} overrideCss={overrideCss} />,
    );

    const element = await getByTestId(testId);
    expect(element).toHaveStyleDeclaration('background-color', 'blue');
  });
});
