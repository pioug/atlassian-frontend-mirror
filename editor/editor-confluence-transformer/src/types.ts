export interface MacroProperties {
  'fab:display-type'?: 'INLINE' | 'BLOCK';
  'fab:placeholder-url'?: string;
  'ac:rich-text-body'?: string;
  'ac:plain-text-body'?: string;
}

export interface Macro {
  macroId: string;
  macroName: string;
  properties: MacroProperties;
  params: any;
}
