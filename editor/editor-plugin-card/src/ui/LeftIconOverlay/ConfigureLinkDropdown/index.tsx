import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { token } from '@atlaskit/tokens';

export type SmallLinkDropdownProps = {
	testId: string;
};
const ConfigureLinkDropdown = (props: SmallLinkDropdownProps) => {
	const { testId } = props;

	const intl = useIntl();
	const configureLinkLabel: string = intl.formatMessage(messages.inlineConfigureLink);
	const goToLinkLabel: string = intl.formatMessage(messages.inlineConfigureLink);

	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={({ triggerRef, ...props }) => (
				<Button {...props} spacing={'none'} ref={triggerRef}>
					<span style={{ padding: `0 ${token('space.025', '2px')}` }}>
						<ChevronDownIcon label={configureLinkLabel} size={'small'} testId={`${testId}-icon`} />
					</span>
				</Button>
			)}
			spacing={'compact'}
			placement={'bottom-start'}
		>
			<DropdownItemGroup>
				<DropdownItem elemBefore={<ShortcutIcon label={goToLinkLabel} size={'small'} />}>
					{goToLinkLabel}
				</DropdownItem>
				<DropdownItem elemBefore={<PreferencesIcon label={configureLinkLabel} size={'small'} />}>
					{configureLinkLabel}
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default ConfigureLinkDropdown;
