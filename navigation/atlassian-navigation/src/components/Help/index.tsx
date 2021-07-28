import React, { forwardRef, Ref } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { useTheme } from '../../theme';
import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';

import { HelpProps } from './types';

const HELP_NOTIFICATION_BADGE_ID =
  'atlassian-navigation-help-notification-count';

export const Help = forwardRef((props: HelpProps, ref: Ref<any>) => {
  const { badge, tooltip, ...iconButtonProps } = props;
  const {
    mode: { navigation },
  } = useTheme();

  const button = (
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

  return badge ? (
    <BadgeContainer id={HELP_NOTIFICATION_BADGE_ID} badge={badge}>
      {button}
    </BadgeContainer>
  ) : (
    button
  );
});

export default Help;
