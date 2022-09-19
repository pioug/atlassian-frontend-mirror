import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { processAttributesFromBaseEvent } from '../../process-attributes';

describe('processAttributesFromBaseEvent', () => {
  it('should correctly assign `sourceEvent` attribute with `actionSubjectId`', () => {
    const event = processAttributesFromBaseEvent(
      new UIAnalyticsEvent({
        payload: {
          action: 'submitted',
          actionSubject: 'form',
          actionSubjectId: 'linkPicker',
        },
      }),
    );

    expect(event).toStrictEqual(
      expect.objectContaining({
        sourceEvent: 'form submitted (linkPicker)',
      }),
    );
  });

  it('should correctly assign `sourceEvent` attribute without `actionSubjectId`', () => {
    const event = processAttributesFromBaseEvent(
      new UIAnalyticsEvent({
        payload: {
          action: 'submitted',
          actionSubject: 'form',
        },
      }),
    );

    expect(event).toStrictEqual(
      expect.objectContaining({
        sourceEvent: 'form submitted',
      }),
    );
  });

  it('should correctly assign `sourceEvent` attribute with `eventName` (preferring eventName)', () => {
    const event = processAttributesFromBaseEvent(
      new UIAnalyticsEvent({
        payload: {
          eventName: 'button clicked',
          action: 'submitted',
          actionSubject: 'form',
        },
      }),
    );

    expect(event).toStrictEqual(
      expect.objectContaining({
        sourceEvent: 'button clicked',
      }),
    );
  });

  it('should merge payload and context attributes, preferencing payload attributes', () => {
    const event = processAttributesFromBaseEvent(
      new UIAnalyticsEvent({
        context: [{ linkState: 'insert' }],
        payload: {
          action: 'submitted',
          actionSubject: 'form',
          attributes: {
            linkState: 'edit',
          },
        },
      }),
    );

    expect(event).toStrictEqual(
      expect.objectContaining({
        sourceEvent: 'form submitted',
        linkState: 'edit',
      }),
    );
  });

  it('should should support getting a "confluence" style event with action and action subject on data object', () => {
    const event = processAttributesFromBaseEvent(
      new UIAnalyticsEvent({
        payload: {
          type: 'sendTrackEvent',
          data: {
            action: 'undo',
            actionSubject: 'add',
            attributes: {
              xyz: '123',
            },
          },
        },
      }),
    );

    expect(event).toStrictEqual(
      expect.objectContaining({
        sourceEvent: 'add undo',
        xyz: '123',
      }),
    );
  });
});
