export enum DatasourceAction {
  COLUMN_ADDED = 'column added',
  COLUMN_REMOVED = 'column removed',
  COLUMN_REORDERED = 'column reordered',
  INSTANCE_UPDATED = 'instance updated',
  QUERY_UPDATED = 'query updated',
  DISPLAY_VIEW_CHANGED = 'display view changed',
  NEXT_PAGE_SCROLLED = 'next page scrolled',
}

export enum DatasourceDisplay {
  DATASOURCE_TABLE = 'datasource_table',
  DATASOURCE_INLINE = 'datasource_inline',
  INLINE = 'inline',
}

export enum DatasourceSearchMethod {
  DATASOURCE_BASIC_FILTER = 'datasource_basic_filter',
  DATASOURCE_SEARCH_QUERY = 'datasource_search_query',
}
