import React from 'react';

import color from 'color';

import { createTheme } from '../src';

interface ThemeTokens {
	backgroundColor?: string;
	textColor?: string;
}

const Theme = createTheme<ThemeTokens, void>(() => ({
	backgroundColor: '#333',
	textColor: '#eee',
}));

const DisplayThemeColors = () => (
	<Theme.Consumer>
		{({ textColor, backgroundColor }) => (
			<div>
				<div
					style={{
						backgroundColor: textColor,
						color: `${color(textColor).negate()}`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'inline-block',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginBottom: 10,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginRight: 10,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: 10,
					}}
				>
					{textColor}
				</div>
				<div
					style={{
						backgroundColor: backgroundColor,
						color: `${color(backgroundColor).negate()}`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'inline-block',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginBottom: 10,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						marginRight: 10,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						padding: 10,
					}}
				>
					{backgroundColor}
				</div>
			</div>
		)}
	</Theme.Consumer>
);

export default () => (
	<React.Fragment>
		<DisplayThemeColors />
		<Theme.Provider value={(themeFn) => ({ ...themeFn(), backgroundColor: 'palevioletred' })}>
			<DisplayThemeColors />
		</Theme.Provider>
	</React.Fragment>
);
