/** @jsx jsx */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { withAnalyticsContext } from '@atlaskit/analytics-next';
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
import { useLinkOverlayAnalyticsEvents } from './useLinkOverlayAnalyticsEvents';

const SMALL_LINK_TOOLBAR_ANALYTICS_SOURCE = 'smallLinkToolbar';

export type OnDropdownChange = (isOpen: boolean) => void;

export type DropdownProps = {
	/** Callback fired when the Configure dropdown item is clicked */
	onConfigureClick: () => void;
	/** Callback fired when the dropdown is open or close */
	onDropdownChange?: OnDropdownChange;
	testId: string;
};

const Dropdown = ({
	onConfigureClick: onConfigureClickCallback,
	onDropdownChange,
	testId,
}: DropdownProps) => {
	const { formatMessage } = useIntl();
	const configureLinkLabel: string = formatMessage(messages.inlineConfigureLink);
	const goToLinkLabel: string = formatMessage(messages.inlineGoToLink);

	const { fireActionClickEvent, fireLinkClickEvent, fireToolbarViewEvent } =
		useLinkOverlayAnalyticsEvents();

	const onOpenChange: (args: OnOpenChangeArgs) => void = useCallback(
		({ isOpen }) => {
			onDropdownChange?.(isOpen);

			if (isOpen) {
				fireToolbarViewEvent();
			}
		},
		[fireToolbarViewEvent, onDropdownChange],
	);

	const onGoToLinkClick = useCallback(() => {
		fireActionClickEvent('goToLink');
	}, [fireActionClickEvent]);

	const onConfigureClick = useCallback(() => {
		fireActionClickEvent('configureLink');
		onConfigureClickCallback?.();
	}, [fireActionClickEvent, onConfigureClickCallback]);

	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={({ onClick, triggerRef, ...props }) => (
				<StyledButton
					innerRef={triggerRef}
					{...props}
					iconBefore={<ChevronDownIcon label={configureLinkLabel} size={'small'} />}
					onClick={(e) => {
						onClick?.(e);
						fireLinkClickEvent();
					}}
				/>
			)}
			testId={`${testId}-dropdown`}
			onOpenChange={onOpenChange}
		>
			<DropdownItemGroup>
				<DropdownItem
					elemBefore={<ShortcutIcon label={goToLinkLabel} size={'medium'} />}
					onClick={onGoToLinkClick}
				>
					{goToLinkLabel}
				</DropdownItem>
				<DropdownItem
					elemBefore={<PreferencesIcon label={configureLinkLabel} size={'medium'} />}
					onClick={onConfigureClick}
					testId={`${testId}-dropdown-item-configure`}
				>
					{configureLinkLabel}
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default withAnalyticsContext({ source: SMALL_LINK_TOOLBAR_ANALYTICS_SOURCE })(Dropdown);
