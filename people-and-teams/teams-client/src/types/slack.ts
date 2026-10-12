export interface TeamInSlack {
	id: string;
	connected: boolean;
	slackChannelId: string;
	slackChannelName: string;
	usergroupHandle: string;
}

export interface TeamSlackRequestOptions {
	skipAuthRedirect?: boolean;
}
