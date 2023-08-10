/** @jsx jsx */
import { jsx } from '@emotion/react';
import { flexibleBlockCardStyle } from '../styled';
import { FlexibleBlockCardProps } from '../types';

export const withFlexibleUIBlockCardStyle =
  (FlexibleBlockCardView: React.FC<FlexibleBlockCardProps>) =>
  (props: FlexibleBlockCardProps) => {
    return (
      <div css={flexibleBlockCardStyle}>
        <FlexibleBlockCardView {...props} />
      </div>
    );
  };
