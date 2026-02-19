import React, { memo } from 'react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	isPastDate,
	timestampToString,
	timestampToTaskContext,
} from '@atlaskit/editor-common/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { useRendererContext } from '../../renderer-context';
import { useTaskItemsFormatContext } from '../../ui/TaskItemsFormatContext/TaskItemsFormatContext';
import {
	type MarkDataAttributes,
	useInlineAnnotationProps,
} from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	parentIsIncompleteTask?: boolean;
	timestamp: string;
}

const Date = memo(function Date(props: Props & WrappedComponentProps) {
	const inlineAnnotationProps = useInlineAnnotationProps(props);
	const { timestamp, parentIsIncompleteTask, intl } = props;
	const { timeZone: contextTimeZone } = useRendererContext();
	const timeZone = expValEquals('confluence_frontend_fix_date_hydration_error', 'isEnabled', true)
		? contextTimeZone
		: undefined;
	const className =
		!!parentIsIncompleteTask && isPastDate(timestamp, timeZone)
			? 'date-node date-node-highlighted'
			: 'date-node';

	return (
		<span
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={DateSharedCssClassName.DATE_WRAPPER}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...inlineAnnotationProps}
		>
			<span
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				data-node-type="date"
				data-timestamp={timestamp}
			>
				{parentIsIncompleteTask
					? timestampToTaskContext(timestamp, intl, timeZone)
					: timestampToString(timestamp, intl)}
			</span>
		</span>
	);
});

export const DateComponent = injectIntl(Date);

function DateWithFormatContext(props: Props): React.JSX.Element {
	const [isChecked] = useTaskItemsFormatContext();
	let parentIsIncompleteTask = props.parentIsIncompleteTask;
	if (typeof isChecked !== 'undefined') {
		parentIsIncompleteTask = !isChecked;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <DateComponent {...props} parentIsIncompleteTask={parentIsIncompleteTask} />;
}

export default DateWithFormatContext;
