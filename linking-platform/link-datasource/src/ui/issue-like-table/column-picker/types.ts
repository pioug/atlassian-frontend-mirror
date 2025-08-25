import { type DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

export type ColumnPickerProps = {
	columns: DatasourceResponseSchemaProperty[];
	onOpen?: () => void;
	onSelectedColumnKeysChange: (selectedColumnKeys: string[]) => void;
	selectedColumnKeys: string[];
};
