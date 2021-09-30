import { AnalyticsListener as AnalyticsListenerNext } from '@atlaskit/analytics-next';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import Mention, { ANALYTICS_HOVER_DELAY } from '../../../components/Mention';
import ResourcedMention from '../../../components/Mention/ResourcedMention';
import { MentionStyle } from '../../../components/Mention/styles';
import { ELEMENTS_CHANNEL } from '../../../_constants';
import { MentionType, MentionNameStatus } from '../../../types';
import MentionResource, { MentionProvider } from '../../../api/MentionResource';
import { MentionNameResolver } from '../../../api/MentionNameResolver';
import {
  flushPromises,
  mockMentionData as mentionData,
  mockMentionProvider as mentionProvider,
} from '../_test-helpers';

const createPayload = (actionSubject: string, action: string) => ({
  payload: {
    action,
    actionSubject,
    attributes: {
      packageName: '@atlaskit/mention',
      packageVersion: expect.any(String),
      componentName: 'mention',
      accessLevel: 'CONTAINER',
      isSpecial: false,
      userId: mentionData.id,
    },
    eventType: 'ui',
  },
});

describe('<Mention />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Mention', () => {
    it('should render based on mention data', () => {
      const mention = mountWithIntl(<Mention {...mentionData} />);
      expect(mention.html()).toContain(mentionData.text);
    });

    it('should render a default lozenge if no accessLevel data and is not being mentioned', () => {
      const mention = mountWithIntl(<Mention {...mentionData} />);
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should render a default lozenge if the user has CONTAINER permissions but is not being mentioned', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel={'CONTAINER'} />,
      );
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should add a highlighted lozenge if `isHighlighted` is set to true', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} isHighlighted={true} />,
      );
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.SELF,
      );
    });

    it('should render a restricted style lozenge if the user has NONE permissions', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel={'NONE'} />,
      );
      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.RESTRICTED,
      );
    });

    it('should render a unrestricted style lozenge if the user has CONTAINER permissions', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel={'CONTAINER'} />,
      );

      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should render a unrestricted style lozenge if the user has CONTAINER permissions', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel={'APPLICATION'} />,
      );

      expect(mention.find(MentionStyle).prop('mentionType')).toEqual(
        MentionType.DEFAULT,
      );
    });

    it('should not display a tooltip if no accessLevel data', () => {
      const mention = mountWithIntl(<Mention {...mentionData} />);
      expect(mention.find(Tooltip)).toHaveLength(0);
    });

    it('should display tooltip if mentioned user does not have container permission', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel="NONE" />,
      );
      expect(mention.find(Tooltip)).toHaveLength(1);
    });

    it('should not display tooltip if mention is highlighted', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} isHighlighted={true} />,
      );
      expect(mention.find(Tooltip)).toHaveLength(0);
    });

    it('should dispatch onClick-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(<Mention {...mentionData} onClick={spy} />);
      mention.find(MentionStyle).simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenLastCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should dispatch lozenge.select analytics onClick-event', () => {
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mountWithIntl(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <Mention {...mentionData} accessLevel={'CONTAINER'} />
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('click');

      expect(analyticsNextHandlerSpy).toHaveBeenCalled();
      expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining(createPayload('mention', 'selected')),
        ELEMENTS_CHANNEL,
      );
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(
        <Mention {...mentionData} onMouseEnter={spy} />,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(
        <Mention {...mentionData} onMouseLeave={spy} />,
      );
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch lozenge.hover analytics event if hover delay is greater than the threshold', () => {
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mountWithIntl(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <Mention {...mentionData} accessLevel={'CONTAINER'} />
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY);

      expect(analyticsNextHandlerSpy).toHaveBeenCalledWith(
        expect.objectContaining(createPayload('mention', 'hovered')),
        ELEMENTS_CHANNEL,
      );
    });

    it('should not dispatch lozenge.hover analytics event for a hover delay bellow the threshold', () => {
      const analyticsNextHandlerSpy = jest.fn();
      const mention = mountWithIntl(
        <AnalyticsListenerNext
          onEvent={analyticsNextHandlerSpy}
          channel={ELEMENTS_CHANNEL}
        >
          <Mention {...mentionData} accessLevel={'CONTAINER'} />
        </AnalyticsListenerNext>,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY / 5);
      mention.find(MentionStyle).simulate('mouseleave');

      // to make sure the clearTimeout removed the scheduled task
      jest.runTimersToTime(ANALYTICS_HOVER_DELAY);

      expect(analyticsNextHandlerSpy).not.toBeCalled();
    });

    it('should render a stateless mention component with correct data attributes', () => {
      const mention = mountWithIntl(
        <Mention {...mentionData} accessLevel="NONE" />,
      );
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-mention-id')!.value,
      ).toEqual(mentionData.id);
      expect(
        mention.getDOMNode().attributes.getNamedItem('data-access-level')!
          .value,
      ).toEqual('NONE');
    });

    it('should have spell check disabled', () => {
      const mention = mountWithIntl(<Mention {...mentionData} />);
      expect(
        mention.getDOMNode().attributes.getNamedItem('spellcheck')!.value,
      ).toEqual('false');
    });

    it('should render @... if no text attribute is supplied', () => {
      const mention = mountWithIntl(<Mention {...mentionData} text="" />);
      expect(mention.text()).toEqual('@...');
    });
  });

  describe('ResourcedMention', () => {
    let resolvingMentionProvider: Promise<MentionProvider>;
    let mentionNameResolver: MentionNameResolver;
    beforeEach(() => {
      mentionNameResolver = {
        lookupName: jest.fn(),
        cacheName: jest.fn(),
      } as MentionNameResolver;
      resolvingMentionProvider = Promise.resolve(
        new MentionResource({
          url: 'dummyurl',
          mentionNameResolver,
        }),
      );
    });

    it('should render a stateless mention component based on mention data', () => {
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider()}
        />,
      );
      expect(mention.find(Mention).first().text()).toEqual(mentionData.text);
    });

    it('should render a mention and use supplied mention name even if resolving provider', () => {
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionData}
          mentionProvider={resolvingMentionProvider}
        />,
      );
      expect(mention.find(Mention).first().text()).toEqual(mentionData.text);
      expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(0);
    });

    it('prefers text from prop over mention resolver', async () => {
      const resolvedProps = {
        id: '1',
        name: 'resolved name',
        status: MentionNameStatus.OK,
      };
      ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
        resolvedProps,
      );
      const mentionProps = {
        id: '1',
        text: '',
      };
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionProps}
          mentionProvider={resolvingMentionProvider}
        />,
      );
      await flushPromises();
      expect(mention.find(Mention).first().text()).toEqual(
        `@${resolvedProps.name}`,
      );
      expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
      ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockClear();
      mention.setProps({ ...mentionData });
      expect(mention.find(Mention).first().text()).toEqual(mentionData.text);
      expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(0);
    });

    it('should render a highlighted stateless mention component if mentionProvider.shouldHighlightMention returns true', async () => {
      const mention = mountWithIntl(
        <ResourcedMention
          id="oscar"
          text="@Oscar Wallhult"
          mentionProvider={mentionProvider()}
        />,
      );

      await mentionProvider;
      mention.update();
      expect(
        mention.find(Mention).first().find(MentionStyle).prop('mentionType'),
      ).toEqual(MentionType.SELF);
    });

    it('should not render highlighted mention component if there is no mentionProvider', () => {
      const mention = mountWithIntl(
        <ResourcedMention id="oscar" text="@Oscar Wallhult" />,
      );
      expect(
        mention.find(Mention).first().find(MentionStyle).prop('mentionType'),
      ).toEqual(MentionType.DEFAULT);
    });

    it('should dispatch onClick-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider()}
          onClick={spy}
        />,
      );
      mention.find(MentionStyle).simulate('click');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
        expect.anything(),
      );
    });

    it('should dispatch onMouseEnter-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider()}
          onMouseEnter={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseenter');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    it('should dispatch onMouseLeave-event', () => {
      const spy = jest.fn();
      const mention = mountWithIntl(
        <ResourcedMention
          {...mentionData}
          mentionProvider={mentionProvider()}
          onMouseLeave={spy}
        />,
      );
      mention.find(MentionStyle).simulate('mouseleave');
      expect(spy).toBeCalled();
      expect(spy).toHaveBeenCalledWith(
        mentionData.id,
        mentionData.text,
        expect.anything(),
      );
    });

    describe('resolving mention name', () => {
      it('should render a mention and use the resolving provider to lookup the name (string result)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            {...mentionData}
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          {
            id: '123',
            name: 'cheese',
            status: MentionNameStatus.OK,
          },
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual('@cheese');
          done();
        });
      });

      it('should render a mention and use the resolving provider to lookup the name (string result, unknown)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            id={mentionData.id}
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          {
            id: mentionData.id,
            status: MentionNameStatus.UNKNOWN,
          },
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual(
            '@Unknown user -ABCD',
          );
          done();
        });
      });

      it('should render a mention and use the resolving provider to lookup the name (string result, service error)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            id="123"
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          {
            id: mentionData.id,
            status: MentionNameStatus.SERVICE_ERROR,
          },
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual(
            '@Unknown user 123',
          );
          done();
        });
      });

      it('should render a mention and use the resolving provider to lookup the name (Promise result)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            {...mentionData}
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          Promise.resolve({
            id: mentionData.id,
            name: 'bacon',
            status: MentionNameStatus.OK,
          }),
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual('@bacon');
          done();
        });
      });

      it('should render a mention and use the resolving provider to lookup the name (Promise result, unknown)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            {...mentionData}
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          Promise.resolve({
            id: mentionData.id,
            status: MentionNameStatus.UNKNOWN,
          }),
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual(
            '@Unknown user -ABCD',
          );
          done();
        });
      });

      it('should render a mention and use the resolving provider to lookup the name (Promise result, service error)', (done) => {
        const mention = mountWithIntl(
          <ResourcedMention
            id=""
            text=""
            mentionProvider={resolvingMentionProvider}
          />,
        );
        ((mentionNameResolver.lookupName as any) as jest.SpyInstance).mockReturnValue(
          Promise.resolve({
            id: mentionData.id,
            status: MentionNameStatus.SERVICE_ERROR,
          }),
        );
        setImmediate(() => {
          expect(mentionNameResolver.lookupName).toHaveBeenCalledTimes(1);
          expect(mention.find(Mention).first().text()).toEqual(
            '@Unknown user ',
          );
          done();
        });
      });
    });
  });
});
