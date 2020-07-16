import React from 'react';
import {
  applyAnnotationOnText,
  TextWithAnnotationDraft,
  AnnotationDraft,
  getAnnotationIndex,
} from '../../component';
import { AnnotationsDraftContext } from '../../../context';
import TestRenderer, { ReactTestInstance } from 'react-test-renderer';
import { InsertDraftPosition, Position } from '../../../types';

describe('Annotations: draft/component', () => {
  describe('#getAnnotationIndex', () => {
    describe('when the annotationPosition is START', () => {
      it('shoud return zero', () => {
        expect(getAnnotationIndex(InsertDraftPosition.START, 1)).toBe(0);
      });
    });

    describe('when the annotationPosition is END', () => {
      it('shoud return the last index', () => {
        expect(getAnnotationIndex(InsertDraftPosition.END, 3)).toBe(2);
      });
    });

    describe('when the annotationPosition is INSIDE and the frament count is three', () => {
      it('shoud return one', () => {
        expect(getAnnotationIndex(InsertDraftPosition.INSIDE, 3)).toBe(1);
      });
    });

    describe('when the annotationPosition is INSIDE and the frament count is not three', () => {
      it('shoud return negative one', () => {
        expect(getAnnotationIndex(InsertDraftPosition.INSIDE, 2)).toBe(-1);
        expect(getAnnotationIndex(InsertDraftPosition.INSIDE, 4)).toBe(-1);
      });
    });
  });

  describe('#TextWithAnnotationDraft', () => {
    describe.each<[string, Position]>([
      ['before', { from: 1, to: 10 }],
      ['after', { from: 36, to: 100 }],
    ])(
      'when the draft selection is %s the component',
      (type, draftSelection) => {
        const textPosition = {
          startPos: 20,
          endPos: 35,
        };

        it('should not create the AnnotationMark', () => {
          const result = TestRenderer.create(
            <AnnotationsDraftContext.Provider value={draftSelection}>
              <TextWithAnnotationDraft
                text="Martin Luther King"
                {...textPosition}
              />
            </AnnotationsDraftContext.Provider>,
          );

          expect(result.root.children).toHaveLength(1);
          expect(result.root.children[0]).toEqual('Martin Luther King');
        });
      },
    );

    describe('when the draft selection is ending at the component', () => {
      it('should create the AnnotationMark at the start of the text', () => {
        const textPosition = {
          startPos: 20,
          endPos: 35,
        };
        const draftSelection = { from: 1, to: 25 };

        const result = TestRenderer.create(
          <AnnotationsDraftContext.Provider value={draftSelection}>
            <TextWithAnnotationDraft
              text="Martin Luther King"
              {...textPosition}
            />
          </AnnotationsDraftContext.Provider>,
        );

        expect(result.root.children).toHaveLength(2);
        expect((result.root.children[0] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
        expect(result.root.children[1]).toEqual('uther King');
      });
    });

    describe('when the draft selection is starting at the component', () => {
      it('should create the AnnotationMark at the end of the text', () => {
        const textPosition = {
          startPos: 1,
          endPos: 10,
        };
        const draftSelection = { from: 5, to: 30 };

        const result = TestRenderer.create(
          <AnnotationsDraftContext.Provider value={draftSelection}>
            <TextWithAnnotationDraft
              text="Martin Luther King"
              {...textPosition}
            />
          </AnnotationsDraftContext.Provider>,
        );

        expect(result.root.children).toHaveLength(2);
        expect(result.root.children[0]).toEqual('Mart');
        expect((result.root.children[1] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
      });
    });

    describe('when the draft selection is surroding the component', () => {
      it('should create the AnnotationMark around the text', () => {
        const textPosition = {
          startPos: 10,
          endPos: 30,
        };
        const draftSelection = { from: 1, to: 40 };

        const result = TestRenderer.create(
          <AnnotationsDraftContext.Provider value={draftSelection}>
            <TextWithAnnotationDraft
              text="Martin Luther King"
              {...textPosition}
            />
          </AnnotationsDraftContext.Provider>,
        );

        expect(result.root.children).toHaveLength(1);
        expect((result.root.children[0] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
      });
    });

    describe('when the draft selection is the same position from the text', () => {
      it('should create the AnnotationMark around the text', () => {
        const textPosition = {
          startPos: 10,
          endPos: 30,
        };
        const draftSelection = { from: 10, to: 30 };

        const result = TestRenderer.create(
          <AnnotationsDraftContext.Provider value={draftSelection}>
            <TextWithAnnotationDraft
              text="Martin Luther King"
              {...textPosition}
            />
          </AnnotationsDraftContext.Provider>,
        );

        expect(result.root.children).toHaveLength(1);
        expect((result.root.children[0] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
      });
    });
  });

  describe('#applyAnnotationOnText', () => {
    const twoTexts: [string, string] = ['um', 'dois'];
    const threeTexts: [string, string, string] = ['um', 'dois', 'tres'];
    const draftPosition = {
      from: 10,
      to: 15,
    };

    describe('when the insert draft position is START', () => {
      it('should wrap the first text on the AnnotationDraft', () => {
        const result = applyAnnotationOnText({
          texts: twoTexts,
          shouldApplyAnnotationAt: InsertDraftPosition.START,
          draftPosition,
        });

        const wrapper = TestRenderer.create(<>{result}</>).root;

        expect(wrapper.children).toHaveLength(2);
        expect((wrapper.children[0] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
        expect(typeof wrapper.children[1]).toEqual('string');
      });
    });

    describe('when the insert draft position is END', () => {
      it('should wrap the last text on the AnnotationDraft', () => {
        const result = applyAnnotationOnText({
          texts: twoTexts,
          shouldApplyAnnotationAt: InsertDraftPosition.END,
          draftPosition,
        });
        const wrapper = TestRenderer.create(<>{result}</>).root;

        expect(wrapper.children).toHaveLength(2);
        expect(typeof wrapper.children[0]).toEqual('string');
        expect((wrapper.children[1] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
      });
    });

    describe('when the insert draft position is INSIDE', () => {
      it('should wrap the middle text on the AnnotationDraft', () => {
        const result = applyAnnotationOnText({
          texts: threeTexts,
          shouldApplyAnnotationAt: InsertDraftPosition.INSIDE,
          draftPosition,
        });
        const wrapper = TestRenderer.create(<>{result}</>).root;

        expect(wrapper.children).toHaveLength(3);
        expect(typeof wrapper.children[0]).toEqual('string');
        expect((wrapper.children[1] as ReactTestInstance).type).toEqual(
          AnnotationDraft,
        );
        expect(typeof wrapper.children[2]).toEqual('string');
      });
    });

    describe('when the insert draft position is INSIDE but there is only two itens in the text array', () => {
      it('should not wrap any element with AnnotationDraft', () => {
        const result = applyAnnotationOnText({
          texts: ['um', 'dois'],
          shouldApplyAnnotationAt: InsertDraftPosition.INSIDE,
          draftPosition,
        });

        const wrapper = TestRenderer.create(<>{result}</>).root;

        expect(wrapper.children).toHaveLength(2);
        expect(typeof wrapper.children[0]).toEqual('string');
        expect(typeof wrapper.children[1]).toEqual('string');
      });
    });
  });
});
