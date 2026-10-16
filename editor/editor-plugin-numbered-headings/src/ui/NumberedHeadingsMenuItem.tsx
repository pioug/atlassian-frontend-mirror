import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { messages as blockTypeMessages } from '@atlaskit/editor-common/messages/block-type';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import Toggle from '@atlaskit/toggle/toggle';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { toggleFromToolbar } from '../pm-plugins/toggle-from-toolbar';
import { useIsNumberedHeadingsToggleAvailable } from './useIsNumberedHeadingsToggleAvailable';

type NumberedHeadingsMenuItemProps = {
	api?: ExtractInjectionAPI<InternalNumberedHeadingsPlugin>;
};

/**
 * `inert` keeps the Toggle out of the tab order and the accessibility tree, so the menu item's
 * `menuitemcheckbox` role and `aria-checked` are the only announcement. It's set imperatively
 * because the React 18 DOM types don't include the attribute.
 */
const makeInert = (element: HTMLSpanElement | null) => {
	element?.setAttribute('inert', '');
};

const DecorativeToggle = ({ isChecked }: { isChecked: boolean }) => (
	<span ref={makeInert}>
		<Toggle isChecked={isChecked} />
	</span>
);

export const NumberedHeadingsMenuItem = ({
	api,
}: NumberedHeadingsMenuItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const isAvailable = useIsNumberedHeadingsToggleAvailable(api);
	const enabled = useSharedPluginStateWithSelector(
		api,
		['numberedHeadings'],
		(states) => states.numberedHeadingsState?.enabled ?? false,
	);

	const onClick = useCallback(() => {
		const nextEnabled = !enabled;
		api?.core?.actions.execute(toggleFromToolbar(api, nextEnabled));
	}, [api, enabled]);

	// ToolbarDropdownItem couples aria-checked to its selected styling. Keep the row neutral
	// while exposing the toggle's state to assistive technology.
	const setMenuItemRef = useCallback(
		(element: HTMLButtonElement | null) => {
			element?.setAttribute('aria-checked', String(enabled));
		},
		[enabled],
	);

	if (!isAvailable) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			role="menuitemcheckbox"
			triggerRef={setMenuItemRef}
			onClick={onClick}
			elemAfter={<DecorativeToggle isChecked={enabled} />}
			testId="numbered-headings-menu-item"
		>
			{formatMessage(blockTypeMessages.numberedHeadings)}
		</ToolbarDropdownItem>
	);
};
