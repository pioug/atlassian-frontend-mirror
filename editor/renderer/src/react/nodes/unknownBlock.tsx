import React from 'react';
export default function UnknownBlock(props: React.PropsWithChildren<unknown>) {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
	return <div className="UnknownBlock">{props.children}</div>;
}
