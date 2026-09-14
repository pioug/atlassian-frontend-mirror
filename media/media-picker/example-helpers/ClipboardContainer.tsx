/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { clipboardContainerStyles } from './clipboardContainerStyles';

export const ClipboardContainer = ({
	isWindowFocused,
	children,
}: {
	isWindowFocused: boolean;
	children: ReactNode;
}): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <div css={clipboardContainerStyles({ isWindowFocused })}>{children}</div>;
};
