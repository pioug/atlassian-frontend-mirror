/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { CodeBlock } from '@atlaskit/code';
import {
	getGlobalTheme,
	getTokenValue,
	ThemeMutationObserver,
	type ThemeState,
	token,
} from '@atlaskit/tokens';

const ExampleDiv = () => (
	<p
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.accent.blue.subtle'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			padding: 20,
		}}
	>
		Token used: <code>color.background.accent.blue.subtle</code>
	</p>
);

export default () => {
	const [theme, setTheme] = useState<Partial<ThemeState>>(getGlobalTheme());
	const observer = new ThemeMutationObserver((newTheme) => {
		setTheme(newTheme);
	});
	observer.observe();

	const themeName = theme?.colorMode === 'dark' ? theme.dark : theme?.light;
	const themeString = JSON.stringify(theme);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '1em' }}>
			<h1>Current theme: {themeName}</h1>
			{theme && <CodeBlock language={'js'} text={themeString} />}
			<ExampleDiv />
			<p>
				<code>getTokenValue('color.background.accent.blue.subtle')</code> ={' '}
				{getTokenValue('color.background.accent.blue.subtle')}
			</p>
		</div>
	);
};
