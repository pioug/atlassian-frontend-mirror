/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import { type DocsParameter, type DocsReturns, type ImportMetadata, type Status } from '../types';

export type HookMcpPayload = {
	name: string;
	description: string;
	status: Status;
	usageGuidelines?: string[];
	accessibilityGuidelines?: string[];
	keywords: string[];
	category?: string;
	import?: ImportMetadata;
	package: string;
	examples: string[];
	parameters?: DocsParameter[];
	returns?: DocsReturns;
};
