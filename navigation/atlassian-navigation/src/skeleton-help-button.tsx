import React from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { SkeletonIconButton } from './components/SkeletonIconButton';
import { useTheme } from './theme';

export type SkeletonHelpButtonProps = {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation buttons on a page.
   */
  label: string;
};

export const SkeletonHelpButton = ({ label = '' }: SkeletonHelpButtonProps) => {
  const {
    mode: { navigation },
  } = useTheme();

  return (
    <SkeletonIconButton>
      <QuestionCircleIcon
        label={label}
        secondaryColor={navigation.backgroundColor}
      />
    </SkeletonIconButton>
  );
};
