import { print } from 'graphql';
import gql from 'graphql-tag';

export default print(gql`
	fragment ReportingLinesUserPII on UserPII {
		name
		picture
		accountStatus
		extendedProfile {
			jobTitle
		}
	}

	fragment ReportingLinesUserFragment on ReportingLinesUser {
		accountIdentifier
		identifierType
		numberOfDirectReports
		numberOfTotalReports
		pii {
			...ReportingLinesUserPII
		}
	}

	query ReportingLines($aaid: String) {
		reportingLines(aaidOrHash: $aaid) {
			lastModifiedDate
			user {
				...ReportingLinesUserFragment
			}
			managers {
				...ReportingLinesUserFragment
			}
			peers {
				...ReportingLinesUserFragment
			}
			reports {
				...ReportingLinesUserFragment
			}
		}
	}
`);
