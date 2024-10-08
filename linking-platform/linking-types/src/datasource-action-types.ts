// Discovery

interface ActionsDiscoveryInterface {
	aris: string[];
	fieldKeys: string[];
	entityType: string;
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
	actionKey: string; // eg: atlassian:work-item:update:summary
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

type XOR<T1, T2, T3> =
	| (T1 & {
			[k in Exclude<keyof T2 | keyof T3, keyof T1>]?: never;
	  })
	| (T2 & {
			[k in Exclude<keyof T1 | keyof T3, keyof T2>]?: never;
	  })
	| (T3 & {
			[k in Exclude<keyof T1 | keyof T2, keyof T3>]?: never;
	  });

type ActionsTarget = XOR<{ ari: string }, { url: string }, { id: string }>;

export interface AtomicActionExecuteRequest {
	integrationKey: string; // eg: jira
	actionKey: string; // eg: atlassian:work-item:update:summary
	parameters: {
		inputs: {
			[key: string]: string | number;
		};
		target: ActionsTarget;
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
