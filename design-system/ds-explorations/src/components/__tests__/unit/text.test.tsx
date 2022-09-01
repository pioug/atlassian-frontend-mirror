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

  describe('"as" prop behaviour', () => {
    it('renders without errors when a valid "as" value is given', () => {
      const { getByText } = render(<Text as="div">Text</Text>);
      expect(getByText('Text')).toBeInTheDocument();
    });

    it('throws when an invalid "as" value is given', () => {
      // @ts-ignore purposefully providing an invalid value to test invariant behaviour
      expect(() => render(<Text as="label">Text</Text>)).toThrow(
        new Error(
          'Invariant failed: @atlaskit/ds-explorations: Text received an invalid "as" value of "label"',
        ),
      );
    });
  });
});
