import { mapActionSubjectIdToAttributes } from '../index';
import {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../types';

describe('analytics automaticAttributes', () => {
  describe('mapActionSubjectIdToAttributes ', () => {
    describe("when action is 'document inserted'", () => {
      it('should return payload with actionSubjectId if attributes exist on original event', () => {
        const insertCodeBlock: AnalyticsEventPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
          },
          eventType: EVENT_TYPE.TRACK,
        };
        expect(mapActionSubjectIdToAttributes(insertCodeBlock)).toEqual({
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
            actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          },
          eventType: EVENT_TYPE.TRACK,
        });
      });

      it('should return payload with actionSubjectId even if attributes do not exist on original event', () => {
        const insertCodeBlock: AnalyticsEventPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          eventType: EVENT_TYPE.TRACK,
        };
        expect(mapActionSubjectIdToAttributes(insertCodeBlock)).toEqual({
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          attributes: {
            actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
          },
          eventType: EVENT_TYPE.TRACK,
        });
      });

      it('should return original payload if original event is missing actionSubjectId', () => {
        const insertDocumentWithoutActionSubjectId: AnalyticsEventPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          eventType: EVENT_TYPE.TRACK,
        };
        expect(
          mapActionSubjectIdToAttributes(insertDocumentWithoutActionSubjectId),
        ).toEqual({
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          eventType: EVENT_TYPE.TRACK,
        });
      });
    });
    describe("when action is 'formatted text'", () => {
      it('should return payload with actionSubjectId if attributes exist on original event', () => {
        const formatItalics: AnalyticsEventPayload = {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          attributes: {
            inputMethod: INPUT_METHOD.FORMATTING,
          },
          eventType: EVENT_TYPE.TRACK,
        };
        expect(mapActionSubjectIdToAttributes(formatItalics)).toEqual({
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: INPUT_METHOD.FORMATTING,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          },
        });
      });
      it('should return payload with actionSubjectId even if attributes do not exist on original event', () => {
        const formatItalicsWithoutAttributes: AnalyticsEventPayload = {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          eventType: EVENT_TYPE.TRACK,
        };
        expect(
          mapActionSubjectIdToAttributes(formatItalicsWithoutAttributes),
        ).toEqual({
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
          },
        });
      });
      it('should return original payload if original event is missing actionSubjectId', () => {
        const formatTextWithoutActionSubjectId: AnalyticsEventPayload = {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: INPUT_METHOD.FORMATTING,
          },
        };
        expect(
          mapActionSubjectIdToAttributes(formatTextWithoutActionSubjectId),
        ).toEqual({
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: INPUT_METHOD.FORMATTING,
          },
        });
      });
    });
    describe("when action is not 'formatted text' or 'document inserted", () => {
      const clickButton: AnalyticsEventPayload = {
        action: ACTION.CLICKED,
        actionSubject: ACTION_SUBJECT.BUTTON,
        actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
        attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
        eventType: EVENT_TYPE.UI,
      };
      it('should return original payload', () => {
        expect(mapActionSubjectIdToAttributes(clickButton)).toEqual({
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
          attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
          eventType: EVENT_TYPE.UI,
        });
      });
    });
  });
});
