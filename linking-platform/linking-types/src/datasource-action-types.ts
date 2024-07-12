// Discovery

interface ActionsDiscoveryInterface {
	aris: string[];
	fieldKeys: string[];
}

interface DatasourceIntegration extends ActionsDiscoveryInterface {
	datasourceId: string;
}

interface TargetIntegration extends ActionsDiscoveryInterface {
	integrationKey: string;
}

export type ActionsDiscoveryRequest = DatasourceIntegration | TargetIntegration;

export interface PermissionTypes {
	isEditable: boolean;
}

export interface PermissionInterface extends PermissionTypes {
	ari: string;
	fieldKey: string;
}

export interface AtomicActionInterface {
	integrationKey: string; // eg: jira
	// to be sent to actions-service to execute an action
	actionKey: string; // eg: atlassian:issue:update:summary
	// to identify actionable column in FE
	fieldKey: string; // eg: summary
	// types the field value can take
	type: 'string' | 'number';
	description?: string;
}

export interface ActionsServiceDiscoveryResponse {
	actions: AtomicActionInterface[];
	permissions: {
		data: PermissionInterface[];
	};
}

export type ActionsDiscoveryResponse = ActionsServiceDiscoveryResponse | ActionsServiceError;

// Execution

export interface AtomicActionExecuteRequest {
	integrationKey: string; // eg: jira
	actionKey: string; // eg: atlassian:issue:update:summary
	parameters: {
		inputs: {
			[key: string]: string | number;
		};
		// target: {}
	};
}

export enum ActionOperationStatus {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export interface AtomicActionExecuteResponse {
	operationStatus: ActionOperationStatus;
	errors: ActionsServiceError[];
	// entities
}

// Errors
export interface ActionsServiceError {
	message: string;
	code: number;
}
