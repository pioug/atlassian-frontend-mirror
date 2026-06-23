import { type Status } from '../types';

export type ComponentStatus = Status;

export type ComponentProps = {
	name: string;
	type: string;
	description?: string;
	isRequired?: boolean;
	isDeprecated?: boolean;
	defaultValue?: string;
};

export type ComponentMcpPayload = {
	name: string;
	description: string;
	status: ComponentStatus;
	usageGuidelines?: string[];
	contentGuidelines?: string[];
	accessibilityGuidelines?: string[];
	keywords: string[];
	package: string;
	examples: string[];
	props: ComponentProps[] | undefined;
	category: string;
};

/**
 * Re-exported to save rebuilding existing codegen.
 */
export type Component = ComponentMcpPayload;
