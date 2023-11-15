import React, { forwardRef } from 'react';

import { FormattedMessage } from 'react-intl-next';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, Flex, xcss } from '@atlaskit/primitives';

import { BasicFilterFieldType, SelectOption } from '../../types';

import { asyncPopupSelectMessages } from './messages';

export interface PopupTriggerProps {
  filterType: BasicFilterFieldType;
  selectedOptions?: ReadonlyArray<SelectOption>;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const triggerButtonLabelStyles = xcss({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '150px',
});

const badgeStyles = xcss({
  marginLeft: 'space.050',
});

const PopupTrigger = forwardRef<HTMLElement, PopupTriggerProps>(
  ({ filterType, isSelected, isDisabled, onClick, selectedOptions }, ref) => {
    const [firstOption] = selectedOptions || [];
    const hasOptions = selectedOptions && selectedOptions.length > 0;

    return (
      <Button
        ref={ref}
        appearance="default"
        isSelected={isSelected || hasOptions}
        isDisabled={isDisabled}
        onClick={onClick}
        testId={`jlol-basic-filter-${filterType}-trigger`}
        iconAfter={<ChevronDownIcon label="" />}
      >
        <Flex>
          <Box xcss={triggerButtonLabelStyles}>
            <FormattedMessage
              {...asyncPopupSelectMessages[`${filterType}Label`]}
            />
            {firstOption && <>: {firstOption.label}</>}
          </Box>
          {selectedOptions && selectedOptions.length > 1 && (
            <Flex xcss={badgeStyles} alignItems="center">
              <Badge appearance="primary">+{selectedOptions.length - 1}</Badge>
            </Flex>
          )}
        </Flex>
      </Button>
    );
  },
);

export default PopupTrigger;
