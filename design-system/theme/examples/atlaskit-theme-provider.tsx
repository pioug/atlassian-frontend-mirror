/* eslint-disable @repo/internal/react/no-unsafe-overrides */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { ThemeProvider } from 'styled-components';

import Button from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { token } from '@atlaskit/tokens';

import { AtlaskitThemeProvider, type ThemeModes } from '../src';
import DeprecatedThemeProvider from '../src/deprecated-provider-please-do-not-use';

const LIGHT = 'light';
const DARK = 'dark';
const containerStyles = css({
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
});

const Example = () => {
	const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT);
	const toggleMode = () => {
		setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
	};
	return (
		<AtlaskitThemeProvider mode={themeMode}>
			<div data-testid="provider">
				<div css={containerStyles}>
					<DeprecatedThemeProvider mode={themeMode} provider={ThemeProvider}>
						<h1>Legacy</h1>
						<p>
							<Link href="#example">Standard anchor</Link>
						</p>
						<p>This is text in a paragraph tag.</p>
					</DeprecatedThemeProvider>
					<div>
						<h1>Only Emotion</h1>
						<p>
							<Link href="#example">Standard anchor</Link>
						</p>
						<p>This is text in a paragraph tag.</p>
					</div>
				</div>
			</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200', '16px') }}>
				<Button testId="themeSwitch" onClick={toggleMode}>
					Toggle theme
				</Button>
			</div>
		</AtlaskitThemeProvider>
	);
};

export default Example;
