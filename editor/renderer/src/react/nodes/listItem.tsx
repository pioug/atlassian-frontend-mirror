import React from 'react';
export default function ListItem(props: React.PropsWithChildren<unknown>) {
	return <li>{props.children}</li>;
}
