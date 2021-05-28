export type Layout = 'default' | 'wide' | 'full-width';

export interface ExtensionAttributes {
  /**
   * @minLength 1
   */
  extensionKey: string;
  /**
   * @minLength 1
   */
  extensionType: string;
  parameters?: object;
  text?: string;
  layout?: Layout;
  /**
   * @minLength 1
   */
  localId?: string;
}

export interface InlineExtensionAttributes {
  /**
   * @minLength 1
   */
  extensionKey: string;
  /**
   * @minLength 1
   */
  extensionType: string;
  parameters?: object;
  text?: string;
  /**
   * @minLength 1
   */
  localId?: string;
}
