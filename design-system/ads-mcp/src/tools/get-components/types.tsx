/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
export type ComponentStatus =
	| 'release-candidate'
	| 'early-access'
	| 'open-beta'
	| 'general-availability'
	| 'intent-to-deprecate'
	| 'deprecated'
	| 'unmaintained';

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
