import React from 'react';

import { useIntl } from 'react-intl-next';

import { Date } from '@atlaskit/date';
import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';

import { setDatePickerAt } from '../pm-plugins/actions';

import { getDateInformation } from './utils';

export function DateNodeView(props: InlineNodeViewComponentProps) {
	const { timestamp } = props.node.attrs;
	const intl = useIntl();
	const pos = props.getPos?.();

	const { displayString, color } = getDateInformation(timestamp, intl, props.view.state, pos);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Ignored via go/DSP-18766
		<span className={DateSharedCssClassName.DATE_WRAPPER} onClick={handleClick}>
			<Date color={color} value={timestamp}>
				{displayString}
			</Date>
		</span>
	);

	function handleClick(event: React.SyntheticEvent<unknown>) {
		event.nativeEvent.stopImmediatePropagation();
		const { state, dispatch } = props.view;
		setDatePickerAt(state.selection.from)(state, dispatch);
	}
}
