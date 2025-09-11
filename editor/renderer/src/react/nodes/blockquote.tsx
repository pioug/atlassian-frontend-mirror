import React from 'react';
export default function Blockquote(props: React.PropsWithChildren<{ localId?: string }>) {
	return <blockquote data-local-id={props.localId}>{props.children}</blockquote>;
}
