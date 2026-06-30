/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, Fragment } from 'react';
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		gap: token('space.025'),
		// if a button is hovered,apply the hover styles to the other buttons in the ToolbarButtonGroup
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-toolbar-component="button"]:not([aria-pressed="true"]):not([disabled]):hover) [data-toolbar-component="button"]:not([aria-pressed="true"]):not([disabled]):not(:hover)':
			{
				backgroundColor: token('color.background.neutral.subtle.hovered'),
			},
	},
	containerWithA11yToolbarFixes: {
		display: 'flex',
		gap: token('space.025'),
		// if a button is hovered,apply the hover styles to the other buttons in the ToolbarButtonGroup
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:has([data-toolbar-component="button"]:not([data-selected="true"]):not([disabled]):hover) [data-toolbar-component="button"]:not([data-selected="true"]):not([disabled]):not(:hover)':
			{
				backgroundColor: token('color.background.neutral.subtle.hovered'),
			},
	},
	firstChild: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-toolbar-component="button"]': {
			borderTopRightRadius: 0,
			borderBottomRightRadius: 0,
			paddingInline: token('space.075'),
		},
	},
	lastChild: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-toolbar-component="button"]': {
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,
			paddingInline: token('space.075'),
		},
	},
});

type ToolbarButtonGroupProps = {
	children?: ReactNode;
};

export const ToolbarButtonGroup = ({ children }: ToolbarButtonGroupProps): JSX.Element => {
	const items = Children.toArray(children);
	//  The .at() method is a relatively newer JavaScript API (ES2022) that isn't supported in older browsers
	//  Using items[i] is more compatible with older browsers.
	const firstChild = items[0];
	const lastChild = items[items.length - 1];
	const middleChildren = items.slice(1, -1);

	return (
		<Box
			xcss={
				expValEquals('jira_editor_a11y_toolbar_fixes', 'isEnabled', true)
					? styles.containerWithA11yToolbarFixes
					: styles.container
			}
			data-toolbar-component="button-group"
		>
			{items.length <= 1 ? (
				children
			) : (
				<Fragment>
					<div css={styles.firstChild}>{firstChild}</div>
					{middleChildren}
					<div css={styles.lastChild}>{lastChild}</div>
				</Fragment>
			)}
		</Box>
	);
};
