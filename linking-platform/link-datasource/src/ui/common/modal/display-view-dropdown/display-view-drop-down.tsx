/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import TableIcon from '@atlaskit/icon/glyph/table';
import { Box, xcss } from '@atlaskit/primitives';

import { DisplayViewModes } from '../../../../common/types';

import { displayViewDropDownMessages } from './messages';

const dropDownItemGroupStyles = xcss({
  width: '320px',
  height: '140px',
  paddingTop: 'space.050',
  paddingBottom: 'space.050',
  borderRadius: 'border.radius',
});

const InlineIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 9C2.89543 9 2 9.67155 2 10.5V13.5C2 14.3285 2.89543 15 4 15H20C21.1046 15 22 14.3285 22 13.5V10.5C22 9.67155 21.1046 9 20 9H4ZM4.22222 11.25C4.22222 10.5 4.22222 10.5 5 10.5H7C7.55556 10.5 7.55556 10.5 7.55556 11.25V13C7.55556 13.5 7.55556 13.5 7 13.5H5C4.22222 13.5 4.22222 13.5 4.22222 13V11.25ZM9 12C9 11.7929 9.2239 11.625 9.5 11.625H19.5C19.7761 11.625 20 11.7929 20 12C20 12.2071 19.7761 12.375 19.5 12.375H9.5C9.2239 12.375 9 12.2071 9 12Z"
      fill={'currentColor'}
    />
  </svg>
);

export type DisplayViewDropDownProps = {
  onViewModeChange: (value: DisplayViewModes) => void;
  viewMode: DisplayViewModes;
};

export const DisplayViewDropDown = ({
  onViewModeChange,
  viewMode,
}: DisplayViewDropDownProps) => {
  const { formatMessage } = useIntl();
  // TODO: further refactoring in EDM-9573
  // temporary fix. transition 'count' to 'inline', 'issue' to 'table'
  const isJira = viewMode === 'issue' || viewMode === 'count';
  const isTable = viewMode === 'table' || viewMode === 'issue';
  const triggerText = isTable
    ? formatMessage(
        // TODO EDM-9573, remove once EDM-9431 is merged
        isJira
          ? displayViewDropDownMessages.tableViewModeLabel
          : displayViewDropDownMessages.tableViewModeLabelDuplicate,
      )
    : formatMessage(
        // TODO EDM-9573, remove once EDM-9431 is merged
        isJira
          ? displayViewDropDownMessages.inlineLinkViewModeLabel
          : displayViewDropDownMessages.inlineLinkViewModeLabelDuplicate,
      );

  return (
    <DropdownMenu
      trigger={triggerText}
      testId="datasource-modal--view-drop-down"
    >
      <Box xcss={dropDownItemGroupStyles}>
        <DropdownItemGroup>
          <DropdownItem
            testId="dropdown-item-table"
            onClick={() => onViewModeChange(isJira ? 'issue' : 'table')}
            isSelected={isTable}
            description={formatMessage(
              // TODO EDM-9573, remove once EDM-9431 is merged
              isJira
                ? displayViewDropDownMessages.tableViewModeDescription
                : displayViewDropDownMessages.tableViewModeDescriptionDuplicate,
            )}
            elemBefore={<TableIcon label="table icon" />}
          >
            <FormattedMessage
              // TODO EDM-9573, remove once EDM-9431 is merged
              {...(isJira
                ? displayViewDropDownMessages.tableViewModeLabel
                : displayViewDropDownMessages.tableViewModeLabelDuplicate)}
            />
          </DropdownItem>
          <DropdownItem
            testId="dropdown-item-inline-link"
            onClick={() => onViewModeChange(isJira ? 'count' : 'inline')}
            isSelected={!isTable}
            description={formatMessage(
              // TODO EDM-9573, remove once EDM-9431 is merged
              isJira
                ? displayViewDropDownMessages.inlineLinkViewModeDescription
                : displayViewDropDownMessages.inlineLinkViewModeDescriptionDuplicate,
            )}
            elemBefore={InlineIcon}
          >
            <FormattedMessage
              // TODO EDM-9573, remove once EDM-9431 is merged
              {...(isJira
                ? displayViewDropDownMessages.inlineLinkViewModeLabel
                : displayViewDropDownMessages.inlineLinkViewModeLabelDuplicate)}
            />
          </DropdownItem>
        </DropdownItemGroup>
      </Box>
    </DropdownMenu>
  );
};
