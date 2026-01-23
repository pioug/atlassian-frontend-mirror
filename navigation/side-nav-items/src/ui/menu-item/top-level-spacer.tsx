/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useLevel } from './expandable-menu-item/expandable-menu-item-context';

const styles = cssMap({
	root: {
		height: token('space.150'),
	},
});

/**
 * Use this component to create visual separation between the:
 *
 * - global app shortcut section
 * - 'more' button menu item
 * - starred spaces (in Confluence)
 *
 * Only use this component in the top level of the menu,
 * and exercise caution when using it in new situations.
 *
 * This component exists to fulfil product design requirements but has not yet
 * been consolidated into the wider navigation system.
 *
 * It may not exist in the future when global apps are no longer in the side navigation.
 */
export function TopLevelSpacer() {
	const level = useLevel();

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			if (level !== 0) {
				throw new Error(
					'TopLevelSpacer should only be used in the top level of the menu. Please speak with DST if you have a novel use case.',
				);
			}
		}
	}, [level]);

	return <div css={styles.root} />;
}
