import React from 'react';

import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';

import { FixedToolbarCompiled } from './FixedToolbar-compiled';
import { StickyToolbarCompiled } from './StickyToolbar-compiled';

/**
 * ED-15802: Scenarios when a sticky bar is used:
 * 1. useStickyToolbar is true
 * 2. useStickyToolbar is a DOM element
 * 3. useStickyToolbar is an object and has offsetTop key;
 */
const getStickyParameters = (configuration: UseStickyToolbarType) => {
	// const isUsingStickyOffset, isHTMLElement is used so TS can properly infer types.
	const isHTMLElement = typeof configuration === 'object' && !('offsetTop' in configuration);
	const isUsingStickyOffset = typeof configuration === 'object' && 'offsetTop' in configuration;

	if (typeof configuration !== 'object') {
		return { externalToolbarRef: undefined, offsetTop: undefined };
	}
	if (isUsingStickyOffset) {
		return { offsetTop: configuration.offsetTop };
	}
	if (isHTMLElement) {
		return {
			externalToolbarRef: configuration,
		};
	}
};

type MainToolbarProps = {
	children?: React.ReactNode;
	isEditorModernisationEnabled?: boolean;
	isNewToolbarEnabled?: boolean;
	twoLineEditorToolbar?: boolean;
	useStickyToolbar?: UseStickyToolbarType;
};

export const MainToolbar = ({
	useStickyToolbar,
	twoLineEditorToolbar,
	children,
	isEditorModernisationEnabled,
	isNewToolbarEnabled,
}: MainToolbarProps): React.JSX.Element => {
	if (useStickyToolbar) {
		return (
			<StickyToolbarCompiled
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...getStickyParameters(useStickyToolbar)}
				isEditorModernisationEnabled={isEditorModernisationEnabled}
				twoLineEditorToolbar={twoLineEditorToolbar}
				isNewToolbarEnabled={isNewToolbarEnabled}
			>
				{children}
			</StickyToolbarCompiled>
		);
	}
	return (
		<FixedToolbarCompiled
			isEditorModernisationEnabled={isEditorModernisationEnabled}
			twoLineEditorToolbar={twoLineEditorToolbar}
			isNewToolbarEnabled={isNewToolbarEnabled}
		>
			{children}
		</FixedToolbarCompiled>
	);
};
