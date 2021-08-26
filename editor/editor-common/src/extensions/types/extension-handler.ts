import { ADFEntity } from '@atlaskit/adf-utils';

import { Parameters } from './extension-parameters';

export interface ExtensionParams<T extends Parameters> {
  extensionKey: string;
  extensionType: string;
  type?: 'extension' | 'inlineExtension' | 'bodiedExtension';
  parameters?: T;
  content?: object | string; // This would be the original Atlassian Document Format
  localId?: string;
}

export type ExtensionHandler<T extends Parameters = Parameters> = (
  ext: ExtensionParams<T>,
  doc: object,
) => JSX.Element | null;

export type OnSaveCallback<T extends Parameters = Parameters> = (
  params: T,
) => void;

export type TransformBefore<T extends Parameters = Parameters> = (
  data: T,
) => any;
export type TransformAfter<T extends Parameters = Parameters> = (
  data: any,
) => Promise<Partial<T>>;

export type ExtensionAPI<T extends Parameters = Parameters> = {
  editInContextPanel: (
    transformBefore: TransformBefore<T>,
    transformAfter: TransformAfter<T>,
  ) => void;
  _editInLegacyMacroBrowser: () => void;

  doc: {
    insertAfter: (localId: string, adf: ADFEntity) => void;
    scrollTo: (localId: string) => void;
  };
};

export type UpdateExtension<T extends Parameters = Parameters> = (
  extensionParameters: T,
  actions?: ExtensionAPI<T>,
) => Promise<T | void>;

export interface Extension<T extends Parameters = Parameters> {
  render: ExtensionHandler<T>;
  update?: UpdateExtension<T>;
}

export interface ExtensionHandlers<T extends Parameters = any> {
  [key: string]: Extension<T> | ExtensionHandler<T>;
}

export type ReferenceEntity = ADFEntity | Object;

// DEPRECATED
export type ParametersGetter<
  T extends Parameters = Parameters
> = TransformBefore<T>;
export type AsyncParametersGetter<
  T extends Parameters = Parameters
> = TransformAfter<T>;
