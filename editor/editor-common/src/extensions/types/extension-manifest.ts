import { ReactNode } from 'react';
import { ADFEntity } from '@atlaskit/adf-utils';
import { FieldDefinition } from './field-definitions';
import { UpdateExtension } from './extension-handler';
import { Parameters } from './extension-parameters';

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
  icons: Icons;
  modules: ExtensionModules;
};

export type ExtensionModules = {
  quickInsert?: ExtensionModule[];
  nodes?: ExtensionModuleNodes;
  fields?: ExtensionModuleFields;
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
  keywords?: Array<string>;
  action: ExtensionModuleAction;
};

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
  getFieldsDefinition?: () => Promise<FieldDefinition[]>;
};

export type ExtensionModuleType = Exclude<
  keyof ExtensionModules,
  'nodes' | 'fields'
>;

export type ESModule<T> = {
  __esModule?: boolean;
  default: T;
};

export type Module<T> = ESModule<T> | T;

export type AsyncESModule<T> = Promise<Module<T>>;

export type MaybeADFEntity = AsyncESModule<ADFEntity | undefined>;
