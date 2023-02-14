import React from 'react';

import { render } from '@testing-library/react';

import Text from '@atlaskit/ds-explorations/text';

import { Inline } from '../../../../src';

describe('Inline', () => {
  const testId = 'test';

  it('should render inline', () => {
    const { getByText } = render(
      <Inline space="050">
        <Text>1</Text>
        <Text>2</Text>
      </Inline>,
    );
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should render inline with separators', () => {
    const { getByText } = render(
      <Inline space="050" separator="/">
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
      <Inline space="050" testId={testId}>
        <Text>1</Text>
        <Text>2</Text>
      </Inline>,
    );
    const element = getByTestId(testId);
    expect(element).toBeInTheDocument();
  });
});
