import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import { Flex, Inline, xcss } from '@atlaskit/primitives';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { asyncPopupSelectMessages } from './messages';

export interface PopupFooterProps {
  currentDisplayCount: number;
  totalCount: number;
  filterName: string;
}

const footerContainerStyles = xcss({
  paddingTop: 'space.050',
  paddingBottom: 'space.050',
  borderTop: `${token('color.border', N40)} solid 1px`,
});

const footerPaginationInfoStyles = xcss({
  color: 'color.text.subtlest',
  marginBlock: 'space.100',
  marginInline: 'space.150',
});

const PopupFooter = ({
  currentDisplayCount,
  totalCount,
  filterName,
}: PopupFooterProps) => {
  return (
    <Flex
      testId={`${filterName}--footer`}
      direction="row"
      alignItems="center"
      justifyContent="end"
      xcss={footerContainerStyles}
    >
      <Inline xcss={footerPaginationInfoStyles}>
        <FormattedMessage
          {...asyncPopupSelectMessages.paginationDetails}
          values={{ currentDisplayCount, totalCount }}
        />
      </Inline>
    </Flex>
  );
};

export default PopupFooter;
