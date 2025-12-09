import React from 'react';
export default function ListItem(props: React.PropsWithChildren<unknown>): React.JSX.Element {
	return <li>{props.children}</li>;
}
