import React from 'react';

import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { ArrowKeyNavigationType, Dropdown } from '@atlaskit/editor-common/ui-menu';
import { akEditorFloatingPanelZIndex } from '@atlaskit/editor-shared-styles';
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
	index: number;
	numMatches: number;
	isActive: boolean;
	isReplaceable?: boolean;
	numReplaceable?: number;
	popupsMountPoint?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
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
			offset={[4, 0]}
			isOpen={isActive}
			handleEscapeKeydown={() => {
				if (isActive) {
					onCancel({ triggerMethod: TRIGGER_METHOD.KEYBOARD });
				}
			}}
			fitWidth={dropdownWidthNewDesign}
			zIndex={akEditorFloatingPanelZIndex}
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.MENU,
				disableArrowKeyNavigation: true,
			}}
		>
			<Box xcss={findReplaceWrapperStyles}>
				<FindReplace
					findText={findText}
					replaceText={replaceText}
					count={{ index, total: numMatches, totalReplaceable: numReplaceable }}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...props}
				/>
			</Box>
		</Dropdown>
	);
};

export default injectIntl(FindReplaceDropdown);
