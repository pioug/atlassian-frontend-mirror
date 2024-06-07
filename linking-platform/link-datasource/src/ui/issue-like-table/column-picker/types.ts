import { type DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';

export type ColumnPickerProps = {
	columns: DatasourceResponseSchemaProperty[];
	selectedColumnKeys: string[];
	onSelectedColumnKeysChange: (selectedColumnKeys: string[]) => void;
	onOpen?: () => void;
};
