interface DatasourceRendered {
  name: 'datasource-rendered'; // platform.fe.page-segment-load.datasource.datasource-rendered
  metadata?: {
    extensionKey?: string;
  };
}

export type UfoExperience = DatasourceRendered;
