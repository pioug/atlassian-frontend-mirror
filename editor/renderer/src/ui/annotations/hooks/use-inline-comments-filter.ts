import { useMemo, useContext } from 'react';
import { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';
import { InlineCommentsStateContext } from '../context';

type Props = {
  annotationIds: AnnotationId[];
  filter: {
    state: AnnotationMarkStates;
  };
};

export const useInlineCommentsFilter = ({
  annotationIds,
  filter: { state: stateFilter },
}: Props) => {
  const states = useContext(InlineCommentsStateContext);
  return useMemo(() => {
    return annotationIds.reduce((acc, id) => {
      if (states && states[id] === stateFilter) {
        return [...acc, id];
      }

      return acc;
    }, [] as string[]);
  }, [annotationIds, states, stateFilter]);
};
