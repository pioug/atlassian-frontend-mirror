import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Text as Text } from '../../../index';

describe('Text component', () => {
  it('should render given text', () => {
    const { getByText } = render(<Text>Text</Text>);
    expect(getByText('Text')).toBeInTheDocument();
  });

  it('should render with given test id', () => {
    const { getByTestId } = render(<Text testId="test">Text</Text>);
    expect(getByTestId('test')).toBeInTheDocument();
  });
});
