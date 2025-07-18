import React from 'react';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { orderedListSelector } from '@atlaskit/adf-schema';
import { getOrderedListInlineStyles } from '@atlaskit/editor-common/styles';

import { getItemCounterDigitsSize, resolveOrder } from '@atlaskit/editor-common/utils';
import { getListIndentLevel } from '../utils/lists';
import { fg } from '@atlaskit/platform-feature-flags';

type ExtraProps = {
	'data-item-counter-digits'?: number;
	start?: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	style?: Record<string, any>;
};

export default function OrderedList(props: {
	order?: number;
	start?: number;
	path?: Node[];
	content?: Node[];
	children: React.ReactNode;
}) {
	const extraProps: ExtraProps = {};

	const itemCounterDigitsSize = getItemCounterDigitsSize({
		order: props.order,
		itemsCount: props?.content?.length,
	});
	if (
		itemCounterDigitsSize &&
		itemCounterDigitsSize > (fg('platform_editor_ol_padding_fix') ? 1 : 2)
	) {
		extraProps.style = getOrderedListInlineStyles(itemCounterDigitsSize, 'object');
	}
	if (props.order !== undefined) {
		extraProps.start = resolveOrder(props.order);
	}

	return (
		<ol
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={orderedListSelector.substr(1)}
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
