import React from 'react';

import { render } from '@testing-library/react';

import Text from '@atlaskit/ds-explorations/text';

import { Stack } from '../../../index';

describe('Stack component', () => {
  const testId = 'test';

  it('should render stack', () => {
    const { getByText } = render(
      <Stack gap="space.050">
        <Text>1</Text>
        <Text>2</Text>
      </Stack>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Stack gap="space.050" testId={testId}>
        <Text>1</Text>
        <Text>2</Text>
      </Stack>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
