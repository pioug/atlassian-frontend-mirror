import { ADNode } from '../../utils';

import { Parameters } from './extension-parameters';

export interface ExtensionParams<T> {
  extensionKey: string;
  extensionType: string;
  type?: 'extension' | 'inlineExtension' | 'bodiedExtension';
  parameters?: T;
  content?: Object | string; // This would be the original Atlassian Document Format
}

export type ExtensionHandler<T> = (
  ext: ExtensionParams<T>,
  doc: Object,
) => JSX.Element | ADNode[] | null;

export type OnSaveCallback = (params: Parameters) => void;
export type ParametersGetter = (data: Parameters) => Parameters;
export type AsyncParametersGetter = (data: Parameters) => Promise<Parameters>;

export type UpdateContextActions = {
  editInContextPanel: (
    processParametersBefore: ParametersGetter,
    processParametersAfter: AsyncParametersGetter,
  ) => void;
  editInLegacyMacroBrowser: () => void;
};

export type UpdateExtension<T> = (
  extensionParameters: T,
  actions?: UpdateContextActions,
) => Promise<T | undefined>;

export interface Extension<T> {
  render: ExtensionHandler<T>;
  update?: UpdateExtension<T>;
}

export interface ExtensionHandlers {
  [key: string]: Extension<any> | ExtensionHandler<any>;
}
