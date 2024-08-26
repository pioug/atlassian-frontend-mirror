import React from 'react';

interface Props {
	text: string;
	allowPlaceholderText?: boolean;
}

export default function Placeholder(props: Props) {
	if (props.allowPlaceholderText) {
		return <span data-placeholder={`${props.text}`}>{props.text}</span>;
	}
	return <span />;
}
