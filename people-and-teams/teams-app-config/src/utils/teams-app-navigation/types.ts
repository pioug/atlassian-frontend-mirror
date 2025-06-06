export type HostProduct = 'jira' | 'confluence' | 'home';

// Require at least one of orgId or cloudId
type RequireOrgIdOrCloudId =
	| {
			orgId: string;
			/**
			 * Optional, but should always be provided if possible.
			 * Without some or both of the Org and Cloud IDs, there are no guarantees
			 * that the user will land in the teams app in the correct context.
			 */
			cloudId?: string;
	  }
	| {
			/**
			 * Optional, but should always be provided if possible.
			 * Without some or both of the Org and Cloud IDs, there are no guarantees
			 * that the user will land in the teams app in the correct context.
			 */
			orgId?: string;
			cloudId: string;
	  };

export type NavigationActionCommon = RequireOrgIdOrCloudId & {
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
	userHasNav4Enabled?: boolean;
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

export type NavigationActionPayloadVariants =
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
	  };

export type NavigationAction = NavigationActionCommon & NavigationActionPayloadVariants;

export type NavigationResult = {
	onNavigate: (e?: React.MouseEvent | React.KeyboardEvent) => void;
	href: string;
	target: '_blank' | '_self';
};
