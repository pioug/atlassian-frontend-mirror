import { ReactNode } from 'react';

import { ADFEntity } from '@atlaskit/adf-utils';

import { UpdateExtension } from './extension-handler';
import { Parameters } from './extension-parameters';
import { FieldDefinition } from './field-definitions';

export type ExtensionType = string;

export type ExtensionKey = string;

export type ExtensionModuleKey = string;

export type Icon = () => Promise<any>;

export type Icons = {
  '48': Icon;
  [dimensions: string]: Icon;
};

export type ExtensionNodeType =
  | 'extension'
  | 'inlineExtension'
  | 'bodiedExtension';

export type ExtensionManifest = {
  type: ExtensionType;
  key: ExtensionKey;
  title: string;
  description: string;
  categories?: string[];
  keywords?: string[];
  icons: Icons;
  modules: ExtensionModules;
};

export type ExtensionModules = {
  // define items to show up in the slash menu, element browser and plus menu
  quickInsert?: ExtensionModule[];
  // define how to handle each type of node (update, render, config, etc)
  nodes?: ExtensionModuleNodes;
  // define how to handle special fields used in config forms
  fields?: ExtensionModuleFields;
  // define how/when to convert pasted content to this extension
  autoConvert?: ExtensionModuleAutoConvert;
};

export type ExtensionModuleAction =
  | ExtensionModuleActionObject
  | ExtensionModuleActionHandler;

export type ExtensionModuleActionObject = {
  key: ExtensionModuleKey;
  type: 'node';
  parameters: any;
};

export type ExtensionModuleActionHandler = () => AsyncESModule<ADFEntity | void>;

export type ExtensionModule = {
  key: string;
  title?: string;
  description?: string;
  icon?: Icon;
  priority?: number;
  keywords?: string[];
  categories?: string[];
  action: ExtensionModuleAction;
};

export type ExtensionModuleAutoConvert = {
  url?: ExtensionAutoConvertHandler[];
};

export type ExtensionAutoConvertHandler = (
  text: string,
) => ADFEntity | undefined;

export type ExtensionModuleFieldTypeCustom = {
  resolver?: FieldResolver;
};

export type ExtensionModuleFieldTypeFieldset = {
  serializer?: Serializer;
  deserializer?: Deserializer;
};

export type ExtensionModuleFields = {
  custom?: {
    [key: string]: ExtensionModuleFieldTypeCustom;
  };
  fieldset?: {
    [key: string]: ExtensionModuleFieldTypeFieldset;
  };
};

export type Option = {
  label: string;
  value: string;
  description?: string;
};

export type FieldResolver = (searchTerm?: string) => Promise<Option[]>;
export type Serializer = (data: Parameters) => string;
export type Deserializer = (value: string) => Parameters;

export type ExtensionModuleNodes = {
  [key: string]: ExtensionModuleNode;
};

export type ExtensionModuleNode<T = any> = {
  type: ExtensionNodeType;
  render: () => AsyncESModule<ReactNode>;
  update?: UpdateExtension<T>;
  getFieldsDefinition?: (extensionParameters?: T) => Promise<FieldDefinition[]>;
};

export type ExtensionQuickInsertModule = 'quickInsert';

export type ESModule<T> = {
  __esModule?: boolean;
  default: T;
};

export type Module<T> = ESModule<T> | T;

export type AsyncESModule<T> = Promise<Module<T>>;

export type MaybeADFEntity = AsyncESModule<ADFEntity | undefined>;
