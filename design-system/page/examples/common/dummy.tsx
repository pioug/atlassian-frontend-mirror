/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type DummyProps = {
	hasMargin?: boolean;
	children?: ReactNode;
};

const dummyStyles = {
	base: css({
		background: token('color.background.neutral'),
	}),
	nested: css({
		background: token('color.background.neutral.hovered'),
	}),
	margin: css({
		marginBlockEnd: token('space.100', '8px'),
	}),
};

export const Dummy = ({ children, hasMargin = false }: DummyProps) => (
	<div css={[dummyStyles.base, hasMargin && dummyStyles.margin]}>{children}</div>
);

export const DummyNested = ({ children, hasMargin = false }: DummyProps) => (
	<div css={[dummyStyles.nested, hasMargin && dummyStyles.margin]}>{children}</div>
);
