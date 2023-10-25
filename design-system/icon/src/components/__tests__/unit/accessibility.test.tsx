import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import SVG from '../../../entry-points/svg';
import LikeIcon from '../../../../glyph/like';
import type { CustomGlyphProps, SVGProps } from '../../../types';
import Icon from '../../../index';

it('Basic icon with empty label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="" />);
  await axe(container);
});

it('Basic icon with label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="Like" />);
  await axe(container);
});

it('Custom icon should not fail aXe audit', async () => {
  const CustomGlyph = (props: CustomGlyphProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      data-testid={props['data-testid']}
      aria-label={props['aria-label']}
      className={props.className}
    >
      <path
        fill="currentColor"
        d="M24 12c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12C0 5.372 5.372 0 12 0c6.627 0 12 5.372 12 12zM12 2.92A9.08 9.08 0 002.92 12 9.08 9.08 0 0012 21.08 9.08 9.08 0 0021.081 12 9.08 9.08 0 0012 2.92zm0 16.722A7.64 7.64 0 014.36 12 7.64 7.64 0 0112 4.36 7.64 7.64 0 0119.641 12a7.64 7.64 0 01-7.64 7.641z"
      />
    </svg>
  );

  const { container } = render(<Icon glyph={CustomGlyph} label="" />);

  await axe(container);
});

it('Custom SVG should not fail aXe audit', async () => {
  const CustomSVGExample = (props: SVGProps) => {
    const { primaryColor, size, label } = props;
    return (
      <SVG primaryColor={primaryColor} size={size} label={label}>
        <path
          fill="currentColor"
          d="M24 12c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12C0 5.372 5.372 0 12 0c6.627 0 12 5.372 12 12zM12 2.92A9.08 9.08 0 002.92 12 9.08 9.08 0 0012 21.08 9.08 9.08 0 0021.081 12 9.08 9.08 0 0012 2.92zm0 16.722A7.64 7.64 0 014.36 12 7.64 7.64 0 0112 4.36 7.64 7.64 0 0119.641 12a7.64 7.64 0 01-7.64 7.641z"
        />
      </SVG>
    );
  };

  const { container } = render(
    <div>
      <CustomSVGExample primaryColor={'#FFFFFF'} size="small" label="spinner" />
      <CustomSVGExample
        primaryColor={'#FFFFFF'}
        size="medium"
        label="spinner"
      />
      <CustomSVGExample primaryColor={'#FFFFFF'} size="large" label="spinner" />
      <CustomSVGExample primaryColor={'#FFFFFF'} size="small" label="spinner" />
      <CustomSVGExample
        primaryColor={'#FFFFFF'}
        size="medium"
        label="spinner"
      />
      <CustomSVGExample primaryColor={'#FFFFFF'} size="large" label="spinner" />
    </div>,
  );

  await axe(container);
});
