/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
import React, { type ReactNode } from 'react';

type TerminalTextDisplayProps = {
	children: ReactNode;
};

export const TerminalTextDisplay: React.FC<TerminalTextDisplayProps> = ({
	children,
}): React.ReactElement | null => (
	<div
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			backgroundColor: '#000000',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			color: '#33FF00',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			borderRadius: 5,
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			padding: 20,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			fontFamily: 'Courier New, monospace',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			lineHeight: '1.4',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			maxWidth: 600,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			width: '100%',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			fontSize: '1.1em',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			whiteSpace: 'pre-wrap',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			overflow: 'auto',
		}}
	>
		{children}
	</div>
);
