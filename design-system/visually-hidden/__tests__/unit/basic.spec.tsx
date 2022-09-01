/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';

import VisuallyHidden from '../../src';

describe('Visually Hidden', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <VisuallyHidden>
        <div data-testid="test" />
      </VisuallyHidden>,
    );

    expect(getByTestId('test')).toBeDefined();
  });

  it('is queryable by an id', () => {
    const { getByText } = render(
      <VisuallyHidden id="test">Hidden</VisuallyHidden>,
    );

    expect(getByText('Hidden').id).toEqual('test');
  });

  it('has key visually hidden styles', () => {
    const { getByText } = render(<VisuallyHidden>Hidden</VisuallyHidden>);

    const element = getByText('Hidden');
    expect(element).toHaveStyleDeclaration('width', '1px');
    expect(element).toHaveStyleDeclaration('height', '1px');
    expect(element).toHaveStyleDeclaration('position', 'absolute');
    expect(element).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
  });
});
