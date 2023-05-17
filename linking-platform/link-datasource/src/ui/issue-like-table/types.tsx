import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  DatasourceTableStatusType,
  DatasourceType,
} from '@atlaskit/linking-types';

export type TableViewPropsRenderType = (
  item: DatasourceType,
) => React.ReactNode;

export interface IssueLikeDataTableViewProps {
  testId?: string;
  /**
   * All available columns/properties.
   * Consumer should not reorder these columns to align with `visibleColumnKeys`.
   * UI will display them according to `visibleColumnKeys`
   */
  columns: DatasourceResponseSchemaProperty[];
  /**
   * List of properties/column keys that are visible/selected
   */
  visibleColumnKeys: string[];
  hasNextPage: boolean;
  status: DatasourceTableStatusType;
  items: DatasourceDataResponseItem[];
  onNextPage: () => void;
  /**
   * A function to define new or override existing render components.
   * eg:
   * const renderItem: TableViewPropsRenderType = item => {
   *  if (item.type === 'icon') {
   *    return (
   *       <IconRenderType label={item.label} source={item.source} />
   *    );
   *  }
   *  return fallbackRenderType(item);
   * };
   */
  renderItem?: TableViewPropsRenderType;
  /**
   * Callback that is called in either column re-order or columns being selected/unselected
   * @param visibleColumnKeys
   */
  onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
}
