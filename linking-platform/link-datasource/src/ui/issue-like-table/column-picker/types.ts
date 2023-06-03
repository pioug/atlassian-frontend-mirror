import { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

export type ColumnPickerProps = {
  isDatasourceLoading: boolean;
  columns: DatasourceResponseSchemaProperty[];
  selectedColumnKeys: string[];
  onSelectedColumnKeysChange: (selectedColumnKeys: string[]) => void;
};
