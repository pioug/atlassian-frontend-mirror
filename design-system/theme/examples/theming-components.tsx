/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { type FC, useCallback, useState } from 'react';

import { createTheme, type ThemeProp } from '../src';

interface LocalThemeProps {
	isHovered: boolean;
}

interface ThemeTokens {
	backgroundColor: string;
	textColor: string;
}

const defaultButtonTheme = (props: LocalThemeProps) => ({
	backgroundColor: props.isHovered ? '#ddd' : '#eee',
	textColor: '#333',
});

const contextButtonTheme: ThemeProp<ThemeTokens, LocalThemeProps> = (theme, props) => {
	return {
		...theme(props),
		backgroundColor: props.isHovered ? 'rebeccapurple' : 'palevioletred',
		textColor: props.isHovered ? '#fff' : 'papayawhip',
	};
};

const propButtonTheme: ThemeProp<ThemeTokens, LocalThemeProps> = (theme, props) => {
	return {
		...theme(props),
		backgroundColor: props.isHovered ? 'palevioletred' : 'rebeccapurple',
	};
};

const Theme = createTheme<ThemeTokens, LocalThemeProps>(defaultButtonTheme);

interface ButtonProps {
	children?: React.ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	theme?: ThemeProp<ThemeTokens, LocalThemeProps>;
}

const Button: FC<ButtonProps> = ({ children, theme }) => {
	const [isHovered, setIsHovered] = useState(false);
	const onMouseEnter = useCallback(() => setIsHovered(true), []);
	const onMouseLeave = useCallback(() => setIsHovered(false), []);
	return (
		<Theme.Provider value={theme}>
			<Theme.Consumer isHovered={isHovered}>
				{(tokens) => {
					const { backgroundColor, textColor: color } = tokens;
					return (
						<button
							onMouseEnter={onMouseEnter}
							onMouseLeave={onMouseLeave}
							style={{
								backgroundColor,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								border: 0,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								borderRadius: 3,
								color,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								cursor: 'pointer',
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								marginBottom: 10,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								marginRight: 10,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								padding: 10,
							}}
							type="button"
						>
							{children}
						</button>
					);
				}}
			</Theme.Consumer>
		</Theme.Provider>
	);
};

export default () => (
	<>
		<Button>Default</Button>
		<Theme.Provider value={contextButtonTheme}>
			<Button>Context</Button>
			<Button theme={propButtonTheme}>Custom</Button>
		</Theme.Provider>
	</>
);
