import React, { forwardRef, Ref } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { useTheme } from '../../theme';
import { IconButton } from '../IconButton';

import { HelpProps } from './types';

export const Help = forwardRef((props: HelpProps, ref: Ref<any>) => {
  const { tooltip, ...iconButtonProps } = props;
  const {
    mode: { navigation },
  } = useTheme();

  return (
    <IconButton
      icon={
        <QuestionCircleIcon
          label={typeof tooltip === 'string' ? tooltip : 'Help Icon'}
          secondaryColor={navigation.backgroundColor}
        />
      }
      ref={ref}
      tooltip={tooltip}
      {...iconButtonProps}
    />
  );
});

export default Help;
