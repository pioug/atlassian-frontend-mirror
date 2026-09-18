import React from 'react';

import { orderedListSelector } from '@atlaskit/adf-schema/ordered-list';
import { getOrderedListInlineStyles } from '@atlaskit/editor-common/styles';
import { getItemCounterDigitsSize, resolveOrder } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import type { NodeContent } from '../types';
import { getListIndentLevel } from '../utils/lists';

type ExtraProps = {
	'data-item-counter-digits'?: number;
	start?: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	style?: Record<string, any>;
};

export default function OrderedList(props: {
	children: React.ReactNode;
	getContent?: () => NodeContent | undefined;
	localId?: string;
	order?: number;
	path?: Node[];
	start?: number;
}): React.JSX.Element {
	const extraProps: ExtraProps = {};

	// Item count drives the marker column width, so losing it narrows the gutter by a digit.
	const itemsCount = props.getContent?.()?.length;

	const itemCounterDigitsSize = getItemCounterDigitsSize({
		order: props.order,
		itemsCount,
	});
	if (itemCounterDigitsSize && itemCounterDigitsSize > 1) {
		extraProps.style = getOrderedListInlineStyles(itemCounterDigitsSize, 'object');
	}
	if (props.order !== undefined) {
		extraProps.start = resolveOrder(props.order);
	}

	return (
		<ol
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={orderedListSelector.substr(1)}
			data-local-id={props.localId}
			data-indent-level={props.path ? getListIndentLevel(props.path) : 1}
			start={props.start}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...extraProps}
		>
			{props.children}
		</ol>
	);
}
