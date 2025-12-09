import React from 'react';
import { RendererCssClassName } from '../../consts';
import { useSelectAllTrap } from '../utils/use-select-all-trap';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Doc(props: any): React.JSX.Element {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	return <div className={RendererCssClassName.DOCUMENT}>{props.children}</div>;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DocWithSelectAllTrap(props: any): React.JSX.Element {
	return (
		<div
			ref={useSelectAllTrap<HTMLDivElement>()}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={RendererCssClassName.DOCUMENT}
		>
			{props.children}
		</div>
	);
}
