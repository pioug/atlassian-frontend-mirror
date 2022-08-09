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

/**
 * __Skeleton Notification button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Help button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
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
