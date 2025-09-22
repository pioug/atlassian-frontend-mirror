import { type ReportingLinesUser, type TeamCentralReportingLinesData } from '../types';

import profiles, { avatarImages } from './profile-data';

const mappedProfileToReportingLines: ReportingLinesUser[] = profiles.map((profile, index) => ({
	accountIdentifier: '123456:12345-67890-' + index,
	identifierType: 'ATLASSIAN_ID',
	pii: {
		name: profile.User.fullName,
		picture: index < avatarImages.length ? avatarImages[index] : avatarImages[0],
	},
}));

const halfCount = Math.ceil(mappedProfileToReportingLines.length / 2);
export const reportingLinesData: TeamCentralReportingLinesData = {
	managers: mappedProfileToReportingLines.slice(0, halfCount),
	reports: mappedProfileToReportingLines.slice(-halfCount),
};
