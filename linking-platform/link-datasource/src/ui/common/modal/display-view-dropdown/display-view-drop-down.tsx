import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type DisplayViewModes } from '../../../../common/types';

import { displayViewDropDownMessages } from './messages';

const styles = cssMap({
	dropDownItemGroupStyles: {
		width: '420px',
		height: '116px',
		borderRadius: token('radius.small'),
	},
});

const InlineIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M6 10.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2.5v-3H6Zm4 0v3h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8ZM4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Z"
			clipRule="evenodd"
		/>
	</svg>
);

const ListIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Zm2-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5H7Zm2.5 3H8V8h1.5v1.5Zm6.5 0h-5V8h5v1.5Zm-6.5 3.25H8v-1.5h1.5v1.5Zm6.5 0h-5v-1.5h5v1.5ZM9.5 16H8v-1.5h1.5V16Zm6.5 0h-5v-1.5h5V16Z"
			clipRule="evenodd"
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
}: DisplayViewDropDownProps): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isTable = viewMode === 'table';
	const triggerText = isTable
		? formatMessage(displayViewDropDownMessages.viewModeListLabel)
		: formatMessage(displayViewDropDownMessages.viewModeInlineLinkLabel);

	return (
		<DropdownMenu
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button
					{...triggerProps}
					ref={triggerRef}
					iconAfter={() => <ChevronDownIcon label="" color="currentColor" size="small" />}
				>
					{triggerText}
				</Button>
			)}
			testId="datasource-modal--view-drop-down"
		>
			<Box xcss={styles.dropDownItemGroupStyles}>
				<DropdownItemGroup>
					<DropdownItem
						testId="dropdown-item-table"
						onClick={() => onViewModeChange('table')}
						isSelected={isTable}
						description={formatMessage(displayViewDropDownMessages.viewModeListDescription)}
						elemBefore={ListIcon}
					>
						<FormattedMessage {...displayViewDropDownMessages.viewModeListLabel} />
					</DropdownItem>
					<DropdownItem
						testId="dropdown-item-inline-link"
						onClick={() => onViewModeChange('inline')}
						isSelected={!isTable}
						description={formatMessage(displayViewDropDownMessages.viewModeInlineLinkDescription)}
						elemBefore={InlineIcon}
					>
						<FormattedMessage {...displayViewDropDownMessages.viewModeInlineLinkLabel} />
					</DropdownItem>
				</DropdownItemGroup>
			</Box>
		</DropdownMenu>
	);
};
