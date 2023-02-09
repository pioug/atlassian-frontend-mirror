import React from 'react';

import { render } from '@testing-library/react';

import Text from '@atlaskit/ds-explorations/text';
import { token } from '@atlaskit/tokens';

import { Box } from '../../../index';

describe('Box component', () => {
  const testId = 'test';

  it('should render box', () => {
    const { getByText } = render(
      <Box>
        <Text>Box</Text>
      </Box>,
    );
    expect(getByText('Box')).toBeInTheDocument();
  });

  describe('with SurfaceContext', () => {
    it('should respect text color when text sets its own color and bg is non-bold', () => {
      const { getByText } = render(
        <Box backgroundColor="information">
          <Text color="color.text">Text</Text>
        </Box>,
      );
      const element = getByText('Text');
      // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
      expect(element).toHaveStyleDeclaration('color', token('color.text'));
    });

    it("should override text color when background won't meet contrast", () => {
      const { getByText } = render(
        <Box backgroundColor="brand.bold">
          <Text color="disabled">Text</Text>
        </Box>,
      );
      const element = getByText('Text');
      expect(element).toHaveStyleDeclaration(
        'color',
        token('color.text.inverse', '#FFFFFF'),
      );
    });
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Box testId={testId}>
        <Text>Box with testid</Text>
      </Box>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
