import {
  ExtensionProvider,
  ExtensionType,
  ExtensionKey,
  Parameters,
} from '@atlaskit/editor-common/extensions';

export type FormResult = {
  [key: string]: string | number | string[] | number[] | undefined;
};

export enum ValidationError {
  Required = 'required',
}

export enum FieldTypeError {
  isMultipleAndRadio = 'isMultipleAndRadio',
}

export type Entry<T> = [string, T];

export type PublicProps = {
  extensionProvider: ExtensionProvider;
  extensionType: ExtensionType;
  extensionKey: ExtensionKey;
  nodeKey: string;
  extensionParameters?: Parameters;
  parameters?: Parameters;
  autoSave?: boolean;
  closeOnEsc?: boolean;
  showHeader?: boolean;
  onChange: (data: Parameters) => void;
  onCancel: () => void;
};

export type OnBlur = (name: string) => void;
