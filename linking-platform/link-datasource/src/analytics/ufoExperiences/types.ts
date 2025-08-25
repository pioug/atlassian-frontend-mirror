interface DatasourceRendered {
	metadata?: {
		extensionKey?: string;
	};
	name: 'datasource-rendered'; // platform.fe.page-segment-load.datasource.datasource-rendered
}

interface ColumnPickerRendered {
	metadata?: {
		extensionKey?: string;
	};
	name: 'column-picker-rendered'; // platform.fe.custom.datasource.column-picker-rendered
}

interface InlineEditRendered {
	metadata?: {
		extensionKey?: string;
	};
	name: 'inline-edit-rendered'; // platform.fe.custom.datasource.inline-edit-rendered
}

export type UfoExperience = DatasourceRendered | ColumnPickerRendered | InlineEditRendered;
