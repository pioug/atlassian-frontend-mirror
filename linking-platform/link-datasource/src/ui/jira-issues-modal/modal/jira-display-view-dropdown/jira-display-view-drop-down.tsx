/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import TableIcon from '@atlaskit/icon/glyph/table';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { IssueViewModes } from '../../../../common/types';
import { modalMessages } from '../messages';

const dropDownItemGroupStyles = xcss({
  width: '320px',
  height: '140px',
  paddingTop: token('space.050', '4px'),
  paddingBottom: token('space.050', '4px'),
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

export type JiraDisplayViewDropDownProps = {
  onViewModeChange: (value: IssueViewModes) => void;
  viewMode: IssueViewModes;
};

export const JiraDisplayViewDropDown = ({
  onViewModeChange,
  viewMode,
}: JiraDisplayViewDropDownProps) => {
  const { formatMessage } = useIntl();
  const triggerText =
    viewMode === 'issue'
      ? formatMessage(modalMessages.tableViewModeLabel)
      : formatMessage(modalMessages.inlineLinkViewModeLabel);

  return (
    <DropdownMenu
      trigger={triggerText}
      testId="jira-datasource-modal--view-drop-down"
    >
      <Box xcss={dropDownItemGroupStyles}>
        <DropdownItemGroup>
          <DropdownItem
            testId="dropdown-item-table"
            onClick={() => onViewModeChange('issue')}
            isSelected={viewMode === 'issue'}
            description={formatMessage(modalMessages.tableViewModeDescription)}
            elemBefore={<TableIcon label="table icon" />}
          >
            <FormattedMessage {...modalMessages.tableViewModeLabel} />
          </DropdownItem>
          <DropdownItem
            testId="dropdown-item-inline-link"
            onClick={() => onViewModeChange('count')}
            isSelected={viewMode === 'count'}
            description={formatMessage(
              modalMessages.inlineLinkViewModeDescription,
            )}
            elemBefore={InlineIcon}
          >
            <FormattedMessage {...modalMessages.inlineLinkViewModeLabel} />
          </DropdownItem>
        </DropdownItemGroup>
      </Box>
    </DropdownMenu>
  );
};
