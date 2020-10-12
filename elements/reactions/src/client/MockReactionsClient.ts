import { EmojiId } from '@atlaskit/emoji/types';
import { defaultReactionsByShortName } from '../components/Selector';
import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';
import { ReactionClient } from './ReactionClient';

export const containerAri: string = 'ari:cloud:owner:demo-cloud-id:container/1';
export const ari: string = 'ari:cloud:owner:demo-cloud-id:item/1';
export const reaction = (
  shortName: string,
  count: number,
  reacted: boolean,
) => ({
  ari,
  containerAri,
  emojiId: (defaultReactionsByShortName.get(shortName) as EmojiId).id!,
  count,
  reacted,
});

export const user = (id: string, displayName: string) => ({ id, displayName });

const objectReactionKey = (containerAri: string, ari: string): string => {
  return `${containerAri}|${ari}`;
};

const defaultUsers = [
  user('oscar', 'Oscar Wallhult'),
  user('julien', 'Julien Michel Hoarau'),
  user('craig', 'Craig Petchell'),
  user('jerome', 'Jerome Touffe-Blin'),
  user('esoares', 'Eduardo Soares'),
  user('lpereira', 'Luiz Pereira'),
  user('pcurren', 'Paul Curren'),
  user('ttjandra', 'Tara Tjandra'),
  user('severington', 'Ste Everington'),
  user('sguillope', 'Sylvain Guillope'),
  user('alunnon', 'Alex Lunnon'),
];

export class MockReactionsClient implements ReactionClient {
  private delay: number;

  public mockData: {
    [key: string]: ReactionSummary[];
  } = {
    [objectReactionKey(containerAri, ari)]: [
      reaction(':fire:', 1, true),
      reaction(':thumbsup:', 9, false),
      reaction(':thumbsdown:', 5, false),
      reaction(':heart_eyes:', 100, false),
    ],
  };

  constructor(delay: number = 0) {
    this.delay = delay;
  }

  private delayPromise = () =>
    new Promise(resolve => window.setTimeout(resolve, this.delay));

  getReactions(containerAri: string, aris: string[]): Promise<Reactions> {
    return this.delayPromise().then(() =>
      aris.reduce((results, ari) => {
        const reactionKey = objectReactionKey(containerAri, ari);
        results[ari] = this.mockData[reactionKey] || [];
        return results;
      }, {} as Reactions),
    );
  }

  getDetailedReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary> {
    return this.delayPromise().then(() => {
      const reactionKey = `${containerAri}|${ari}`;
      const reactionsMockData = this.mockData[reactionKey];

      if (reactionsMockData) {
        const reaction = reactionsMockData.find(
          reaction => reaction.emojiId === emojiId,
        );

        if (reaction) {
          const users = [...defaultUsers]
            .slice(
              Math.floor(Math.random() * 4),
              Math.floor(Math.random() * 9) + 4,
            )
            .slice(0, reaction.count);
          return {
            ...reaction,
            users,
          };
        }
      }
      return {
        containerAri,
        ari,
        emojiId,
        count: 1,
        reacted: true,
        users: [],
      };
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    return this.delayPromise().then(() => {
      const reactionKey = objectReactionKey(containerAri, ari);
      let found = false;
      const reactionsMockData = this.mockData[reactionKey];

      if (reactionsMockData) {
        this.mockData[reactionKey] = reactionsMockData.map(reaction => {
          if (reaction.emojiId === emojiId) {
            found = true;
            return {
              ...reaction,
              count: reaction.count + 1,
              reacted: true,
            };
          }
          return reaction;
        });
      }
      if (!found) {
        this.mockData[reactionKey] = [
          ...(reactionsMockData ? reactionsMockData : []),
          {
            containerAri,
            ari,
            emojiId,
            count: 1,
            reacted: true,
          },
        ];
      }
      return this.mockData[reactionKey];
    });
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    return this.delayPromise().then(() => {
      const reactionKey = objectReactionKey(containerAri, ari);
      this.mockData[reactionKey] = this.mockData[reactionKey]
        .map(reaction => {
          if (reaction.emojiId === emojiId) {
            if (reaction.count === 1) {
              return undefined;
            }
            return {
              ...reaction,
              count: reaction.count - 1,
              reacted: false,
            };
          }
          return reaction;
        })
        .filter(reaction => !!reaction) as ReactionSummary[];
      return this.mockData[reactionKey];
    });
  }
}
