import React, { FC, ReactNode } from 'react';

import { UNSAFE_Inline as Inline } from '@atlaskit/ds-explorations';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface FooterProps {
  actions?: Array<ReactNode>;
  errorActions?: Array<ReactNode>;
  errorIconLabel?: string;
  isError?: boolean;
  isSaving?: boolean;
  testId?: string;
}

/**
 * __Footer items__
 *
 * The footer items in the comment. Usually reserved for error messages.
 *
 * @internal
 */
const Footer: FC<FooterProps> = ({
  actions = [],
  errorActions = [],
  errorIconLabel,
  isError,
  isSaving,
  testId,
}) => {
  if (isSaving || !(actions.length || errorActions.length)) {
    return null;
  }

  const items = isError ? errorActions : actions;

  return (
    <Inline
      alignItems="center"
      flexWrap="wrap"
      testId={testId}
      gap="scale.100"
      divider="·"
    >
      {isError && (
        <WarningIcon
          primaryColor={token('color.text.warning', Y500)}
          label={errorIconLabel ? errorIconLabel : ''}
        />
      )}
      {items.map((item, key) => Object.assign({}, item, { key }))}
    </Inline>
  );
};

Footer.displayName = 'CommentFooter';

export default Footer;
