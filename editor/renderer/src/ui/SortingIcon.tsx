/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme/constants';
import { N20, N30 } from '@atlaskit/theme/colors';
import { SortOrder } from '@atlaskit/editor-common/types';
import { sortingIconMessages } from '../messages';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl-next';
import { token } from '@atlaskit/tokens';

// We use data url here because of this issue:
// https://product-fabric.atlassian.net/browse/ED-8001
// Remove this workaround if Firefox has fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=1664350
// TODO: Quality ticket: https://product-fabric.atlassian.net/browse/DSP-4136
export const TableSortIconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-8-6h24v24H-8z"></path><path d="M3 8.509V1c0-.552.449-1 1-1 .552 0 1 .448 1 1V8.51l1.217-1.206a1.05 1.05 0 011.477 0 1.03 1.03 0 01.004 1.463l-.003.002-2.956 2.93a1.053 1.053 0 01-1.478 0L.305 8.767a1.03 1.03 0 01.001-1.464 1.05 1.05 0 011.477 0L3 8.508z" fill="#42526E"></path></g></svg>`,
)}`;

const TABLE_SORTING_ICON_CLASS = 'table-sorting-icon';

export enum StatusClassNames {
  ASC = 'sorting-icon-svg__asc',
  DESC = 'sorting-icon-svg__desc',
  NO_ORDER = 'sorting-icon-svg__no_order',
  SORTING_NOT_ALLOWED = 'sorting-icon-svg__not-allowed',
}

// TODO: get design to check border
const wrapperStyles = css`
  position: absolute;
  display: flex;
  height: 28px;
  width: 28px;
  margin: 6px;
  right: 0;
  top: 0;
  border: 2px solid ${token('color.border.inverse', '#fff')};
  border-radius: ${gridSize() / 2}px;
  background-color: ${token('color.background.neutral.subtle', N20)};
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${token('color.background.neutral.subtle.hovered', N30)};
  }

  &.${StatusClassNames.SORTING_NOT_ALLOWED} {
    cursor: not-allowed;
  }
`;

const tableSortingIconStyles = css`
  width: 8px;
  height: 12px;
  transition: transform 0.3s cubic-bezier(0.15, 1, 0.3, 1);
  transform-origin: 50% 50%;
  background-image: url(${TableSortIconDataUrl});

  &.${StatusClassNames.DESC} {
    transform: rotate(-180deg);
  }

  &.${TABLE_SORTING_ICON_CLASS}-inactive {
    opacity: 0.7;
  }
`;

const getClassName = (status?: SortOrder) => {
  switch (status) {
    case SortOrder.ASC:
      return StatusClassNames.ASC;
    case SortOrder.DESC:
      return StatusClassNames.DESC;
    default:
      return StatusClassNames.NO_ORDER;
  }
};

type Props = {
  isSortingAllowed: boolean;
  sortOrdered?: SortOrder;
} & WrappedComponentProps;

const getTooltipTitle = (
  intl: IntlShape,
  isSortingAllowed: boolean,
  status?: SortOrder,
): string => {
  const {
    noOrderLabel,
    ascOrderLabel,
    descOrderLabel,
    invalidLabel,
  } = sortingIconMessages;

  if (!isSortingAllowed) {
    return intl.formatMessage(invalidLabel);
  }

  switch (status) {
    case SortOrder.NO_ORDER:
      return intl.formatMessage(noOrderLabel);
    case SortOrder.ASC:
      return intl.formatMessage(ascOrderLabel);
    case SortOrder.DESC:
      return intl.formatMessage(descOrderLabel);
  }

  return '';
};

const SortingIcon = ({ isSortingAllowed, sortOrdered, intl }: Props) => {
  const activated = sortOrdered !== SortOrder.NO_ORDER;
  const wrapperClassName = !isSortingAllowed
    ? StatusClassNames.SORTING_NOT_ALLOWED
    : '';
  const content = getTooltipTitle(intl, isSortingAllowed, sortOrdered);

  return (
    <Tooltip delay={0} content={content} position="top">
      <figure css={wrapperStyles} className={wrapperClassName}>
        <div
          css={tableSortingIconStyles}
          className={`${getClassName(
            sortOrdered,
          )} ${TABLE_SORTING_ICON_CLASS}-${activated ? 'active' : 'inactive'}`}
        />
      </figure>
    </Tooltip>
  );
};

export default injectIntl(SortingIcon);
