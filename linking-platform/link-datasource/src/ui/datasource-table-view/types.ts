import { IssueLikeDataTableViewProps } from '../issue-like-table/types';

export type DatasourceTableViewProps = {
  /** Unique identifier for which type of datasource is being rendered and for making its requests */
  datasourceId: string;
  /** Parameters for making the data requests necessary to render data within the table */
  parameters: object;
  fields?: string[];

  /** Url for an existing datasource, initially used for displaying to a user unauthorized to query that site  */
  url?: string;
} & Partial<Pick<IssueLikeDataTableViewProps, 'visibleColumnKeys'>> &
  Pick<
    IssueLikeDataTableViewProps,
    | 'onVisibleColumnKeysChange'
    | 'wrappedColumnKeys'
    | 'onWrappedColumnChange'
    | 'onColumnResize'
    | 'columnCustomSizes'
  >;
