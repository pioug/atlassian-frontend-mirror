import React from 'react';
import { Text } from '@atlaskit/primitives/compiled';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	mentions as mentionsData,
	mentionSampleAvatarUrl,
	mentionResourceProvider,
	mentionSlowResourceProvider,
} from '@atlaskit/util-data-test/mention-story-data';

import {
	type MentionDescription,
	type OnMentionEvent,
	type MentionEventHandler,
} from '../src/types';
import debug from '../src/util/logger';
import type { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

// eslint-disable-next-line import/no-extraneous-dependencies
export { MockPresenceResource } from '@atlaskit/util-data-test/mock-presence-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
export { mentions } from '@atlaskit/util-data-test/mention-story-data';

export const resourceProvider: MockMentionResource = mentionResourceProvider;
export const slowResourceProvider: MockMentionResource = mentionSlowResourceProvider;
export const sampleAvatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIACAAIAMBIgACEQEDEQH/xAB1AAEAAwEAAAAAAAAAAAAAAAAHAgUGCBAAAQMCBQMDAgcAAAAAAAAAAQIDBAURAAYSIUEHEzEUImEVcSMyQlGBweEBAAMBAAAAAAAAAAAAAAAAAAMEBwURAAICAgMBAQEAAAAAAAAAAAECAxEABBIhIkExgf/aAAwDAQACEQMRAD8AxWVci1ipwmJdT7seKFbIMgLKrGxTYkkH4NsMH1D0UFwsqsAACom1zbxvje9QMoU6BVnnFPswkqBX71JQkj7nnBFmwNx6JJmw5zUtkKUlCmFhaCAkG+21/IxCZ2keQ2KA6/uWzyF5X2cs1T1To62n3jYoWUuDfyLf3gUzhl/MuUI06fDLjdMBGh5EtCyQogBOm2q9+L+MJ1Ep0p1SFd5lptwqSe6sJCRpBvvySQP4xoqZlFt6QluQ4iSUL1eQQP8AcG1pHieqsHFHcVyv8xB6l0hnNOUrzGPUKlsBBXYa0FJ/MkkEbEA253GB/I/SeH0wy1PocFtoU6pOeqbbUjthp3TY8nyPngbADHT1ejCi02LGaShx6GlJKFH2rPlV/ub4H85yI+bSqPGdRSZjThdbYeSUNlRFlAnwQfixGNTZn4zSRq3hjdYprRK0cbyD2ABeBHULpiOo8ymrluBNMpai4lgoU5+MFg6zpULWtbkEXww5Ey/EpFOhoYQtllsDVqPudI5V9/OI0ZNMyahuI4tqsy/euykak90nlXgC9hsNv3xd0xuTMImylLaSE3S3+kE8cYHJslwsQbyvzADXRHaSuz9z/9k=' =
	mentionSampleAvatarUrl;

export const withLocalResource = <T extends { avatarUrl?: string }>(items: T[]): T[] => {
	return items.map((item) => ({ ...item, avatarUrl: mentionSampleAvatarUrl }));
};

export const mentionsWithLocalResource: MentionDescription[] = withLocalResource(mentionsData);

export const generateMentionItem = (
	component: JSX.Element,
	description?: string,
): React.JSX.Element => (
	<div>
		<Text as="p">{description}</Text>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<ul style={{ padding: 0 }}>{component}</ul>
	</div>
);

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

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
	debug('onSelection ', mention);

export const onMentionEvent: MentionEventHandler = (
	mentionId: string,
	text: string,
	e?: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e ? e.type : '');
