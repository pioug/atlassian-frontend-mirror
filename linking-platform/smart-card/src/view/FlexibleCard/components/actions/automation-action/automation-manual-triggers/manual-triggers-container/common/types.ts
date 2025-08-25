export type Ari = string;

export type RuleScope = {
	resources: Ari[];
};

export enum UserInputType {
	NUMBER = 'NUMBER',
	TEXT = 'TEXT',
	BOOLEAN = 'BOOLEAN',
	DROPDOWN = 'DROPDOWN',
	PARAGRAPH = 'PARAGRAPH',
}

type UserInputPromptBase<Value, Type extends UserInputType> = {
	defaultValue: Value;
	displayName: string;
	inputType: Type;
	required: boolean;
	variableName: string;
};

export type UserInputParagraphPrompt = UserInputPromptBase<string, UserInputType.PARAGRAPH>;

export type UserInputTextPrompt = UserInputPromptBase<string, UserInputType.TEXT>;

export type UserInputNumberPrompt = UserInputPromptBase<string, UserInputType.NUMBER>;

export type UserInputBooleanPrompt = UserInputPromptBase<boolean, UserInputType.BOOLEAN>;

export type UserInputSelectPrompt = UserInputPromptBase<string[], UserInputType.DROPDOWN>;

export type UserInputPrompt =
	| UserInputTextPrompt
	| UserInputNumberPrompt
	| UserInputBooleanPrompt
	| UserInputSelectPrompt
	| UserInputParagraphPrompt;

type UserInputValueBase<Value, Type extends UserInputType> = {
	inputType: Type;
	value: Value;
};

export type UserInputBooleanValue = UserInputValueBase<boolean, UserInputType.BOOLEAN>;
export type UserInputNumberValue = UserInputValueBase<number, UserInputType.NUMBER>;
export type UserInputDropdownValue = UserInputValueBase<string, UserInputType.DROPDOWN>;
export type UserInputStringValue = UserInputValueBase<string, UserInputType.TEXT>;
export type UserInputParagraphValue = UserInputValueBase<string, UserInputType.PARAGRAPH>;

export type UserInputValue =
	| UserInputBooleanValue
	| UserInputDropdownValue
	| UserInputNumberValue
	| UserInputStringValue
	| UserInputParagraphValue;

export type UserInputs = Record<string, UserInputValue>;

export type ManualRule = {
	id: number;
	name: string;
	ruleScope: RuleScope;
	userInputPrompts: UserInputPrompt[];
};

export type ManualRulesById = {
	[key: number]: ManualRule;
};

export type InvocationResult =
	| 'SUCCESS'
	| 'INVALID_LICENSE'
	| 'INVALID_PERMISSIONS'
	| 'INVALID_RULE_OR_ISSUE';

export type InvocationResponse = {
	[key: string]: InvocationResult;
};

export type InvokeManualRulePayload = {
	objects: Ari[];
	userInputs?: UserInputs;
};

export type GetManualRulesResponse = {
	data: {
		id: number;
		name: string;
		ruleScope: RuleScope;
		userInputs: UserInputPrompt[];
	}[];
};

export type ManualRuleInvoker = (ruleId: number, objects: Ari[]) => void;

export type RuleQuery = {
	objects?: Ari[];
};

export type SelectedRule = {
	objects: Ari[];
	rule: ManualRule;
};

export type SelectorOption = {
	label: string;
	value: string;
};

export const CORE_PROJECT = 'business';
export const SOFTWARE_PROJECT = 'software';
export const SERVICE_DESK_PROJECT = 'service_desk';
export const PRODUCT_DISCOVERY_PROJECT = 'product_discovery';

export type ProjectType =
	| typeof CORE_PROJECT
	| typeof SOFTWARE_PROJECT
	| typeof SERVICE_DESK_PROJECT
	| typeof PRODUCT_DISCOVERY_PROJECT;

export type CloudId = string;

export type Environment = 'prod' | 'pre-prod' | 'staging' | 'dev' | 'local';
