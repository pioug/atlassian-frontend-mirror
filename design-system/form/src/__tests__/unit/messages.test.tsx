import React from 'react';

import { render } from '@testing-library/react';

import { ErrorMessage, HelperMessage, ValidMessage } from '@atlaskit/form';

const props = {
  testId: 'testId',
  children: ['test'],
};

describe('Messages', () => {
  describe('aria-live attributes', () => {
    [ErrorMessage, HelperMessage, ValidMessage].forEach((Component, index) => {
      it(`${Component.name} should have aria-live`, () => {
        const { getByTestId } = render(<Component {...props} key={index} />);
        expect(getByTestId('testId')).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
});
