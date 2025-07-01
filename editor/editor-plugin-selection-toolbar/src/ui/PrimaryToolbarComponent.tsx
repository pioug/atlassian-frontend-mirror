/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { addLink, getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import messages, { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ArrowKeyNavigationType,
	DropdownMenu,
	ToolbarButton,
	type MenuItem,
} from '@atlaskit/editor-common/ui-menu';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import PinIcon from '@atlaskit/icon/core/pin';
import PinFilledIcon from '@atlaskit/icon/core/pin-filled';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { getOverflowPrimaryToolbarConfig } from './overflow-toolbar-config';

const DROPDOWN_WIDTH = 240;

const buttonStyles = css({
	paddingTop: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.075'),
	paddingRight: token('space.075'),
});

type Props = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
};

type PrimaryToolbarComponentNewProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	disabled?: boolean;
};
/**
 * A component used to renderer a dropdown with
 * toolbar docking options.
 */
export function PrimaryToolbarComponent({
	api,
	popupsBoundariesElement,
	popupsMountPoint,
	popupsScrollableElement,
}: Props) {
	const intl = useIntl();
	const [isOpen, setIsOpen] = useState(false);
	const items = useMemo(() => getOverflowPrimaryToolbarConfig({ api, intl }), [api, intl]);
	const content = intl.formatMessage(messages.viewMore);

	const onClick = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const onMenuItemActivated = useCallback(({ item }: { item: MenuItem }) => {
		item?.onClick?.();
	}, []);

	useEffect(() => {
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.RENDERED,
			actionSubject: ACTION_SUBJECT.TOOLBAR,
			actionSubjectId: ACTION_SUBJECT_ID.DOCKED_PRIMARY_TOOLBAR,
			eventType: EVENT_TYPE.UI,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DropdownMenu
			isOpen={isOpen}
			onOpenChange={(attrs) => setIsOpen(attrs.isOpen)}
			items={items}
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.MENU,
			}}
			boundariesElement={popupsBoundariesElement}
			mountTo={popupsMountPoint}
			scrollableElement={popupsScrollableElement}
			section={{ hasSeparator: true }}
			onItemActivated={onMenuItemActivated}
			fitWidth={DROPDOWN_WIDTH}
		>
			<ToolbarButton
				onClick={onClick}
				aria-haspopup="dialog"
				aria-keyshortcuts={getAriaKeyshortcuts(addLink)}
				aria-label={content}
				title={content}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
				css={buttonStyles}
			>
				<ShowMoreHorizontalIcon label={content} />
			</ToolbarButton>
		</DropdownMenu>
	);
}

/**
 * A component used to renderer a pin/unpin
 * button to the toolbar to the or make it in-line.
 */
export const PrimaryToolbarComponentNew = ({ api, disabled }: PrimaryToolbarComponentNewProps) => {
	const intl = useIntl();
	const mode = useSharedPluginStateSelector(api, 'connectivity.mode');
	const isOffline = mode === 'offline' || false;
	const isDockedToTop = fg('platform_editor_use_preferences_plugin')
		? api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition ===
			'top'
		: api?.selectionToolbar.sharedState.currentState()?.toolbarDocking === 'top';
	if (isDockedToTop) {
		return (
			<ToolbarButton
				aria-label={intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop)}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
				css={buttonStyles}
				disabled={disabled || isOffline}
				iconBefore={<PinFilledIcon label="" spacing="spacious" />}
				onClick={() => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				}}
				title={intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop)}
			/>
		);
	}

	return (
		<ToolbarButton
			aria-label={intl.formatMessage(selectionToolbarMessages.toolbarPositionUnpined)}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
			css={buttonStyles}
			disabled={disabled || isOffline}
			iconBefore={<PinIcon label="" spacing="spacious" />}
			onClick={() => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
			}}
			title={intl.formatMessage(selectionToolbarMessages.toolbarPositionUnpined)}
		/>
	);
};
