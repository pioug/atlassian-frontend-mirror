import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ProgressIndicator from '../../progress-dots';

it('Basic ProgressIndicator should not fail aXe audit', async () => {
  const { container } = render(
    <ProgressIndicator
      selectedIndex={0}
      values={['one', 'two', 'three']}
      size="default"
    />,
  );
  await axe(container);
});
