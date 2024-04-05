import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Link from '../../../../index';
import variations from '../../../../utils/variations';

describe(`Accessibility:`, () => {
  variations.forEach(({ name, props }) => {
    describe(`'${name}' accessibility`, () => {
      it('should not fail an aXe audit', async () => {
        const { container } = render(<Link {...props} />);
        await axe(container);
      });
    });
  });
});
