import React from 'react';
import { render } from 'react-dom';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { InlineCommentsStateContext } from '../../../context';
import { useInlineCommentsFilter } from '../../use-inline-comments-filter';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

describe('Annotations: Hooks/useInlineCommentsFilter', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  const Wrapper: React.FC<{ states: any }> = ({ children, states }) => {
    return (
      <InlineCommentsStateContext.Provider value={states}>
        {children}
      </InlineCommentsStateContext.Provider>
    );
  };
  describe('#useInlineCommentsFilter', () => {
    describe('when there is InlineCommentsStateContext', () => {
      it('should filter the annotations', () => {
        const state = AnnotationMarkStates.ACTIVE;
        const annotationIds: string[] = ['lol1', 'lol2'];
        const fakeFunction = jest.fn();

        const CustomComp: React.FC<any> = ({ annotationIds, state }) => {
          const result = useInlineCommentsFilter({
            annotationIds,
            filter: {
              state,
            },
          });
          fakeFunction(result);
          return null;
        };

        render(
          <Wrapper states={{}}>
            <CustomComp annotationIds={annotationIds} state={state} />
          </Wrapper>,
          container,
        );

        expect(fakeFunction).toHaveBeenCalledWith([]);

        let nextState: Record<string, AnnotationMarkStates> = {
          lol1: AnnotationMarkStates.ACTIVE,
        };
        render(
          <Wrapper states={nextState}>
            <CustomComp annotationIds={annotationIds} state={state} />
          </Wrapper>,
          container,
        );
        expect(fakeFunction).toHaveBeenCalledWith(['lol1']);

        nextState = {
          lol2: AnnotationMarkStates.ACTIVE,
          lol1: AnnotationMarkStates.ACTIVE,
        };
        render(
          <Wrapper states={nextState}>
            <CustomComp annotationIds={annotationIds} state={state} />
          </Wrapper>,
          container,
        );
        expect(fakeFunction).toHaveBeenCalledWith(['lol1', 'lol2']);

        render(
          <Wrapper states={{}}>
            <CustomComp annotationIds={annotationIds} state={state} />
          </Wrapper>,
          container,
        );

        expect(fakeFunction).toHaveBeenCalledWith([]);
      });
    });
  });
});
