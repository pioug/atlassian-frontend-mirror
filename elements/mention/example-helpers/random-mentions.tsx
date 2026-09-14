import { mentions as mentionsData } from '@atlaskit/util-data-test/mention-story-data'; // eslint-disable-line import/no-extraneous-dependencies

export const randomMentions = (): (
	| {
			accessLevel: string;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge: string;
			mentionName: string;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence: {
				status: string;
				time: string;
			};
			userType?: undefined;
	  }
	| {
			accessLevel: string;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge: string;
			mentionName: string;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence: {
				status: string;
				time?: undefined;
			};
			userType?: undefined;
	  }
	| {
			accessLevel?: undefined;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge?: undefined;
			mentionName: string;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence: {
				status: string;
				time: string;
			};
			userType?: undefined;
	  }
	| {
			accessLevel: string;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge: string;
			mentionName: string;
			name: string;
			nickname: string;
			nonLicensedUser?: undefined;
			presence: {
				status: string;
				time?: undefined;
			};
			userType?: undefined;
	  }
	| {
			accessLevel: string;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge?: undefined;
			mentionName: string;
			name: string;
			nickname: string;
			nonLicensedUser?: undefined;
			presence: {
				status: string;
				time?: undefined;
			};
			userType?: undefined;
	  }
	| {
			accessLevel?: undefined;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge?: undefined;
			mentionName: string;
			name: string;
			nickname: string;
			nonLicensedUser?: undefined;
			presence?: undefined;
			userType?: undefined;
	  }
	| {
			accessLevel?: undefined;
			avatarUrl?: undefined;
			context?: undefined;
			id: string;
			lozenge?: undefined;
			mentionName: string;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence: {
				status?: undefined;
				time: string;
			};
			userType?: undefined;
	  }
	| {
			accessLevel: string;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge?: undefined;
			mentionName: string;
			name: string;
			nickname: string;
			nonLicensedUser: boolean;
			presence: {
				status: string;
				time?: undefined;
			};
			userType?: undefined;
	  }
	| {
			accessLevel?: undefined;
			avatarUrl: string;
			context?: undefined;
			id: string;
			lozenge: string;
			mentionName: string;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence?: undefined;
			userType?: undefined;
	  }
	| {
			accessLevel?: undefined;
			avatarUrl: string;
			context: {
				includesYou: boolean;
				memberCount: number;
				members: never[];
				teamLink: string;
			};
			id: string;
			lozenge?: undefined;
			mentionName?: undefined;
			name: string;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			presence?: undefined;
			userType: string;
	  }
)[] => mentionsData.filter(() => Math.random() < 0.7);
