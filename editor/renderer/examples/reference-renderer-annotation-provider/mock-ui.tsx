/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx, css } from '@emotion/react';

export function ExampleBarMenu({ children }: { children: React.ReactNode }): jsx.JSX.Element {
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

const menuItemStyles = css({});

type HighlightMenuItem = ({ children }: { children: React.ReactNode }) => jsx.JSX.Element;
type HighlightMenu = (({ children }: { children: React.ReactNode }) => jsx.JSX.Element) & {
	Item: HighlightMenuItem;
};

const exampleHighlightMenu = ({ children }: { children: React.ReactNode }): jsx.JSX.Element => {
	return <ExampleBarMenu>{children}</ExampleBarMenu>;
};

export const ExampleHighlightMenu: HighlightMenu = Object.assign(exampleHighlightMenu, {
	Item: function BarMenuItem({ children }: { children: React.ReactNode }): jsx.JSX.Element {
		return <div css={menuItemStyles}>{children}</div>;
	},
});
