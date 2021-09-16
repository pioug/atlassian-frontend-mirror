/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Skeleton from '../../skeleton';

const TEST_ID = 'test';
describe('Skeleton', () => {
  afterEach(cleanup);
  test('sets color as currentColor by default', () => {
    const { getByTestId } = render(<Skeleton testId={TEST_ID} />);
    expect(getByTestId(TEST_ID)).toHaveStyle('background-color: currentColor');
  });

  test('sets color from prop', () => {
    const { getByTestId } = render(
      <Skeleton testId={TEST_ID} color="#FFFFFF" />,
    );
    expect(getByTestId(TEST_ID)).toHaveStyle('background-color: #FFFFFF');
  });

  test('sets a default opacity', () => {
    const { getByTestId } = render(<Skeleton testId={TEST_ID} />);
    expect(getByTestId(TEST_ID)).toHaveStyleDeclaration('opacity', '0.15');
  });

  test('sets a strong opacity when prop specified', () => {
    const { getByTestId } = render(
      <Skeleton testId={TEST_ID} weight="strong" />,
    );
    expect(getByTestId(TEST_ID)).toHaveStyleDeclaration('opacity', '0.3');
  });
});
