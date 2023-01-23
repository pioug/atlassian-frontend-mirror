import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LinkUrl from '../../LinkUrl';

describe('LinkUrl', () => {
  let LinkUrlTestId: string = 'link-with-safety';
  let mockLinkDestination: string = 'https://some.url';

  it.each<{
    mockLinkDescription: string;
    checkSafety: boolean;
    expected: boolean;
  }>([
    {
      mockLinkDescription: 'link description',
      expected: false,
      checkSafety: true,
    },
    {
      mockLinkDescription: 'https://another.url',
      expected: true,
      checkSafety: true,
    },
    {
      mockLinkDescription: mockLinkDestination,
      expected: false,
      checkSafety: true,
    },
    {
      mockLinkDescription: 'https://another.url',
      expected: false,
      checkSafety: false,
    },
  ])('correctly show safety warning message', (testData) => {
    const { mockLinkDescription, expected, checkSafety } = testData;

    const { getByTestId } = render(
      <LinkUrl href={mockLinkDestination} checkSafety={checkSafety}>
        {mockLinkDescription}
      </LinkUrl>,
    );
    const LinkUrlView = getByTestId(LinkUrlTestId);
    fireEvent.click(LinkUrlView);
    const isLinkUnsafe = !!screen.queryByText('Check this link');

    expect(isLinkUnsafe).toBe(expected);
  });
});
