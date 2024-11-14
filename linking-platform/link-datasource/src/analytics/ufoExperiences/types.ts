interface DatasourceRendered {
	name: 'datasource-rendered'; // platform.fe.page-segment-load.datasource.datasource-rendered
	metadata?: {
		extensionKey?: string;
	};
}

interface ColumnPickerRendered {
	name: 'column-picker-rendered'; // platform.fe.custom.datasource.column-picker-rendered
	metadata?: {
		extensionKey?: string;
	};
}

interface InlineEditRendered {
	name: 'inline-edit-rendered'; // platform.fe.custom.datasource.inline-edit-rendered
	metadata?: {
		extensionKey?: string;
	};
}

export type UfoExperience = DatasourceRendered | ColumnPickerRendered | InlineEditRendered;
