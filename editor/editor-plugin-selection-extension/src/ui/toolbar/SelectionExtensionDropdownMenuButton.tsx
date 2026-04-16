import React from 'react';

import { injectIntl } from 'react-intl';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';

import { selectionExtensionMessages } from '@atlaskit/editor-common/messages';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import AppsIcon from '@atlaskit/icon/core/apps';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

type SelectionExtensionDropdownMenuButtonProps = React.ComponentProps<typeof ToolbarButton> &
	WrappedComponentProps;
const SelectionExtensionDropdownMenuButtonComponent = ({
	onClick,
	selected,
	'aria-expanded': ariaExpanded,
	intl,
}: SelectionExtensionDropdownMenuButtonProps) => {
	return (
		<ToolbarButton
			testId="selection-extension-dropdown-button"
			aria-label={intl.formatMessage(
				selectionExtensionMessages.selectionExtensionDropdownButtonLabel,
			)}
			aria-haspopup="true"
			spacing="compact"
			title={intl.formatMessage(selectionExtensionMessages.selectionExtensionDropdownButtonLabel)}
			onClick={onClick}
			aria-expanded={ariaExpanded}
			selected={selected}
			iconAfter={
				<ChevronDownIcon
					spacing="none"
					label={intl.formatMessage(
						selectionExtensionMessages.selectionExtensionDropdownButtonLabel,
					)}
					size="small"
				/>
			}
		>
			<AppsIcon
				label={intl.formatMessage(selectionExtensionMessages.selectionExtensionDropdownButtonLabel)}
				spacing="none"
			/>
		</ToolbarButton>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const SelectionExtensionDropdownMenuButton: React.FC<
	WithIntlProps<SelectionExtensionDropdownMenuButtonProps>
> & {
	WrappedComponent: React.ComponentType<SelectionExtensionDropdownMenuButtonProps>;
} = injectIntl(SelectionExtensionDropdownMenuButtonComponent);
