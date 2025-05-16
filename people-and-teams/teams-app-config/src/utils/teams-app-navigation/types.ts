export type HostProduct = 'jira' | 'confluence' | 'home';

export type NavigationActionCommon = {
	orgId: string;
	cloudId: string;
	/**
	 * @deprecated this will only be used until we remove the embedded directory.
	 * Once traffic is fully migrated to the teams app, this can be removed.
	 */
	push?: (url: string) => void;
	/**
	 * @deprecated this is only required until we remove the embedded directory.
	 * Once traffic is fully migrated to the teams app, this can be removed.
	 */
	hostProduct?: HostProduct;
	/**
	 * By default, the navigation will open in a new tab once traffic is migrated to the teams app.
	 * If the traffic is not migrated, the default will be for the navigation to open in the same tab.
	 */
	shouldOpenInSameTab?: boolean;
	/**
	 * @deprecated this is only required until we remove the embedded directory.
	 * Once traffic is fully migrated to the teams app, this can be removed.
	 * Nav4 is a precondition to the Teams App migration.
	 */
	userHasNav4Enabled: boolean;
};

export type NavigationActionUser = {
	userId: string;
};
export type NavigationActionTeam = {
	teamId: string;
};
export type NavigationActionAgent = {
	agentId: string;
};
export type NavigationActionKudos = {
	kudosId: string;
};

export type NavigationAction = NavigationActionCommon &
	(
		| {
				type: 'LANDING' | 'DIRECTORY';
		  }
		| {
				type: 'USER';
				payload: NavigationActionUser;
		  }
		| {
				type: 'TEAM';
				payload: NavigationActionTeam;
		  }
		| {
				type: 'AGENT';
				payload: NavigationActionAgent;
		  }
		| {
				type: 'KUDOS';
				payload: NavigationActionKudos;
		  }
	);

export type NavigationResult = {
	onNavigate: (e?: React.MouseEvent | React.KeyboardEvent) => void;
	href: string;
};
