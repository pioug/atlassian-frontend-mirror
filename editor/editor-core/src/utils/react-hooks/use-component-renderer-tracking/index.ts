import { useEffect, useRef } from 'react';
import { getShallowPropsDifference, getPropsDifference } from '../../compare';
import {
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION,
  FireAnalyticsCallback,
} from '../../../plugins/analytics';

type RenderActions = ACTION.RE_RENDERED;
type RenderActionSubjects =
  | ACTION_SUBJECT.EDITOR
  | ACTION_SUBJECT.REACT_EDITOR_VIEW;

export function useComponentRenderTracking<Props>(
  props: Props,
  action: RenderActions,
  actionSubject: RenderActionSubjects,
  handleAnalyticsEvent: FireAnalyticsCallback,
  propsToIgnore: Array<keyof Props> = [],
  useShallow?: boolean,
) {
  const propsRef = useRef<Props>();
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    const lastProps = propsRef.current;
    const renderCount = renderCountRef.current;

    if (lastProps) {
      let difference = useShallow
        ? getShallowPropsDifference(lastProps, props)
        : getPropsDifference(lastProps, props, 0, 2, propsToIgnore);

      handleAnalyticsEvent<Props>({
        payload: {
          action,
          actionSubject,
          attributes: {
            propsDifference: difference,
            count: renderCount,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        },
      });
    }
    propsRef.current = props;
    renderCountRef.current = renderCountRef.current + 1;
  }); // No dependencies run on each render
}

export type RenderTrackingProps<ComponentProps> = {
  componentProps: ComponentProps;
  action: RenderActions;
  actionSubject: RenderActionSubjects;
  handleAnalyticsEvent: FireAnalyticsCallback;
  propsToIgnore?: Array<keyof ComponentProps>;
  useShallow?: boolean;
};

export function RenderTracking<Props>(props: RenderTrackingProps<Props>) {
  useComponentRenderTracking(
    props.componentProps,
    props.action,
    props.actionSubject,
    props.handleAnalyticsEvent,
    props.propsToIgnore,
    props.useShallow,
  );
  return null;
}
