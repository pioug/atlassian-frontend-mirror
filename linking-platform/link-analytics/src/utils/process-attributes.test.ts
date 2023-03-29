import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import {
  getDomainFromUrl,
  processAttributesFromBaseEvent,
} from './process-attributes';

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

  it('should support getting a "confluence" style event with action and action subject on data object', () => {
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

describe('getDomainFromUrl', () => {
  it('should extract the domain from a URL string', () => {
    const domain = getDomainFromUrl('https://test.com/xyz');

    expect(domain).toBe('test.com');
  });

  it('should extract the domain from a URL string without the protocol defined', () => {
    const domain = getDomainFromUrl('abc.test.com/xyz/123');

    expect(domain).toBe('abc.test.com');
  });

  it('should return null for non-URL strings', () => {
    const domain = getDomainFromUrl('invalid url');

    expect(domain).toBe(null);
  });
});
