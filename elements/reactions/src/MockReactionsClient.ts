import { EmojiId } from '@atlaskit/emoji/types';
import { Reactions, Client, ReactionSummary } from './types';
import { constants } from './shared';

export const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';
export const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
export const getReactionSummary: (
  shortName: string,
  count: number,
  reacted: boolean,
) => ReactionSummary = (shortName, count, reacted) => {
  return {
    ari,
    containerAri,
    emojiId: (constants.DefaultReactionsByShortName.get(shortName) as EmojiId)
      .id!,
    count,
    reacted,
  };
};

export const getUser = (id: string, displayName: string) => ({
  id,
  displayName,
});

const getReactionKey = (containerAri: string, ari: string): string => {
  return `${containerAri}|${ari}`;
};

const defaultUsers = [
  getUser('oscar', 'Oscar Wallhult'),
  getUser('julien', 'Julien Michel Hoarau'),
  getUser('craig', 'Craig Petchell'),
  getUser('jerome', 'Jerome Touffe-Blin'),
  getUser('esoares', 'Eduardo Soares'),
  getUser('lpereira', 'Luiz Pereira'),
  getUser('pcurren', 'Paul Curren'),
  getUser('ttjandra', 'Tara Tjandra'),
  getUser('severington', 'Ste Everington'),
  getUser('sguillope', 'Sylvain Guillope'),
  getUser('alunnon', 'Alex Lunnon'),
];

export const mockData: {
  [key: string]: ReactionSummary[];
} = {
  [getReactionKey(containerAri, ari)]: [
    getReactionSummary(':fire:', 1, true),
    getReactionSummary(':thumbsup:', 999, false),
    getReactionSummary(':astonished:', 9, false),
    getReactionSummary(':heart:', 99, false),
  ],
};

/**
 * Mocked version of the client to fetch user information
 */
export class MockReactionsClient implements Client {
  private delay: number;

  constructor(delay = 0) {
    this.delay = delay;
  }

  private delayPromise = () =>
    new Promise((resolve) => window.setTimeout(resolve, this.delay));

  async getReactions(containerAri: string, aris: string[]): Promise<Reactions> {
    await this.delayPromise();
    return aris.reduce((results, ari) => {
      const reactionKey = getReactionKey(containerAri, ari);
      results[ari] = mockData[reactionKey] || [];
      return results;
    }, {} as Reactions);
  }

  async getDetailedReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary> {
    await this.delayPromise();
    const reactionKey = `${containerAri}|${ari}`;
    const reactionsMockData = mockData[reactionKey];
    if (reactionsMockData) {
      const reaction = reactionsMockData.find(
        (reaction_1) => reaction_1.emojiId === emojiId,
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
  }

  async addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    await this.delayPromise();
    const reactionKey = getReactionKey(containerAri, ari);
    let found = false;
    const reactionsMockData = mockData[reactionKey];
    if (reactionsMockData) {
      mockData[reactionKey] = reactionsMockData.map((reaction) => {
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
      mockData[reactionKey] = [
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
    return mockData[reactionKey];
  }

  async deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionSummary[]> {
    await this.delayPromise();
    const reactionKey = getReactionKey(containerAri, ari);
    mockData[reactionKey] = mockData[reactionKey]
      .map((reaction) => {
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
      .filter((reaction_1) => !!reaction_1) as ReactionSummary[];
    return mockData[reactionKey];
  }
}
