/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { cardMessages as messages } from '../../messages';

import { StyledButton } from './StyledButton';

export type DropdownProps = {
	testId: string;
};

const Dropdown = ({ testId }: DropdownProps) => {
	const { formatMessage } = useIntl();
	const configureLinkLabel: string = formatMessage(messages.inlineConfigureLink);
	const goToLinkLabel: string = formatMessage(messages.inlineGoToLink);

	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={({ triggerRef, ...props }) => (
				<StyledButton
					innerRef={triggerRef}
					{...props}
					iconBefore={<ChevronDownIcon label={configureLinkLabel} size={'small'} />}
				/>
			)}
			testId={`${testId}-dropdown`}
		>
			<DropdownItemGroup>
				<DropdownItem elemBefore={<ShortcutIcon label={goToLinkLabel} size={'medium'} />}>
					{goToLinkLabel}
				</DropdownItem>
				<DropdownItem elemBefore={<PreferencesIcon label={configureLinkLabel} size={'medium'} />}>
					{configureLinkLabel}
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default Dropdown;
