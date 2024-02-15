import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
import type {
  AnnotationProviders,
  AnnotationState,
} from '@atlaskit/editor-common/types';
import {
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import RendererActions from '../../../../../actions/index';
import { RendererContext } from '../../../../RendererActionsContext';
import { ProvidersContext } from '../../../context';
import { useLoadAnnotations } from '../../use-load-annotations';

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
  let container: HTMLElement | null;
  let root: any; // Change to Root once we go full React 18

  const adfDocument: JSONDocNode = {
    version: 1,
    type: 'doc',
    content: [],
  };

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    if (process.env.IS_REACT_18 === 'true') {
      // @ts-ignore react-dom/client only available in react 18
      // eslint-disable-next-line import/no-unresolved, import/dynamic-import-chunkname -- react-dom/client only available in react 18
      const { createRoot } = await import('react-dom/client');
      root = createRoot(container!);
    }
  });

  afterEach(() => {
    document.body.removeChild(container!);
    container = null;
  });

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
        if (process.env.IS_REACT_18 === 'true') {
          act(() => {
            root.render(
              <RendererContext.Provider value={actionsFake}>
                <ProvidersContext.Provider value={providers}>
                  <CustomComp myAdfDocument={adfDocument} />
                </ProvidersContext.Provider>
              </RendererContext.Provider>,
            );
          });
        } else {
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
        }
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

        const sameDocument = adfDocument;

        if (process.env.IS_REACT_18 === 'true') {
          act(() => {
            root.render(
              <RendererContext.Provider value={actionsFake}>
                <ProvidersContext.Provider value={providers}>
                  <CustomComp myAdfDocument={sameDocument} />
                </ProvidersContext.Provider>
              </RendererContext.Provider>,
            );
          });
        } else {
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
        }
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(1);

        const newAdfDocument: JSONDocNode = {
          version: 1,
          type: 'doc',
          content: [],
        };

        if (process.env.IS_REACT_18 === 'true') {
          act(() => {
            root.render(
              <RendererContext.Provider value={actionsFake}>
                <ProvidersContext.Provider value={providers}>
                  <CustomComp myAdfDocument={newAdfDocument} />
                </ProvidersContext.Provider>
              </RendererContext.Provider>,
            );
          });
        } else {
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
        }
        expect(providers.inlineComment.getState).toHaveBeenCalledTimes(2);
      });
    });

    it('should call getState from Inline Comment provider with Annotations from action', () => {
      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);

      if (process.env.IS_REACT_18 === 'true') {
        act(() => {
          root.render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
          );
        });
      } else {
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
      }

      expect(providers.inlineComment.getState).toHaveBeenCalledWith(
        fakeMarksIds,
      );
    });

    it('should not call getState when there is no annotations', () => {
      jest
        .spyOn(RendererActions.prototype, 'getAnnotationMarks')
        .mockReturnValue([]);

      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);

      if (process.env.IS_REACT_18 === 'true') {
        act(() => {
          root.render(
            <RendererContext.Provider value={actionsFake}>
              <ProvidersContext.Provider value={providers}>
                <CustomComp />
              </ProvidersContext.Provider>
            </RendererContext.Provider>,
          );
        });
      } else {
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
      }

      expect(providers.inlineComment.getState).toHaveBeenCalledTimes(0);
    });

    describe('when the getState is resolved', () => {
      it('should emit SET_ANNOTATION_STATE event on updateSubscriber', (done) => {
        expect(updateSubscriberFake.emit).toHaveBeenCalledTimes(0);

        if (process.env.IS_REACT_18 === 'true') {
          act(() => {
            root.render(
              <RendererContext.Provider value={actionsFake}>
                <ProvidersContext.Provider value={providers}>
                  <CustomComp />
                </ProvidersContext.Provider>
              </RendererContext.Provider>,
            );
          });
        } else {
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
        }

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
