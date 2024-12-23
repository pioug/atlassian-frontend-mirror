import React, { memo } from 'react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	isPastDate,
	timestampToString,
	timestampToTaskContext,
} from '@atlaskit/editor-common/utils';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { useTaskItemsFormatContext } from '../../ui/TaskItemsFormatContext/TaskItemsFormatContext';
import {
	type MarkDataAttributes,
	useInlineAnnotationProps,
} from '../../ui/annotations/element/useInlineAnnotationProps';

export interface Props extends MarkDataAttributes {
	timestamp: string;
	parentIsIncompleteTask?: boolean;
}

const Date = memo(function Date(props: Props & WrappedComponentProps) {
	const inlineAnnotationProps = useInlineAnnotationProps(props);
	const { timestamp, parentIsIncompleteTask, intl } = props;
	const className =
		!!parentIsIncompleteTask && isPastDate(timestamp)
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
					? timestampToTaskContext(timestamp, intl)
					: timestampToString(timestamp, intl)}
			</span>
		</span>
	);
});

export const DateComponent = injectIntl(Date);

function DateWithFormatContext(props: Props) {
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
