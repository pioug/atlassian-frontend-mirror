import { Team } from '@atlaskit/user-picker';
import {
  cancelShare,
  copyLinkButtonClicked,
  errorEncountered,
  formShareSubmitted,
  shareTriggerButtonClicked,
  shortUrlGenerated,
  shortUrlRequested,
} from '../../../components/analytics';
import { DialogContentState, OriginTracing } from '../../../types';

describe('share analytics', () => {
  const mockShareOrigin = (): OriginTracing => ({
    id: 'abc-123',
    addToUrl: (link: string): string => `${link}?originId=abc-123`,
    toAnalyticsAttributes: jest.fn(() => ({
      originIdGenerated: 'abc-123',
      originProduct: 'jest',
    })),
  });

  describe('errorEncountered', () => {
    it('should create a correct event payload', () => {
      expect(errorEncountered('foo')).toMatchObject({
        eventType: 'operational',
        action: 'encountered',
        actionSubject: 'error',
        actionSubjectId: 'foo',
        source: 'shareModal',
        attributes: expect.objectContaining({
          source: 'shareModal',
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('shareTriggerButtonClicked', () => {
    it('should create event payload', () => {
      expect(shareTriggerButtonClicked()).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'share',
        source: 'shareModal',
        attributes: expect.objectContaining({
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('cancelShare', () => {
    it('should create event payload', () => {
      expect(cancelShare(100)).toMatchObject({
        eventType: 'ui',
        action: 'pressed',
        actionSubject: 'keyboardShortcut',
        actionSubjectId: 'cancelShare',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('shortUrlRequested', () => {
    it('should create a correct event payload', () => {
      expect(shortUrlRequested()).toMatchObject({
        eventType: 'operational',
        action: 'requested',
        actionSubject: 'shortUrl',
        actionSubjectId: undefined,
        source: 'shareModal',
        attributes: expect.objectContaining({
          source: 'shareModal',
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
        }),
      });
    });
  });

  describe('shortUrlGenerated', () => {
    it('should create a correct event payload', () => {
      expect(shortUrlGenerated(100, false)).toMatchObject({
        eventType: 'operational',
        action: 'generated',
        actionSubject: 'shortUrl',
        actionSubjectId: undefined,
        source: 'shareModal',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          source: 'shareModal',
          tooSlow: false,
        }),
      });
    });
  });

  describe('copyLinkButtonClicked', () => {
    it('should create event payload without origin id', () => {
      expect(copyLinkButtonClicked(100)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'copyShareLink',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          shortUrl: undefined,
          isPublicLink: false,
        }),
      });
    });

    it('should create event payload with origin id', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      expect(
        copyLinkButtonClicked(100, 'issue', shareOrigin, undefined, 'ari'),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'copyShareLink',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          originIdGenerated: 'abc-123',
          shortUrl: undefined,
          originProduct: 'jest',
          contentType: 'issue',
          ari: 'ari',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });
  });

  describe('formShareSubmitted', () => {
    const data: DialogContentState = {
      users: [
        {
          type: 'user',
          id: 'abc-123',
          name: 'some user',
        },
        {
          type: 'team',
          id: '123-abc',
          name: 'some user',
        },
        {
          type: 'email',
          id: 'test@atlassian.com',
          name: 'some user',
        },
      ],
      comment: {
        format: 'plain_text',
        value: 'Some comment',
      },
    };
    it('should create event payload without share content type and origin id', () => {
      expect(formShareSubmitted(100, data)).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          duration: expect.any(Number),
          teamCount: 1,
          userCount: 1,
          emailCount: 1,
          users: ['abc-123'],
          teams: ['123-abc'],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: true,
          messageLength: 12,
          isPublicLink: false,
        }),
      });
    });

    it('should create event payload without origin id', () => {
      expect(formShareSubmitted(100, data, 'issue')).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
          duration: expect.any(Number),
          teamCount: 1,
          userCount: 1,
          emailCount: 1,
          users: ['abc-123'],
          teams: ['123-abc'],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: true,
          messageLength: 12,
        }),
      });
    });

    it('should create event payload with origin id', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      expect(formShareSubmitted(100, data, 'issue', shareOrigin)).toMatchObject(
        {
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'submitShare',
          attributes: expect.objectContaining({
            contentType: 'issue',
            duration: expect.any(Number),
            teamCount: 1,
            userCount: 1,
            emailCount: 1,
            users: ['abc-123'],
            teams: ['123-abc'],
            packageVersion: expect.any(String),
            packageName: '@atlaskit/share',
            isMessageEnabled: true,
            messageLength: 12,
            originIdGenerated: 'abc-123',
            originProduct: 'jest',
          }),
        },
      );
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });

    it('should create event payload with origin id', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();
      expect(formShareSubmitted(100, data, 'issue', shareOrigin)).toMatchObject(
        {
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'submitShare',
          attributes: expect.objectContaining({
            contentType: 'issue',
            duration: expect.any(Number),
            teamCount: 1,
            userCount: 1,
            emailCount: 1,
            users: ['abc-123'],
            teams: ['123-abc'],
            packageVersion: expect.any(String),
            packageName: '@atlaskit/share',
            isMessageEnabled: true,
            messageLength: 12,
            originIdGenerated: 'abc-123',
            originProduct: 'jest',
          }),
        },
      );
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });

    // team analytics related
    const teams: Team[] = [
      {
        type: 'team',
        id: 'abc-123',
        name: 'some team 1',
        memberCount: 2,
      },
      {
        type: 'team',
        id: 'abc-1234',
        name: 'some team 2',
        memberCount: 5,
      },
    ];

    const dataWithMembers: DialogContentState = {
      users: teams,
      comment: {
        format: 'plain_text',
        value: 'Some comment',
      },
    };
    it('should create event payload with team member counts', () => {
      const shareOrigin: OriginTracing = mockShareOrigin();

      expect(
        formShareSubmitted(100, dataWithMembers, 'issue', shareOrigin),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
          duration: expect.any(Number),
          teamCount: 2,
          userCount: 0,
          emailCount: 0,
          teams: ['abc-123', 'abc-1234'],
          teamUserCounts: [2, 5],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: true,
          messageLength: 12,
          originIdGenerated: 'abc-123',
          originProduct: 'jest',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });

    it('should create event payload with team member counts when some ember counts are undefined', () => {
      teams.push({
        type: 'team',
        id: 'abc-1235',
        name: 'some team 2',
      });
      const shareOrigin: OriginTracing = mockShareOrigin();

      expect(
        formShareSubmitted(100, dataWithMembers, 'issue', shareOrigin),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          contentType: 'issue',
          duration: expect.any(Number),
          teamCount: 3,
          userCount: 0,
          emailCount: 0,
          teams: ['abc-123', 'abc-1234', 'abc-1235'],
          teamUserCounts: [2, 5, 0],
          packageVersion: expect.any(String),
          packageName: '@atlaskit/share',
          isMessageEnabled: true,
          messageLength: 12,
          originIdGenerated: 'abc-123',
          originProduct: 'jest',
        }),
      });
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledTimes(1);
      expect(shareOrigin.toAnalyticsAttributes).toHaveBeenCalledWith({
        hasGeneratedId: true,
      });
    });

    it('should create event payload with isPublicLink attribute for public links', () => {
      expect(
        formShareSubmitted(100, data, undefined, undefined, true),
      ).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'submitShare',
        attributes: expect.objectContaining({
          isPublicLink: true,
        }),
      });
    });
  });
});
