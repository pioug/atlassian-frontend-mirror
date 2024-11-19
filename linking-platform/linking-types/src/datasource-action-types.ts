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
	integrationKey: string;
	/**
	 * To be sent to actions-service to execute an action
	 * eg: atlassian:work-item:update:summary
	 */
	actionKey: string;
	/**
	 * To identify the actionable column in FE.
	 * Should be the same as the last word in `actionKey`.
	 */
	fieldKey: string;
	/**
	 * types the field value can take
	 */
	type: 'string' | 'number';
	description?: string;
	/**
	 * The inputs required to execute the action
	 */
	inputs?: ActionInputs;
}

type ActionInputs = { [key: string]: ActionInput };

/**
 * Information received from ORS about the a given input type and the
 * actions that can be applied to it.
 */
type ActionInput = {
	type: 'string' | 'number';
	description?: string;
	fetchAction?: AtomicActionInterface;
};

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

/**
 * The response shape from /gateway/api/object-resolver/actions/execute
 * T could be Icon or Status for example.
 */
export interface AtomicActionExecuteResponse<T = unknown> {
	operationStatus: ActionOperationStatus;
	errors: ActionsServiceError[];
	// eg: new entities created by the action execution or the results of a search action
	entities?: T[];
}

// Errors
export interface ActionsServiceError {
	message: string;
	code: number;
}
