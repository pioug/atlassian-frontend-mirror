import { useMemo } from 'react';

import debounce from 'lodash/debounce';

import type {
	ACTION,
	ACTION_SUBJECT,
	FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import { EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { useComponentRenderTracking } from '@atlaskit/editor-common/use-component-render-tracking';
import type { PropsDifference, ShallowPropsDifference } from '@atlaskit/editor-common/utils';

type RenderActions = ACTION.RE_RENDERED;
type RenderActionSubjects = ACTION_SUBJECT.EDITOR | ACTION_SUBJECT.REACT_EDITOR_VIEW;

export type RenderTrackingProps<ComponentProps> = {
	componentProps: ComponentProps;
	action: RenderActions;
	actionSubject: RenderActionSubjects;
	handleAnalyticsEvent: FireAnalyticsCallback;
	propsToIgnore?: Array<keyof ComponentProps>;
	useShallow?: boolean;
};

export function RenderTracking<Props>(props: RenderTrackingProps<Props>) {
	const debouncedHandleAnalyticsEvent = useMemo(
		() => debounce<FireAnalyticsCallback>(props.handleAnalyticsEvent, 500),
		[props.handleAnalyticsEvent],
	);

	useComponentRenderTracking<Props>({
		onRender: ({ renderCount, propsDifference }) => {
			if (!renderCount) {
				return;
			}
			debouncedHandleAnalyticsEvent({
				payload: {
					action: props.action,
					actionSubject: props.actionSubject,
					attributes: {
						count: renderCount,
						propsDifference: propsDifference as
							| PropsDifference<unknown>
							| ShallowPropsDifference<unknown>,
					},
					eventType: EVENT_TYPE.OPERATIONAL,
				},
			});
		},
		propsDiffingOptions: {
			enabled: true,
			props: props.componentProps,
			propsToIgnore: props.propsToIgnore,
			useShallow: props.useShallow,
		},
		zeroBasedCount: true,
	});
	return null;
}
