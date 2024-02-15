import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

export type ExtensionType =
  | 'extension'
  | 'bodiedExtension'
  | 'inlineExtension'
  | 'multiBodiedExtension';

export interface MacroAttributes {
  type: ExtensionType;
  attrs: {
    extensionKey: string;
    extensionType: string;
    parameters?: {
      macroParams?: object;
      macroMetadata?: object;
    };
    layout?: ExtensionLayout;
    text?: string; // fallback text
  };
  content?: any; // only bodiedExtension and multiBodiedExtension has content
}

export interface MacroProvider {
  config: {};
  /**
   * If "macro" param is passed in, it will open macro browser for editing the macro
   */
  openMacroBrowser(macroNode?: PmNode): Promise<MacroAttributes>;

  autoConvert(link: string): MacroAttributes | null;
}
