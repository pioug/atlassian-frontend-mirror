import React, {
  PropsWithChildren,
  useEffect,
  useContext,
  useCallback,
  useState,
  createContext,
} from 'react';
import {
  AnnotationMarkAttributes,
  buildAnnotationMarkDataAttributes,
  AnnotationMarkStates,
  AnnotationId,
  AnnotationTypes,
} from '@atlaskit/adf-schema';
import styled from 'styled-components';
import {
  AnnotationSharedCSSByState,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
} from '@atlaskit/editor-common';
import { MarkProps } from '../types';

export type Props = {
  children: React.ReactNode;
  getAnnotationState?: (id: AnnotationId) => Promise<AnnotationMarkStates>;
} & AnnotationMarkAttributes;

const DefaultAnnotation = styled.mark`
  color: inherit;
  ${AnnotationSharedCSSByState.blur};

  &:focus,
  &[data-has-focus='true'] {
    ${AnnotationSharedCSSByState.focus};
    outline: none;
  }
`;

type DataAttributes = SerializedDataAnnotationAttributes & {
  id: AnnotationId;
};

type SerializedDataAnnotationAttributes = {
  'data-mark-type': string;
  'data-mark-annotation-type': AnnotationTypes;
  'data-id': AnnotationId;
  'data-mark-annotation-state'?: AnnotationMarkStates;
};

type AnnotationProviderProps = {
  onAnnotationClick: (ids?: AnnotationId[]) => void;
  enableAutoHighlight: boolean;
  updateSubscriber?: AnnotationUpdateEmitter;
};

export const AnnotationContext = createContext<AnnotationProviderProps>({
  onAnnotationClick: (ids?: AnnotationId[]) => {},
  enableAutoHighlight: true,
});

type AnnotationProps = PropsWithChildren<
  DataAttributes & { state: AnnotationMarkStates }
>;

const useHightLight = (id: AnnotationId) => {
  const context = useContext(AnnotationContext);
  const { onAnnotationClick } = context;

  const highlight = useCallback(() => {
    if (onAnnotationClick) {
      onAnnotationClick([id]);
    }
  }, [onAnnotationClick, id]);
  const unhighlight = useCallback(() => {
    if (onAnnotationClick) {
      onAnnotationClick();
    }
  }, [onAnnotationClick]);

  return [highlight, unhighlight];
};

const withManualHighlight = <P extends AnnotationProps>(
  Component: React.ComponentType,
): React.FC<P> => ({ id, children, ...data }: P) => {
  const [highlight] = useHightLight(id);

  return (
    <Component {...data} onClick={highlight}>
      {children}
    </Component>
  );
};

const withAutoHighlight = <P extends AnnotationProps>(
  Component: React.ComponentType,
): React.FC<P> => ({ id, children, ...data }: P) => {
  const [highlight, unhighlight] = useHightLight(id);

  return (
    <Component
      tabIndex={0}
      onFocus={highlight}
      onClick={highlight}
      onBlur={unhighlight}
      {...data}
    >
      {children}
    </Component>
  );
};

const useAnnotationEvent = <P extends AnnotationUpdateEvent>(
  eventType: P,
  callback: (
    payload?: P extends keyof AnnotationUpdateEventPayloads
      ? AnnotationUpdateEventPayloads[P]
      : [],
  ) => void,
) => {
  const { updateSubscriber } = useContext(AnnotationContext);

  useEffect(() => {
    if (!updateSubscriber) {
      return;
    }

    updateSubscriber.on(eventType, callback);

    return () => {
      updateSubscriber.off(eventType, callback);
    };
  }, [callback, updateSubscriber, eventType]);
};

const withSetFocus = <P extends AnnotationProps>(
  Component: React.ComponentType<P>,
): React.FC<P> => ({ id, children, ...data }: P) => {
  const [dataHasFocus, setDataHasFocus] = useState(false);

  const updateFocus = useCallback(
    ({ annotationId }) => {
      if (id === annotationId) {
        setDataHasFocus(true);
      } else {
        setDataHasFocus(false);
      }
    },
    [id],
  );
  const removeFocus = useCallback(() => {
    setDataHasFocus(false);
  }, []);

  useAnnotationEvent(AnnotationUpdateEvent.SET_ANNOTATION_FOCUS, updateFocus);

  useAnnotationEvent(
    AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
    removeFocus,
  );

  return (
    <Component {...(data as P)} id={id} data-has-focus={dataHasFocus}>
      {children}
    </Component>
  );
};

const AnnotationWithManualHighlight = withSetFocus(
  withManualHighlight(DefaultAnnotation),
);
const AnnotationWithAutoHighlight = withAutoHighlight(DefaultAnnotation);

const Annotation = ({ children, ...data }: AnnotationProps) => {
  const { enableAutoHighlight } = useContext(AnnotationContext);

  if (enableAutoHighlight) {
    return (
      <AnnotationWithAutoHighlight {...data}>
        {children}
      </AnnotationWithAutoHighlight>
    );
  } else {
    return (
      <AnnotationWithManualHighlight {...data}>
        {children}
      </AnnotationWithManualHighlight>
    );
  }
};

export const AnnotationComponent = ({
  id,
  annotationType,
  children,
  dataAttributes,
  getAnnotationState,
}: MarkProps<Props>) => {
  const [state, setState] = useState<AnnotationMarkStates | null>(null);
  const data: DataAttributes = {
    id,
    ...dataAttributes,
    ...buildAnnotationMarkDataAttributes({ id, annotationType, state }),
  };

  useAnnotationEvent(
    AnnotationUpdateEvent.SET_ANNOTATION_STATE,
    useCallback(
      payload => {
        if (!payload || !payload[id]) {
          return;
        }

        setState(payload[id]);
      },
      [id],
    ),
  );

  useEffect(() => {
    let mounted = true;

    if (getAnnotationState) {
      getAnnotationState(id).then(state => {
        if (mounted) {
          setState(state);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [getAnnotationState, id]);

  if (state === AnnotationMarkStates.ACTIVE) {
    return (
      <Annotation state={AnnotationMarkStates.ACTIVE} {...data}>
        {children}
      </Annotation>
    );
  }

  return <span {...data}>{children}</span>;
};

export default AnnotationComponent;
