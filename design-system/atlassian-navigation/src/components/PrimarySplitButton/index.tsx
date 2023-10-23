/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import {
  UNSAFE_DIVIDER as Divider,
  UNSAFE_GET_ACTIONS as getActions,
  UNSAFE_SPLIT_BUTTON_CONTAINER as SplitButtonContainer,
  UNSAFE_SPLIT_BUTTON_CONTEXT as SplitButtonContext,
} from '@atlaskit/button/unsafe';
import { token } from '@atlaskit/tokens';

// Copied from packages/design-system/atlassian-navigation/src/components/PrimaryButton/index.tsx
const buttonBaseStyles = css({
  display: 'flex',
  height: '100%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

// Mostly copied from packages/design-system/atlassian-navigation/src/components/PrimaryButton/index.tsx
const buttonHighlightedStyles = css({
  '&:after': {
    height: 3,
    position: 'absolute',
    backgroundColor: token('color.border.selected', '#0052cc'),
    borderStartEndRadius: token('border.radius.050', '1px'),
    borderStartStartRadius: token('border.radius.050', '1px'),
    content: '""',
    insetBlockEnd: 0,
    insetInlineEnd: token('space.050', '4px'),
    insetInlineStart: token('space.050', '4px'),
  },
});

type PrimarySplitButtonProps = {
  children: ReactNode;
  isHighlighted?: boolean;
};

/**
 * TODO: Add JSDoc
 */
export const PrimarySplitButton = ({
  children,
  isHighlighted = false,
}: PrimarySplitButtonProps) => {
  const { PrimaryAction, SecondaryAction } = getActions(children);

  return (
    <div css={[buttonBaseStyles, isHighlighted && buttonHighlightedStyles]}>
      <SplitButtonContainer>
        <SplitButtonContext.Provider
          value={{
            appearance: 'navigation',
            isHighlighted,
          }}
        >
          {PrimaryAction}
          <Divider
            appearance="navigation"
            spacing="default"
            isDisabled={false}
          />
          {SecondaryAction}
        </SplitButtonContext.Provider>
      </SplitButtonContainer>
    </div>
  );
};
