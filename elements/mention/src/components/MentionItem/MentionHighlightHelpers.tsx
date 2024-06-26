import React, { type ComponentType } from 'react';
import { type HighlightDetail } from '../../types';

interface Part {
	value: string;
	matches: boolean;
}

export function renderHighlight(
	ReactComponent: ComponentType<any>,
	value?: string,
	highlights?: HighlightDetail[],
	prefix?: string,
) {
	if (!value) {
		return null;
	}

	const parts: Part[] = [];
	const prefixText = prefix || '';
	let lastIndex = 0;

	if (highlights) {
		for (let i = 0; i < highlights.length; i++) {
			const h = highlights[i];
			const start = h.start;
			const end = h.end;
			if (start > lastIndex) {
				parts.push({
					value: value.substring(lastIndex, start),
					matches: false,
				});
			}
			parts.push({
				value: value.substring(start, end + 1),
				matches: true,
			});
			lastIndex = end + 1;
		}
		if (lastIndex < value.length) {
			parts.push({
				value: value.substring(lastIndex, value.length),
				matches: false,
			});
		}
	} else {
		parts.push({
			value,
			matches: false,
		});
	}

	return (
		<ReactComponent>
			{prefixText}
			{parts.map((part, index) => {
				if (part.matches) {
					return <b key={index}>{part.value}</b>;
				}
				return part.value;
			})}
		</ReactComponent>
	);
}
