import React, { useContext } from 'react';
import { ProvidersContext } from './context';
import { RangeValidator as HoverRangeValidator } from './hover/range-validator';
import { SelectionRangeValidator } from './selection/range-validator';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

type Props = {
	rendererRef: React.RefObject<HTMLDivElement>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	isNestedRender?: boolean;
};
export const AnnotationsContextWrapper = (props: React.PropsWithChildren<Props>): JSX.Element => {
	const providers = useContext(ProvidersContext);
	const { rendererRef, createAnalyticsEvent, children } = props;
	const inlineCommentProvider = providers && providers.inlineComment;
	const selectionComponent = inlineCommentProvider && inlineCommentProvider.selectionComponent;
	const hoverComponent = inlineCommentProvider && inlineCommentProvider.hoverComponent;

	if (!selectionComponent && !hoverComponent) {
		return <>{children}</>;
	}

	return (
		<>
			{children}
			{!!hoverComponent && (
				<HoverRangeValidator
					createAnalyticsEvent={createAnalyticsEvent}
					rendererRef={rendererRef}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					component={hoverComponent!}
				/>
			)}
			{!!selectionComponent && (
				<SelectionRangeValidator
					createAnalyticsEvent={createAnalyticsEvent}
					rendererRef={rendererRef}
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					selectionComponent={selectionComponent!}
				/>
			)}
		</>
	);
};
