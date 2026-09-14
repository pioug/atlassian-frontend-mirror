import { mentions as mentionsData } from '@atlaskit/util-data-test/mention-story-data';

export const randomMentions = (): (
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			lozenge: string;
			accessLevel: string;
			presence: {
				status: string;
				time: string;
			};
			nickname?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			lozenge: string;
			accessLevel: string;
			presence: {
				status: string;
				time?: undefined;
			};
			nickname?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			presence: {
				status: string;
				time: string;
			};
			lozenge?: undefined;
			accessLevel?: undefined;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			nickname: string;
			lozenge: string;
			accessLevel: string;
			presence: {
				status: string;
				time?: undefined;
			};
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			nickname: string;
			accessLevel: string;
			presence: {
				status: string;
				time?: undefined;
			};
			lozenge?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			nickname: string;
			lozenge?: undefined;
			accessLevel?: undefined;
			presence?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			name: string;
			mentionName: string;
			presence: {
				time: string;
				status?: undefined;
			};
			avatarUrl?: undefined;
			lozenge?: undefined;
			accessLevel?: undefined;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			mentionName: string;
			nickname: string;
			accessLevel: string;
			presence: {
				status: string;
				time?: undefined;
			};
			nonLicensedUser: boolean;
			lozenge?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			lozenge: string;
			mentionName: string;
			accessLevel?: undefined;
			presence?: undefined;
			nickname?: undefined;
			nonLicensedUser?: undefined;
			userType?: undefined;
			context?: undefined;
	  }
	| {
			id: string;
			avatarUrl: string;
			name: string;
			userType: string;
			context: {
				members: never[];
				includesYou: boolean;
				memberCount: number;
				teamLink: string;
			};
			mentionName?: undefined;
			lozenge?: undefined;
			accessLevel?: undefined;
			presence?: undefined;
			nickname?: undefined;
			nonLicensedUser?: undefined;
	  }
)[] => mentionsData.filter(() => Math.random() < 0.7);
