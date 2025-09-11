import React from 'react';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { orderedListSelector } from '@atlaskit/adf-schema';
import { getOrderedListInlineStyles } from '@atlaskit/editor-common/styles';

import { getItemCounterDigitsSize, resolveOrder } from '@atlaskit/editor-common/utils';
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
	content?: Node[];
	localId?: string;
	order?: number;
	path?: Node[];
	start?: number;
}) {
	const extraProps: ExtraProps = {};

	const itemCounterDigitsSize = getItemCounterDigitsSize({
		order: props.order,
		itemsCount: props?.content?.length,
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
