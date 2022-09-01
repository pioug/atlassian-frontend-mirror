import React from 'react';

import { render } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import { UNSAFE_Box as Box, UNSAFE_Text as Text } from '../../../index';

describe('Box component', () => {
  const testId = 'test';

  it('should render box', () => {
    const { getByText } = render(<Box>Box</Box>);
    expect(getByText('Box')).toBeInTheDocument();
  });

  describe('with SurfaceContext', () => {
    it('should invert text color when box sets background', () => {
      const { getByText } = render(
        <Box backgroundColor={['brand.bold', '']}>
          <Text>Text</Text>
        </Box>,
      );
      const element = getByText('Text');
      expect(element).toHaveStyleDeclaration(
        'color',
        token('color.text.inverse', 'var(--ds-co-fb)'),
      );
    });

    it('should respect text color when text sets its own color', () => {
      const { getByText } = render(
        <Box backgroundColor={['brand.bold', '']}>
          <Text color={['disabled', '']}>Text</Text>
        </Box>,
      );
      const element = getByText('Text');
      expect(element).toHaveStyleDeclaration(
        'color',
        token('color.text.disabled', 'var(--ds-co-fb)'),
      );
    });
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(<Box testId={testId}>Box with testid</Box>);
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
