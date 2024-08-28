/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

export function ExampleBarMenu({ children }: { children: React.ReactNode }) {
	return <menu css={menuStyles}>{children}</menu>;
}

const menuStyles = css({
	display: 'flex',
	flexDirection: 'row',
	gap: '20px',
	padding: 0,
	margin: 0,
	border: '1px solid grey',
});

ExampleHighlightMenu.Item = function BarMenuItem({ children }: { children: React.ReactNode }) {
	return <div css={menuItemStyles}>{children}</div>;
};
const menuItemStyles = css({});

export function ExampleHighlightMenu({ children }: { children: React.ReactNode }) {
	return <ExampleBarMenu>{children}</ExampleBarMenu>;
}
