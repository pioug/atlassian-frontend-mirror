import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Inline as Inline, UNSAFE_Text as Text } from '../../../index';

describe('Inline component', () => {
  const testId = 'test';

  it('should render inline', () => {
    const { getByText } = render(
      <Inline gap="scale.050">
        <Text>1</Text>
        <Text>2</Text>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render inline with dividers', () => {
    const { getByText } = render(
      <Inline gap="scale.050" divider="/">
        <Text>1</Text>
        <Text>2</Text>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('/')).toBeInTheDocument();
  });

  it('should render with a given test id', () => {
    const { getByTestId } = render(
      <Inline gap="scale.050" testId={testId}>
        <Text>1</Text>
        <Text>2</Text>
      </Inline>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
