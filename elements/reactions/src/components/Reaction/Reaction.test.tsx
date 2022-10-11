import React from 'react';
import { ReactWrapper, EnzymePropSelector } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  Emoji,
  EmojiDescription,
  EmojiProvider,
  toEmojiId,
} from '@atlaskit/emoji';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import { FlashAnimation } from '../FlashAnimation';
import { Reaction } from '../Reaction';
import { ReactionTooltip } from '../ReactionTooltip';
import {
  ReactionSummary,
  ReactionClick,
  ReactionMouseEnter,
  User,
} from '../../types';

/**
 * Helper function for tests where explicit calls to update() are needed
 * for Enzyme 3 when React components' internal state has changed
 *
 * Only the root node can be updated but find() can be called on child nodes
 * If no child is passed in, find is called on the root node
 *
 * @param root ReactWrapper to update
 * @param prop Child component to find
 * @param child Optional child of root that find should be called on
 */
export function hasSelector(
  root: ReactWrapper<any, any>,
  prop: EnzymePropSelector,
  child?: ReactWrapper<any, any>,
): boolean {
  const component = child || root;
  root.update();
  return component.find(prop).length > 0;
}

const emojiRepository = getTestEmojiRepository();
const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const grinning: EmojiDescription = emojiRepository.findByShortName(
  ':grinning:',
) as EmojiDescription;

/**
 * create a summary reaction object
 * @param count number of selections of the emoji
 * @param reacted does the emoji been clicked
 * @param users list of users selecting the emoji
 * @returns ReactionSummary object
 */
const getReaction = (
  count: number,
  reacted: boolean,
  users?: User[],
): ReactionSummary => ({
  ari,
  containerAri,
  emojiId: toEmojiId(grinning).id!,
  count,
  reacted,
  users,
});

/**
 * Render a <Reaction /> component with the given props.
 * @param reacted does the emoji been clicked
 * @param count number of selections of the emoji
 * @param onClick click handler
 * @param onMouseEnter onMouseEnter handler
 * @param enableFlash show custom animation or render as standard without animation (defaults to false)
 * @returns JSX.Element
 */
const renderReaction = (
  reacted: boolean,
  count: number,
  onClick: ReactionClick,
  onMouseEnter: ReactionMouseEnter,
  enableFlash = false,
) => (
  <Reaction
    reaction={getReaction(count, reacted)}
    emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    flash={enableFlash}
  />
);

describe('@atlaskit/reactions/components/Reaction', () => {
  it('should render emoji with resolved emoji data', (done) => {
    const reaction = mountWithIntl(
      renderReaction(
        false,
        1,
        () => {},
        () => {},
      ),
    );

    waitUntil(() => hasSelector(reaction, Emoji)).then(() => {
      const emoji = reaction.find(Emoji).first();
      expect(emoji.length).toEqual(1);
      const emojiDesc = emoji.prop('emoji');
      expect(emojiDesc.id).toEqual(grinning.id);
      done();
    });
  });

  it('should call onClick on click', () => {
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();
    const reaction = mountWithIntl(
      renderReaction(false, 1, onClickSpy, onMouseEnterSpy, false),
    );

    reaction.find('button').first().simulate('mouseup', { button: 0 });
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should delegate flash to Flash component', () => {
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();
    const reaction = mountWithIntl(
      renderReaction(true, 10, onClickSpy, onMouseEnterSpy, true),
    );
    const flashComponent = reaction.find(FlashAnimation);

    expect(flashComponent.prop('flash')).toBeTruthy();
  });

  it('should render ReactionTooltip', () => {
    const onClickSpy = jest.fn();
    const onMouseEnterSpy = jest.fn();
    const reaction = mountWithIntl(
      renderReaction(false, 1, onClickSpy, onMouseEnterSpy),
    );

    const tooltip = reaction.find(ReactionTooltip);
    expect(tooltip.prop('reaction')).toEqual(getReaction(1, false));
  });

  describe('with analytics', () => {
    const onEvent = jest.fn();

    const ReactionWithAnalyticsListener = (props: {
      reacted: boolean;
      count: number;
      onClick: ReactionClick;
      onMouseEnter?: ReactionMouseEnter;
      users?: User[];
    }) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reaction
          reaction={getReaction(props.count, props.reacted, props.users)}
          emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
          onClick={props.onClick}
          onMouseEnter={props.onMouseEnter}
        />
      </AnalyticsListener>
    );

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger clicked for Reaction', () => {
      const component = mountWithIntl(
        <ReactionWithAnalyticsListener
          reacted={false}
          count={10}
          onClick={jest.fn()}
        />,
      );
      component.find('button').first().simulate('mouseup', { button: 0 });
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'clicked',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              added: true,
              emojiId: toEmojiId(grinning).id!,
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });

    it('should trigger hovered for Reaction', () => {
      const component = mountWithIntl(
        <ReactionWithAnalyticsListener
          reacted={false}
          count={10}
          onClick={jest.fn()}
          onMouseEnter={jest.fn()}
        />,
      );
      component.find('button').first().simulate('mouseEnter');
      component.setProps({
        users: [
          {
            id: 'user-1',
            displayName: 'Luiz',
          },
        ],
      });
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'hovered',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              duration: expect.any(Number),
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });
  });
});
