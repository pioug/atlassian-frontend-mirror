/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useId, useState } from 'react';

import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap, jsx } from '@atlaskit/css';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { Popup } from '@atlaskit/popup/popup';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';

import { hasAvailableTableSettings } from './hasAvailableTableSettings';
import { tableSettingsMenuMessages } from './messages';

const styles = cssMap({
	menu: {
		paddingBlock: token('space.100'),
		width: '300px',
	},
	setting: {
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.050'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.150'),
	},
});

export const TableSettingsMenu = (props: TableSettingsMenuProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const [isOpen, setIsOpen] = useState(false);
	const wrapTextToggleId = useId();

	if (!hasAvailableTableSettings(props)) {
		return null;
	}

	const { wrapTextSetting } = props;
	const wrapTextLabel = formatMessage(tableSettingsMenuMessages.wrapTextOnAllColumns);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-end"
			shouldFlip
			testId="table-settings-menu"
			zIndex={layers.modal()}
			role="dialog"
			label={formatMessage(tableSettingsMenuMessages.tableSettings)}
			trigger={(triggerProps) => (
				<IconButton
					ref={triggerProps.ref}
					aria-controls={triggerProps['aria-controls']}
					aria-expanded={triggerProps['aria-expanded']}
					aria-haspopup={triggerProps['aria-haspopup']}
					icon={ShowMoreHorizontalIcon}
					isSelected={isOpen}
					isTooltipDisabled={false}
					label={formatMessage(tableSettingsMenuMessages.moreActions)}
					onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
					spacing="default"
				/>
			)}
			content={({ setInitialFocusRef }) => (
				<Box xcss={styles.menu}>
					{wrapTextSetting && (
						<Box xcss={styles.setting}>
							<Inline alignBlock="center" spread="space-between">
								<label htmlFor={wrapTextToggleId}>{wrapTextLabel}</label>
								<Toggle
									ref={(element) => {
										setInitialFocusRef(element);
									}}
									id={wrapTextToggleId}
									isChecked={wrapTextSetting.isChecked}
									onChange={wrapTextSetting.onChange}
									testId="table-settings-menu-wrap-text-toggle"
								/>
							</Inline>
						</Box>
					)}
				</Box>
			)}
		/>
	);
};
export type TableSettingsMenuProps = {
	wrapTextSetting?: {
		isChecked: boolean;
		onChange: () => void;
	};
};
