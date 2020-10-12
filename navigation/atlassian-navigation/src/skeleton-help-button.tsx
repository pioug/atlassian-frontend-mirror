import React from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { SkeletonIconButton } from './components/SkeletonIconButton';
import { useTheme } from './theme';

export const SkeletonHelpButton = ({ label = '' }: { label: string }) => {
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
