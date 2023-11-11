import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';

import { asyncPopupSelectMessages } from './messages';

type ShowMoreButtonProps = {
  onShowMore: () => void;
};

const ShowMoreButton = ({ onShowMore }: ShowMoreButtonProps) => {
  const { formatMessage } = useIntl();
  return (
    <Button
      onClick={onShowMore}
      appearance="link"
      testId="jlol-basic-filter-popup-select--show-more-button"
    >
      {formatMessage(asyncPopupSelectMessages.showMoreMessage)}
    </Button>
  );
};

export default ShowMoreButton;
