import React from 'react';

export default function Indent(props) {
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	return <div style={{ paddingLeft: '1.3em' }}>{props.children}</div>;
}
