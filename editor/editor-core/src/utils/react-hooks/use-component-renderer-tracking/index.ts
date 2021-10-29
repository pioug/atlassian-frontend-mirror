import { useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import {
  getShallowPropsDifference,
  getPropsDifference,
  ShallowPropsDifference,
  PropsDifference,
} from '../../compare';
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

type PropsDiff<Props> = ShallowPropsDifference<Props> | PropsDifference<Props>;

type OnRenderCb<Props = undefined> = ({
  renderCount,
  propsDifference,
}: {
  renderCount: number;
  propsDifference: PropsDiff<Props> | undefined;
}) => void;

export type UseComponentRenderTrackingArgs<Props = undefined> = {
  onRender: OnRenderCb<Props>;
  propsDiffingOptions?: {
    enabled: boolean;
    props?: Props;
    propsToIgnore?: Array<keyof Props>;
    useShallow?: boolean;
  };
  zeroBasedCount?: boolean;
};

export function useComponentRenderTracking<Props = undefined>({
  onRender,
  propsDiffingOptions,
  zeroBasedCount = true,
}: UseComponentRenderTrackingArgs<Props>) {
  const propsRef = useRef<Props>();
  const renderCountRef = useRef<number>(zeroBasedCount ? 0 : 1);

  useEffect(() => {
    const lastProps = propsRef.current;
    const renderCount = renderCountRef.current;

    let propsDifference;
    if (propsDiffingOptions?.enabled && lastProps) {
      propsDifference = propsDiffingOptions?.useShallow
        ? getShallowPropsDifference(lastProps, propsDiffingOptions.props)
        : getPropsDifference(
            lastProps,
            propsDiffingOptions.props as Props,
            0,
            2,
            propsDiffingOptions?.propsToIgnore,
          );
    }
    const result = {
      renderCount,
      propsDifference,
    };

    onRender(result);
    if (propsDiffingOptions?.enabled) {
      propsRef.current = propsDiffingOptions.props;
    }
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
  const debouncedHandleAnalyticsEvent = useMemo(
    () => debounce<FireAnalyticsCallback>(props.handleAnalyticsEvent, 500),
    [props.handleAnalyticsEvent],
  );

  useComponentRenderTracking<Props>({
    onRender: ({ renderCount, propsDifference }) => {
      if (!renderCount) {
        return;
      }
      debouncedHandleAnalyticsEvent<Props>({
        payload: {
          action: props.action,
          actionSubject: props.actionSubject,
          attributes: {
            count: renderCount,
            propsDifference: propsDifference as PropsDiff<Props>,
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
