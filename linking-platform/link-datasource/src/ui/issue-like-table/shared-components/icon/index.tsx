import React from 'react';

import { cssMap } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';

import { SharedIconComponentOld } from './icon-old';

const styles = cssMap({
	labelStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	},
});

interface SharedIconComponentProps {
	/**
	 * URL or SVG for the priority icon
	 */
	iconUrl: string;
	/**
	 * Text that labels the icon. Will not be capitalised.
	 */
	text?: string;
	/**
	 * Label.
	 * Used for icon alt.
	 */
	label?: string;

	testId: string;
}

/**
 * Renders a icon and text label.
 * If the text is undefined, will not render the text label.
 */
export function SharedIconComponentNew({ iconUrl, label, text, testId }: SharedIconComponentProps) {
	return (
		<Flex gap="space.100" alignItems="center" testId={testId}>
			<Inline>
				<img
					src={iconUrl}
					alt={label}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ minWidth: '24px', maxWidth: '24px' }} // having just width: '24px' shrinks it when table width is reduced
				/>
			</Inline>
			{text && (
				<Box xcss={styles.labelStyles} testId={`${testId}-text`}>
					{text}
				</Box>
			)}
		</Flex>
	);
}

export function SharedIconComponent(props: SharedIconComponentProps) {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <SharedIconComponentNew {...props} />;
	} else {
		return <SharedIconComponentOld {...props} />;
	}
}
