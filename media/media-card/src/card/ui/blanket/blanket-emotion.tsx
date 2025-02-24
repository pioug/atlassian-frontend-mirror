/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { blanketStyles, blanketClassName } from './styles';

export interface BlanketProps {
	isFixed?: boolean;
}

export const Blanket = (props: BlanketProps) => {
	const { isFixed } = props;

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={blanketStyles(isFixed)}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blanketClassName}
			data-testid="media-card-blanket"
		/>
	);
};
