import React from 'react';
import styled from 'styled-components';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import Icon from '@atlaskit/icon';
import { N500 } from '@atlaskit/theme/colors';
import SlackIcon from './SlackIcon';

const SlackButtonCopyWrapper = styled.span`
  color: ${N500};
  display: flex;
  justify-content: center;
`;

const SlackIconWrapper = styled.span`
  margin: 1px 8px 0 0;
`;

const SlackButton = (
  props: CustomThemeButtonProps & { text: React.ReactNode },
) => {
  return (
    <Button {...props}>
      <SlackButtonCopyWrapper>
        <SlackIconWrapper>
          <Icon glyph={SlackIcon} label="Slack icon" size="small" />
        </SlackIconWrapper>
        <span>{props.text}</span>
      </SlackButtonCopyWrapper>
    </Button>
  );
};
SlackButton.displayName = 'SlackButton';

export default SlackButton;
