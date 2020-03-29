import React, { ReactNode } from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import {
  ActionsContainer,
  ActionsItem,
  ErrorIcon,
} from '../styled/FooterStyles';

interface Props {
  actions?: Array<ReactNode>;
  errorActions?: Array<ReactNode>;
  errorIconLabel?: string;
  isError?: boolean;
  isSaving?: boolean;
}

const mapActions = (items: React.ReactNode[]) =>
  items.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ActionsItem key={index}>{item}</ActionsItem>
  ));

const FooterItems = ({
  actions,
  errorActions,
  errorIconLabel,
  isError,
  isSaving,
}: Props) => {
  if (isSaving || (!actions && !errorActions)) return null;

  const items = isError
    ? errorActions && mapActions(errorActions)
    : actions && mapActions(actions);

  return (
    <ActionsContainer>
      {isError ? (
        <ErrorIcon>
          <WarningIcon label={errorIconLabel ? errorIconLabel : ''} />
        </ErrorIcon>
      ) : null}
      {items}
    </ActionsContainer>
  );
};

export default FooterItems;
