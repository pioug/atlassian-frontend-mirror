import React, {
  PropsWithChildren,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  AnnotationMarkAttributes,
  buildAnnotationMarkDataAttributes,
  AnnotationMarkStates,
  AnnotationId,
  AnnotationTypes,
} from '@atlaskit/adf-schema';
import styled from 'styled-components';
import { AnnotationSharedCSSByState } from '@atlaskit/editor-common';
import { MarkProps } from '../types';

export type Props = {
  children: React.ReactNode;
  getAnnotationState?: (id: AnnotationId) => Promise<AnnotationMarkStates>;
} & AnnotationMarkAttributes;

const DefaultAnnotation = styled.mark`
  color: inherit;
  ${AnnotationSharedCSSByState.blur};

  &:focus {
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

export const AnnotationContext = React.createContext({
  onAnnotationClick: (ids?: AnnotationId[]) => {},
  enableAutoHighlight: true,
});

type AnnotationProviderProps = {
  onAnnotationClick: (ids?: AnnotationId[]) => {};
  enableAutoHighlight: boolean;
};

export const AnnotationsProvider = ({
  onAnnotationClick,
  enableAutoHighlight,
  children,
}: PropsWithChildren<AnnotationProviderProps>) => {
  return (
    <AnnotationContext.Provider
      value={{ enableAutoHighlight, onAnnotationClick }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

type AnnotationProps = PropsWithChildren<
  DataAttributes & { state: AnnotationMarkStates }
>;

const useHightLight = (id: AnnotationId) => {
  const context = useContext(AnnotationContext);
  const { onAnnotationClick } = context;

  const highlight = React.useCallback(() => {
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
    <Component onClick={highlight} {...data}>
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

const AnnotationWithManualHighlight = withManualHighlight(DefaultAnnotation);
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
  const [state, setState] = React.useState<AnnotationMarkStates | null>(null);
  const context = useContext(AnnotationContext);

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

  const data: DataAttributes = {
    id,
    ...dataAttributes,
    ...buildAnnotationMarkDataAttributes({ id, annotationType, state }),
  };

  if (state === AnnotationMarkStates.ACTIVE && context) {
    return (
      <Annotation state={AnnotationMarkStates.ACTIVE} {...data}>
        {children}
      </Annotation>
    );
  }

  return <span {...data}>{children}</span>;
};

export default AnnotationComponent;
