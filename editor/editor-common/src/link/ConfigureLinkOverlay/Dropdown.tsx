/** @jsx jsx */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import DropdownMenu, {
	DropdownItem,
	DropdownItemGroup,
	type OnOpenChangeArgs,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { cardMessages as messages } from '../../messages';

import { StyledButton } from './StyledButton';

export type OnDropdownChange = (isOpen: boolean) => void;

export type DropdownProps = {
	testId: string;
	onDropdownChange?: OnDropdownChange;
};

const Dropdown = ({ testId, onDropdownChange }: DropdownProps) => {
	const { formatMessage } = useIntl();
	const configureLinkLabel: string = formatMessage(messages.inlineConfigureLink);
	const goToLinkLabel: string = formatMessage(messages.inlineGoToLink);

	const onOpenChange: (args: OnOpenChangeArgs) => void = useCallback(
		({ isOpen }) => {
			onDropdownChange?.(isOpen);
		},
		[onDropdownChange],
	);

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
			onOpenChange={onOpenChange}
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
