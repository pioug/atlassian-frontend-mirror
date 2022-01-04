import { ReportingLinesUser, TeamCentralReportingLinesData } from '../types';

import profiles from './profile-data';

const mappedProfileToReportingLines: ReportingLinesUser[] = profiles.map(
  (profile, index) => ({
    accountIdentifier: '123456:12345-67890-' + index,
    identifierType: 'ATLASSIAN_ID',
    pii: {
      name: profile.User.fullName,
      picture: profile.User.avatarUrl,
    },
  }),
);

const halfCount = Math.ceil(mappedProfileToReportingLines.length / 2);
export const reportingLinesData: TeamCentralReportingLinesData = {
  managers: mappedProfileToReportingLines.slice(0, halfCount),
  reports: mappedProfileToReportingLines.slice(-halfCount),
};
