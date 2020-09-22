import React from 'react';

import Spinner, { Appearance, Size } from '@atlaskit/spinner';

import { BaseProps } from '../types';

type Props = Pick<
  BaseProps,
  'appearance' | 'isDisabled' | 'isSelected' | 'spacing'
>;

function getSpinnerAppearance({
  appearance,
  isDisabled,
  isSelected,
}: Props): Appearance {
  if (isDisabled) {
    return 'inherit';
  }
  if (isSelected) {
    return 'invert';
  }
  if (appearance === 'primary' || appearance === 'danger') {
    return 'invert';
  }
  return 'inherit';
}

export default function LoadingSpinner({
  spacing = 'default',
  ...rest
}: Props) {
  const size: Size = spacing === 'default' ? 'medium' : 'small';

  return <Spinner size={size} appearance={getSpinnerAppearance(rest)} />;
}
