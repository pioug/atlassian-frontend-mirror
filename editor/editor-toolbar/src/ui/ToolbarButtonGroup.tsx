/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, Fragment, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
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
			paddingInline: token('space.050'),
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
});

type ToolbarButtonGroupProps = {
	children?: ReactNode;
};

export const ToolbarButtonGroup = ({ children }: ToolbarButtonGroupProps) => {
	const items = Children.toArray(children);
	const FirstChild = items.at(0);
	const LastChild = items.at(-1);
	const middleChildren = items.slice(1, -1);

	return (
		<Box xcss={styles.container}>
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
