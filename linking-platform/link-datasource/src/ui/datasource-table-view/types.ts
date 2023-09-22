export interface DatasourceTableViewProps {
  datasourceId: string;
  parameters: object;
  fields?: string[];
  onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
  visibleColumnKeys?: string[];
  url?: string;
}
