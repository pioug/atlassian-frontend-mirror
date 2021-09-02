import React from 'react';

import { cleanup, render } from '@testing-library/react';

import EmptyState from '../../empty-state';
import { Width } from '../../types';

const sizes: Width[] = ['narrow', 'wide'];

const widths = {
  narrow: '304px',
  wide: '464px',
};

describe('<EmptyState size/width />', () => {
  afterEach(cleanup);

  it('should default to wide', () => {
    const { getByTestId } = render(<EmptyState header="hello" testId="test" />);
    const element = getByTestId('test');
    expect(element).toHaveStyleDeclaration('max-width', widths.wide);
  });

  sizes.forEach((size) => {
    describe(`with ${size} setting`, () => {
      it('should prefer width over size', () => {
        const { getByTestId } = render(
          <EmptyState
            width={size}
            size={size === 'wide' ? 'narrow' : 'wide'}
            header="hello"
            testId="test"
          />,
        );
        const element = getByTestId('test');
        expect(element).toHaveStyleDeclaration('max-width', widths[size]);
      });

      it('should support size', () => {
        const { getByTestId } = render(
          <EmptyState size={size} header="hello" testId="test" />,
        );
        const element = getByTestId('test');
        expect(element).toHaveStyleDeclaration('max-width', widths[size]);
      });

      it('should support width', () => {
        const { getByTestId } = render(
          <EmptyState width={size} header="hello" testId="test" />,
        );
        const element = getByTestId('test');
        expect(element).toHaveStyleDeclaration('max-width', widths[size]);
      });
    });
  });
});
