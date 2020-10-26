import { defaultSchema } from '@atlaskit/adf-schema';
import RendererActions from '../../index';
import {
  simpleTextWithAnnotation,
  textWithOverlappingAnnotations,
  annotationSpanningMultiText,
} from '../../../__tests__/__fixtures__/annotation';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../../analytics/enums';
import { AnalyticsEventPayload } from '../../../analytics/events';

const mockArg = {} as any;
const mockArg2 = {} as any;
const annotationId = '<<<ANNOTATION-ID>>>';

describe('RendererActions', () => {
  it(`can't register the same RendererActions instance on more than one ref`, () => {
    const actions = new RendererActions(true);
    actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    expect(() => {
      actions._privateRegisterRenderer(mockArg2, mockArg2, mockArg2);
    }).toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });

  it(`no-ops when not init'd from a correct source`, () => {
    const actions = new RendererActions();
    actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    expect(() => {
      actions._privateRegisterRenderer(mockArg, mockArg, mockArg);
    }).not.toThrowError(
      "Renderer has already been registered! It's not allowed to re-register with another new Renderer instance.",
    );
  });

  describe('deleteAnnotation', () => {
    let onAnalyticsEvent:
      | jest.Mock<any, any>
      | ((event: AnalyticsEventPayload) => void)
      | undefined;

    beforeEach(() => {
      onAnalyticsEvent = jest.fn();
    });

    function initActions(doc: any) {
      let actions = new RendererActions(true);
      actions._privateRegisterRenderer(
        mockArg,
        defaultSchema.nodeFromJSON(doc),
        defaultSchema,
        onAnalyticsEvent,
      );
      return actions;
    }
    it('should delete the annotaion with provided ID', () => {
      let actions = initActions(simpleTextWithAnnotation(annotationId));
      expect(
        actions.deleteAnnotation(annotationId, 'inlineComment'),
      ).toMatchSnapshot();
    });

    it('should delete the annotaion with provided ID without touching overlapping marks', () => {
      let actions = initActions(textWithOverlappingAnnotations(annotationId));
      expect(
        actions.deleteAnnotation(annotationId, 'inlineComment'),
      ).toMatchSnapshot();
    });

    it('should delete the annotation when spanning multiple nodes', () => {
      let actions = initActions(annotationSpanningMultiText(annotationId));
      expect(
        actions.deleteAnnotation(annotationId, 'inlineComment'),
      ).toMatchSnapshot();
    });

    it('should trigger the analytics event when annotation is deteted', () => {
      let actions = initActions(simpleTextWithAnnotation(annotationId));
      actions.deleteAnnotation(annotationId, 'inlineComment');

      expect(onAnalyticsEvent).toBeCalledWith({
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.ANNOTATION,
        actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
        eventType: EVENT_TYPE.TRACK,
      });
    });

    it('should not trigger the analytics event when annotation is not deteted', () => {
      let actions = initActions(simpleTextWithAnnotation(annotationId));
      actions.deleteAnnotation('noAnnotation', 'inlineComment');

      expect(onAnalyticsEvent).toBeCalledTimes(0);
    });
  });
});
