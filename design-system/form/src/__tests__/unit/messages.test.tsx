import React from 'react';

import { render } from '@testing-library/react';

import { ErrorMessage, HelperMessage, ValidMessage } from '@atlaskit/form';

const props = {
  children: ['test'],
};

describe('Messages', () => {
  describe('aria-live attributes', () => {
    [ErrorMessage, HelperMessage, ValidMessage].forEach((Component, index) => {
      it(`${Component.name} should have aria-live`, () => {
        const { getByRole } = render(<Component {...props} key={index} />);
        expect(getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
