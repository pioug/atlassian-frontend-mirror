import { useMemo } from 'react';
import debounce from 'lodash/debounce';

import {
  PropsDifference,
  ShallowPropsDifference,
  useComponentRenderTracking,
} from '@atlaskit/editor-common/utils';
import type { AnalyticsEventPayload } from '../../../analytics/events';
import {
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
} from '@atlaskit/editor-common/analytics';

export type FireAnalyticsCallback = <T = void>(
  payload: AnalyticsEventPayload<T>,
) => void | undefined;

type RenderActions = ACTION.RE_RENDERED;
type RenderActionSubjects = ACTION_SUBJECT.RENDERER;

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
    onRender: ({ renderCount, propsDifference, componentId }) => {
      if (!renderCount) {
        return;
      }
      debouncedHandleAnalyticsEvent({
        action: props.action,
        actionSubject: props.actionSubject,
        attributes: {
          count: renderCount,
          propsDifference: propsDifference as
            | PropsDifference<unknown>
            | ShallowPropsDifference<unknown>,
          componentId,
        },
        eventType: EVENT_TYPE.OPERATIONAL,
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
