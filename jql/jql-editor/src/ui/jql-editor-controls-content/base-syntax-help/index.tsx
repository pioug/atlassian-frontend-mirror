import React, { MouseEvent } from 'react';

import Button from '@atlaskit/button';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { SyntaxHelpContainer } from './styled';

type Props = {
  describedby?: string;
  isDisabled?: boolean;
  label: string;
  onClick: (e: MouseEvent<HTMLElement>) => void;
};

export const BaseSyntaxHelp = ({
  describedby,
  isDisabled,
  label,
  onClick,
}: Props) => {
  return (
    <SyntaxHelpContainer>
      <Button
        aria-describedby={describedby}
        aria-label={label}
        isDisabled={isDisabled}
        appearance={'subtle'}
        spacing={'none'}
        target={'blank'}
        href="https://confluence.atlassian.com/display/SERVICEDESKCLOUD/Advanced+searching"
        iconBefore={
          <QuestionIcon
            label={''}
            primaryColor={
              isDisabled
                ? token('color.icon.disabled', N0)
                : token('color.icon.inverse', N0)
            }
            size={'small'}
          />
        }
        onClick={onClick}
      />
    </SyntaxHelpContainer>
  );
};
