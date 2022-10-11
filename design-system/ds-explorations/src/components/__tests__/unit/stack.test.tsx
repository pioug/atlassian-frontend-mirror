import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Stack as Stack, UNSAFE_Text as Text } from '../../../index';

describe('Stack component', () => {
  const testId = 'test';

  it('should render stack', () => {
    const { getByText } = render(
      <Stack gap="sp-50">
        <Text>1</Text>
        <Text>2</Text>
      </Stack>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Stack gap="sp-50" testId={testId}>
        <Text>1</Text>
        <Text>2</Text>
      </Stack>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
