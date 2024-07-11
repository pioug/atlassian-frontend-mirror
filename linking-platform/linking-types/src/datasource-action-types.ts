export interface PermissionTypes {
	isEditable: boolean;
}

export interface PermissionInterface extends PermissionTypes {
	ari: string;
	fieldKey: string;
}

export interface AtomicActionInterface {
	// to be sent to actions-service to execute an action
	actionKey: string; // eg: atlassian:issue:update:summary

	// to identify actionable column in FE
	fieldKey: string; // eg: summary

	description?: string;

	type: 'string' | 'number';
}

export interface ActionsDiscoveryResponse {
	actions: AtomicActionInterface[];
	permissions: {
		data: PermissionInterface[];
	};
}

export interface ActionsDiscoveryRequest {
	aris: string[];
	fieldKeys: string[];
}
