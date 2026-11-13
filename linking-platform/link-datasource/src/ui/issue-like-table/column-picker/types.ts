import type { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';

export type ColumnPickerProps = {
	columns: DatasourceResponseSchemaProperty[];
	/**
	 * Shows drag handles on selected options and separates them from unselected options
	 */
	isColumnReorderEnabled?: boolean;
	onOpen?: () => void;
	onSelectedColumnKeysChange: (selectedColumnKeys: string[]) => void;
	selectedColumnKeys: string[];
};
