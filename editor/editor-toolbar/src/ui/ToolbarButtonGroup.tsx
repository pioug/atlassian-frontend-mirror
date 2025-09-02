/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, Fragment, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
	},
	firstChild: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			borderTopRightRadius: 0,
			borderBottomRightRadius: 0,
			paddingInline: token('space.075'),
		},
	},
	lastChild: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,
			paddingInline: token('space.075'),
		},
	},
	firstChildNew: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-toolbar-component="button"]': {
			borderTopRightRadius: 0,
			borderBottomRightRadius: 0,
			paddingInline: token('space.075'),
		},
	},
	lastChildNew: {
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

export const ToolbarButtonGroup = ({ children }: ToolbarButtonGroupProps) => {
	const items = Children.toArray(children);
	const FirstChild = items.at(0);
	const LastChild = items.at(-1);
	const middleChildren = items.slice(1, -1);

	const isToolbarPatch2Enabled = expValEquals(
		'platform_editor_toolbar_aifc_patch_2',
		'isEnabled',
		true,
	);

	return isToolbarPatch2Enabled ? (
		<Box xcss={styles.container} data-toolbar-component="button-group">
			{items.length <= 1 ? (
				children
			) : (
				<Fragment>
					<div css={styles.firstChildNew}>{FirstChild}</div>
					{middleChildren}
					<div css={styles.lastChildNew}>{LastChild}</div>
				</Fragment>
			)}
		</Box>
	) : (
		<Box xcss={styles.container} data-toolbar-component="button-group">
			{items.length <= 1 ? (
				children
			) : (
				<Fragment>
					<div css={styles.firstChild}>{FirstChild}</div>
					{middleChildren}
					<div css={styles.lastChild}>{LastChild}</div>
				</Fragment>
			)}
		</Box>
	);
};
