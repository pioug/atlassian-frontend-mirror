interface Prop {
	name: string;
	description: string;
	type: string;
	exampleValue?: string;
}

export interface Component {
	name: string;
	package: `@${'atlaskit' | 'atlassian'}/${string}`;
	keywords: string[];
	category: string;
	description: string;
	status: string;
	examples: string[];
	accessibilityGuidelines?: string[];
	usageGuidelines?: string[];
	contentGuidelines?: string[];
	props?: Prop[];
}
