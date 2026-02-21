/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

type DummyProps = {
	hasMargin?: boolean;
	children?: ReactNode;
};

const styles = cssMap({
	base: {
		backgroundColor: token('color.background.neutral'),
	},
	nested: {
		backgroundColor: token('color.background.neutral.hovered'),
	},
	margin: {
		marginBlockEnd: token('space.100', '8px'),
	},
});

export const Dummy: ({ children, hasMargin }: DummyProps) => JSX.Element = ({
	children,
	hasMargin = false,
}: DummyProps) => <div css={[styles.base, hasMargin && styles.margin]}>{children}</div>;

export const DummyNested: ({ children, hasMargin }: DummyProps) => JSX.Element = ({
	children,
	hasMargin = false,
}: DummyProps) => <div css={[styles.nested, hasMargin && styles.margin]}>{children}</div>;
