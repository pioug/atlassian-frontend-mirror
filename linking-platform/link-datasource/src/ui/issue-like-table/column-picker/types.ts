import type { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';

export type ColumnPickerProps = {
	columns: DatasourceResponseSchemaProperty[];
	onOpen?: () => void;
	onSelectedColumnKeysChange: (selectedColumnKeys: string[]) => void;
	selectedColumnKeys: string[];
};
