import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import LikeIcon from '../../../../glyph/like';
import CustomIconExample from '../../../../examples/constellation/custom-icon-default';
import CustomSvgExample from '../../../../examples/constellation/custom-svg-default';

it('Basic icon with empty label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="" />);
  await axe(container);
});

it('Basic icon with label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="Like" />);
  await axe(container);
});

it('Custom icon should not fail aXe audit', async () => {
  const { container } = render(<CustomIconExample />);
  await axe(container);
});

it('Custom SVG should not fail aXe audit', async () => {
  const { container } = render(<CustomSvgExample />);
  await axe(container);
});
