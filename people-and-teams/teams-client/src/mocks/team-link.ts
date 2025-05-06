import type FakerType from 'faker';
import times from 'lodash/times';

import { type TeamLink } from '../types';

type MockConfig = {
	faker: typeof FakerType;
};

export const randomTeamLinks =
	({ faker }: MockConfig) =>
	(n = 10, customProps = {}): TeamLink[] => {
		return times<TeamLink>(n, () => {
			return {
				linkId: faker.random.uuid(),
				contentTitle: faker.lorem.words(Math.ceil(Math.random() * 80)),
				description: faker.lorem.words(Math.ceil(Math.random() * 120)),
				linkUri: faker.internet.url(),
				...customProps,
			};
		});
	};
