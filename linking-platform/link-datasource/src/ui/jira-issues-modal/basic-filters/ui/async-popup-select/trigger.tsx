import React, { forwardRef } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import { BasicFilterFieldType } from '../../types';

import { asyncPopupSelectMessages } from './messages';

export interface PopupTriggerProps {
  filterType: BasicFilterFieldType;
  isSelected?: boolean;
  onClick?: () => void;
}

const PopupTrigger = forwardRef<HTMLElement, PopupTriggerProps>(
  ({ filterType, isSelected, onClick }, ref) => {
    return (
      <Button
        ref={ref}
        appearance="default"
        isSelected={isSelected}
        onClick={onClick}
        testId={`jlol-basic-filter-${filterType}-trigger`}
        iconAfter={<ChevronDownIcon label="" />}
      >
        <FormattedMessage {...asyncPopupSelectMessages[`${filterType}Label`]} />
      </Button>
    );
  },
);

export default PopupTrigger;
