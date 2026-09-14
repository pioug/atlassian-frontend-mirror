/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { previewsTitleStyles } from './styles';

export const PreviewsTitle = ({ children }: { children: ReactNode }): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/use-heading -- Ignored via go/DSP-18766
	return <h1 css={previewsTitleStyles}>{children}</h1>;
};
