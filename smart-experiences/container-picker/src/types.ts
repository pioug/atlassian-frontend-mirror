import { FormatOptionLabelMeta } from '@atlaskit/select/types';

export type ProductType = 'jira' | 'confluence';

export interface SearchContext {
  sessionId?: string;
  cloudId: string;
  baseUrl?: string;
}

export interface CollaborationGraphContext extends SearchContext {
  contextType: string;
}

export interface ContainerOption {
  label: string;
  value: ContainerOptionValue;
}

export interface ContainerOptionValue {
  id: string;
  name: string;
  type: string;
  url: string;
  iconUrl: string;

  analyticsAttributes?: {
    [key: string]: string;
  };
}

export interface ProductContainerPickerProps {
  cloudId: string;
  contextType: string;
  baseUrl?: string;
  isMulti?: boolean;
  maxOptions?: number;
  maxRequestOptions?: number;
  principalId?: string;
  isLoading?: boolean;
  debounceTime?: number;
  /** Selected values to display. If not provided, ContainerPicker will control it internally. */
  value?: Value;
  formatOptionLabel?: (
    data: ContainerOption,
    context: FormatOptionLabelMeta<ContainerOption>,
  ) => React.ReactNode;
}

export type Value =
  | ContainerOptionValue
  | ContainerOptionValue[]
  | null
  | undefined;

export interface ProductProps {
  product: ProductType;
}

export type ContainerPickerProps = ProductContainerPickerProps & ProductProps;

export interface ContainerPickerState {
  error: boolean;
  inputValue: string;
  loading: boolean;
  menuIsOpen: boolean;
  options: ContainerOption[];
  value?: AtlaskitSelectValue;
}

export type ActionTypes =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type AtlaskitSelectValue =
  | ContainerOption
  | Readonly<Array<ContainerOption>>
  | null
  | undefined;

export type AtlasKitSelectChange = (
  value: AtlaskitSelectValue,
  actionMeta: {
    removedValue?: ContainerOption;
    option?: ContainerOption;
    action: ActionTypes;
  },
) => void;

export interface OptionToSelectableOptions {
  (defaultValue: ContainerOptionValue): ContainerOption;
  (defaultValue: ContainerOptionValue[]): ContainerOption[];
  (defaultValue?: null): null;
  (defaultValue?: Value):
    | ContainerOption
    | ContainerOption[]
    | null
    | undefined;
}
