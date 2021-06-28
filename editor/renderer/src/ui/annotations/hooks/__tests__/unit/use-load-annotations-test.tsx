import React from 'react';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  AnnotationState,
  AnnotationProviders,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';
import { AnnotationTypes, AnnotationMarkStates } from '@atlaskit/adf-schema';
import { ProvidersContext } from '../../../context';
import { useLoadAnnotations } from '../../use-load-annotations';
import { RendererContext } from '../../../../RendererActionsContext';
import RendererActions from '../../../../../actions/index';
import { Mark } from 'prosemirror-model';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
});

function createFakeMark(id: string): Mark {
  // @ts-ignore
  const fakeMark: Mark = {
    attrs: {
      id,
    },
  };

  return fakeMark;
}

function createFakeAnnotationState(
  id: string,
): AnnotationState<AnnotationTypes.INLINE_COMMENT> {
  return {
    id,
    annotationType: AnnotationTypes.INLINE_COMMENT,
    state: AnnotationMarkStates.ACTIVE,
  };
}

describe('Annotations: Hooks/useLoadAnnotations', () => {
  const adfDocument: JSONDocNode = {
    version: 1,
    type: 'doc',
    content: [],
  };
  describe('#useLoadAnnotations', () => {
    const CustomComp: React.FC = () => {
      useLoadAnnotations({ adfDocument });
      return null;
    };

    const fakeMarksIds = ['lol1', 'lol2', 'lol3'];
    const fakeMarks: Mark[] = fakeMarksIds.map(createFakeMark);
    const fakeDataReturn = fakeMarksIds.map(createFakeAnnotationState);

    let getStateFake: jest.Mock;
    let actionsFake: RendererActions;
    let providers: AnnotationProviders;
    let updateSubscriberFake: AnnotationUpdateEmitter;
    beforeEach(() => {
      getStateFake = jest.fn().mockReturnValue(Promise.resolve(fakeDataReturn));
      jest
        .spyOn(RendererActions.prototype, 'getAnnotationMarks')
        .mockReturnValue(fakeMarks);
      jest.spyOn(AnnotationUpdateEmitter.prototype, 'emit');

      actionsFake = new RendererActions();
      updateSubscriberFake = new AnnotationUpdateEmitter();
      providers = {
        inlineComment: {
          getState: getStateFake,
          updateSubscriber: updateSubscriberFake,
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the document changes', () => {
      it('should call getState again', () => {
        const CustomComp: React.FC<Record<'myAdfDocument', JSONDocNode>> = ({
          myAdfDocument,
        }) => {
          useLoadAnnotations({ adfDocument: myAdfDocument });
          return null;
        };

        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
        act(() => {
          render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp myAdfDocument={adfDocument} />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
            container,
          );
        });
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

        const sameDocument = adfDocument;
        act(() => {
          render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp myAdfDocument={sameDocument} />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
            container,
          );
        });
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

        const newAdfDocument: JSONDocNode = {
          version: 1,
          type: 'doc',
          content: [],
        };

        act(() => {
          render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp myAdfDocument={newAdfDocument} />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
            container,
          );
        });
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(2);
      });
    });

    it('should call getState from Inline Comment provider with Annotations from action', () => {
      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
      act(() => {
        render(
          <RendererContext.Provider value={actionsFake}>
            <ProvidersContext.Provider value={providers}>
              <CustomComp />
            </ProvidersContext.Provider>
          </RendererContext.Provider>,
          container,
        );
      });

      expect(providers.inlineComment.getState).toHaveBeenCalledWith(
        fakeMarksIds,
      );
    });

    it('should not call getState when there is no annotations', () => {
      jest
        .spyOn(RendererActions.prototype, 'getAnnotationMarks')
        .mockReturnValue([]);

      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
      act(() => {
        render(
          <RendererContext.Provider value={actionsFake}>
            <ProvidersContext.Provider value={providers}>
              <CustomComp />
            </ProvidersContext.Provider>
          </RendererContext.Provider>,
          container,
        );
      });

      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
    });

    describe('when the getState is resolved', () => {
      it('should emit SET_ANNOTATION_STATE event on updateSubscriber', (done) => {
        expect(updateSubscriberFake.emit).toHaveBeenCalledTimes(0);
        act(() => {
          render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
            container,
          );
        });

        const expected = fakeDataReturn.reduce((acc, cur) => {
          return {
            ...acc,
            [cur.id]: cur,
          };
        }, {});
        process.nextTick(() => {
          expect(updateSubscriberFake.emit).toHaveBeenCalledWith(
            AnnotationUpdateEvent.SET_ANNOTATION_STATE,
            expected,
          );
          done();
        });
      });
    });
  });
});
