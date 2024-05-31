import React from 'react';
import { type TextPosition, type Position } from '../types';

export const findTextString = (reactNode: React.ReactNode): string | null => {
	let result: string | null = null;

	const children = React.Children.toArray(reactNode);
	for (const childNode of children) {
		if (result) {
			break;
		} else if (typeof childNode === 'string') {
			result = childNode;
		} else if (isReactElement(childNode) && childNode.props.children) {
			result = findTextString(childNode.props.children);
		}
	}

	return result;
};

function isReactElement<P>(child: React.ReactNode): child is React.ReactElement<P> {
	return !!(child as React.ReactElement<P>).type;
}

type Offset = {
	startOffset: number;
	endOffset: number;
};

export const splitText = (text: string, { startOffset, endOffset }: Offset): string[] | null => {
	if (endOffset > text.length || endOffset - startOffset <= 0) {
		return null;
	}

	return [
		text.slice(0, startOffset),
		text.slice(startOffset, endOffset),
		text.slice(endOffset),
	].filter(Boolean);
};

export const calcTextSplitOffset = (
	position: Position,
	textPosition: TextPosition,
	text: string,
) => {
	const { start, end } = textPosition;
	const startOffset = Math.max(position.from - start, 0);
	const endOffset = Math.min(Math.abs(end - position.to - text.length), text.length);

	return {
		startOffset,
		endOffset,
	};
};
