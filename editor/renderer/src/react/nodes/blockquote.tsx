import React from 'react';
export default function Blockquote(props: React.PropsWithChildren<unknown>) {
	return <blockquote>{props.children}</blockquote>;
}
