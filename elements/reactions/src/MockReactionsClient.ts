import { type EmojiId } from '@atlaskit/emoji/types';
import { type Reactions, type Client, type ReactionSummary } from './types';
import { DefaultReactionsByShortName, ExtendedReactionsByShortName } from './shared/constants';

export const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';
export const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
export const getReactionSummary: (
	shortName: string,
	count: number,
	reacted: boolean,
	extendedReactions?: boolean,
) => ReactionSummary = (shortName, count, reacted, extendedReactions) => {
	const getReactionsByShortName = extendedReactions
		? ExtendedReactionsByShortName.get(shortName)
		: DefaultReactionsByShortName.get(shortName);
	return {
		ari,
		containerAri,
		emojiId: (getReactionsByShortName as EmojiId).id!,
		count,
		reacted,
		users: defaultUsers,
	};
};

export const getUser = (id: string, displayName: string) => ({
	id,
	displayName,
	profilePicture: {
		path: 'https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg',
	},
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
	getUser('bsmith', 'Bob Smith'),
	getUser('jdoe', 'Jane Doe'),
	getUser('mhomes', 'Mary Homes'),
	getUser('ckent', 'Clark Kent'),
];

export const simpleMockData: {
	[key: string]: ReactionSummary[];
} = {
	[getReactionKey(containerAri, ari)]: [
		getReactionSummary(':fire:', 1, true),
		getReactionSummary(':astonished:', 99, false),
		getReactionSummary(':heart:', 44, false), // Widest character
	],
};

const extendedMockData: {
	[key: string]: ReactionSummary[];
} = {
	[getReactionKey(containerAri, ari)]: [
		getReactionSummary(':fire:', 1, true, true),
		getReactionSummary(':thumbsup:', 999, false, true),
		getReactionSummary(':astonished:', 9, false, true),
		getReactionSummary(':heart:', 99, false, true),
		getReactionSummary(':thinking:', 10, false, true),
		getReactionSummary(':clap:', 99, false, true),
		getReactionSummary(':thumbsdown:', 2, false, true),
		getReactionSummary(':bulb:', 16, false, true),
		getReactionSummary(':star:', 9999, false, true),
		getReactionSummary(':green_heart:', 9, false, true),
		getReactionSummary(':blue_heart:', 8392, false, true),
		getReactionSummary(':broken_heart:', 1, false, true),
		getReactionSummary(':grinning:', 10601, false, true),
		getReactionSummary(':slight_smile:', 99, false, true),
	],
};

/**
 * Mocked version of the client to fetch user information
 */
export class MockReactionsClient implements Client {
	private delay: number;
	private mockData: { [key: string]: ReactionSummary[] };

	constructor(delay = 0, showExtendedReactions = false) {
		this.delay = delay;
		this.mockData = showExtendedReactions ? extendedMockData : simpleMockData;
	}

	private delayPromise = () => new Promise((resolve) => window.setTimeout(resolve, this.delay));

	async getReactions(containerAri: string, aris: string[]): Promise<Reactions> {
		await this.delayPromise();
		return aris.reduce((results, ari) => {
			const reactionKey = getReactionKey(containerAri, ari);
			results[ari] = this.mockData[reactionKey] || [];
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
		const reactionsMockData = this.mockData[reactionKey];
		if (reactionsMockData) {
			const reaction = reactionsMockData.find((reaction_1) => reaction_1.emojiId === emojiId);

			if (reaction) {
				const users = [...defaultUsers]
					.slice(Math.floor(Math.random() * 4), Math.floor(Math.random() * 9) + 4)
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
		const reactionsMockData = this.mockData[reactionKey];
		if (reactionsMockData) {
			this.mockData[reactionKey] = reactionsMockData.map((reaction) => {
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
	}

	async deleteReaction(
		containerAri: string,
		ari: string,
		emojiId: string,
	): Promise<ReactionSummary[]> {
		await this.delayPromise();
		const reactionKey = getReactionKey(containerAri, ari);
		this.mockData[reactionKey] = this.mockData[reactionKey]
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
		return this.mockData[reactionKey];
	}
}
