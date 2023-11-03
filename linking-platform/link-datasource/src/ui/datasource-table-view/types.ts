export interface DatasourceTableViewProps {
  /** Unique identifier for which type of datasource is being rendered and for making its requests */
  datasourceId: string;
  /** Parameters for making the data requests necessary to render data within the table */
  parameters: object;
  fields?: string[];
  /**
   * Callback to be invoked whenever a user changes the visible columns in a datasource table
   *
   * @param visibleColumnKeys the array of keys for all of the selected columns
   */
  onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
  /** The array of keys for all of the columns to be shown in the table */
  visibleColumnKeys?: string[];
  /** Url for an existing datasource, initially used for displaying to a user unauthorized to query that site  */
  url?: string;
  columnCustomSizes?: { [key: string]: number };
  onColumnResize?: (key: string, width: number) => void;
}
