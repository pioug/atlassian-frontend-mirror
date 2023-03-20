import { useMemo } from 'react';
import debounce from 'lodash/debounce';

import {
  useComponentRenderTracking,
  PropsDifference,
  ShallowPropsDifference,
} from '@atlaskit/editor-common/utils';

import {
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
  FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';

type RenderActions = ACTION.RE_RENDERED;
type RenderActionSubjects =
  | ACTION_SUBJECT.EDITOR
  | ACTION_SUBJECT.REACT_EDITOR_VIEW;

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
