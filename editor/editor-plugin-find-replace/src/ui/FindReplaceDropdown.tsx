import React from 'react';

import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { ArrowKeyNavigationType, Dropdown } from '@atlaskit/editor-common/ui-menu';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import type { FindReplaceProps } from './FindReplace';
import FindReplace from './FindReplace';

const findReplaceWrapperStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
});

// Magic number taken from ../FindReplaceToolbarButton.tsx
const dropdownWidthNewDesign = 382;

export interface FindReplaceDropdownProps extends Omit<FindReplaceProps, 'count'> {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	index: number;
	isActive: boolean;
	isReplaceable?: boolean;
	numMatches: number;
	numReplaceable?: number;
	popupsMountPoint?: HTMLElement;
}

const FindReplaceDropdown = (props: FindReplaceDropdownProps & WrappedComponentProps) => {
	const {
		findText,
		replaceText,
		isActive,
		index,
		numMatches,
		popupsMountPoint,
		numReplaceable,
		onCancel,
	} = props;

	if (!popupsMountPoint) {
		return null;
	}

	return (
		<Dropdown
			target={popupsMountPoint}
			mountTo={popupsMountPoint}
			forcePlacement={true}
			alignX={'right'}
			alignY={'start'}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			offset={[4, 0]}
			isOpen={isActive}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			handleEscapeKeydown={() => {
				if (isActive) {
					onCancel({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
				}
			}}
			fitWidth={dropdownWidthNewDesign}
			zIndex={akEditorFloatingPanelZIndex}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.MENU,
				disableArrowKeyNavigation: true,
			}}
		>
			<Box xcss={findReplaceWrapperStyles}>
				<FindReplace
					findText={findText}
					replaceText={replaceText}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					count={{ index, total: numMatches, totalReplaceable: numReplaceable }}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
				/>
			</Box>
		</Dropdown>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<FindReplaceDropdownProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<FindReplaceDropdownProps & WrappedComponentProps>;
} = injectIntl(FindReplaceDropdown);
export default _default_1;
