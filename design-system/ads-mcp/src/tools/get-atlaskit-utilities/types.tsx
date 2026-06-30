/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import { type DocsParameter, type DocsReturns, type ImportMetadata, type Status } from '../types';

export type UtilityMcpPayload =
	| {
			kind: 'function';
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
			signature?: string;
	  }
	| {
			kind: 'constant';
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
			type?: string;
			value?: string;
	  }
	| {
			kind: 'type';
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
			definition?: string;
	  };
