export const PACKAGE_META_DATA: {
	packageName: string;
	packageVersion: string;
} = {
	packageName: process.env._PACKAGE_NAME_ ?? '',
	packageVersion: process.env._PACKAGE_VERSION_ ?? '',
};

export const TEAM_SUBJECT = 'teamProfileCard';

export const USER_SUBJECT = 'profilecard';

export const AGENT_SUBJECT = 'rovoAgentProfilecard';
