import React from 'react';

import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { FixedToolbarCompiled } from './FixedToolbar-compiled';
import { FixedToolbarEmotion } from './FixedToolbar-emotion';
import { StickyToolbarCompiled } from './StickyToolbar-compiled';
import { StickyToolbarEmotion } from './StickyToolbar-emotion';

const StickyToolbarMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	StickyToolbarCompiled,
	StickyToolbarEmotion,
);

const FixedToolbarMigration = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	FixedToolbarCompiled,
	FixedToolbarEmotion,
);

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
			<StickyToolbarMigration
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...getStickyParameters(useStickyToolbar)}
				isEditorModernisationEnabled={isEditorModernisationEnabled}
				twoLineEditorToolbar={twoLineEditorToolbar}
				isNewToolbarEnabled={isNewToolbarEnabled}
			>
				{children}
			</StickyToolbarMigration>
		);
	}
	return (
		<FixedToolbarMigration
			isEditorModernisationEnabled={isEditorModernisationEnabled}
			twoLineEditorToolbar={twoLineEditorToolbar}
			isNewToolbarEnabled={isNewToolbarEnabled}
		>
			{children}
		</FixedToolbarMigration>
	);
};
