/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type ReactNode } from 'react';
import {
	controlLabelStyles,
	editableBoxStyles,
	pureComponentBoxStyles,
	separatorStyles,
} from './styles';

export const ControlLabel = ({
	children,
	htmlFor,
}: {
	children: ReactNode;
	htmlFor?: string | undefined;
}): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<label css={controlLabelStyles} htmlFor={htmlFor}>
		{children}
	</label>
);

export const EditableBox = ({ grow, children }: { grow?: number; children: ReactNode }): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<div css={editableBoxStyles({ grow })}>{children}</div>
);

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
export const Separator = (): React.JSX.Element => <hr role="presentation" css={separatorStyles} />;

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
export const PureComponentBox = (): React.JSX.Element => <div css={pureComponentBoxStyles} />;
