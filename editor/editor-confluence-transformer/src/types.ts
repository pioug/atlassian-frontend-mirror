export interface MacroProperties {
	'ac:plain-text-body'?: string;
	'ac:rich-text-body'?: string;
	'fab:display-type'?: 'INLINE' | 'BLOCK';
	'fab:placeholder-url'?: string;
}

export interface Macro {
	macroId: string;
	macroName: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: any;
	properties: MacroProperties;
}
