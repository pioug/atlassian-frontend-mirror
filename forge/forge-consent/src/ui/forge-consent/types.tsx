export interface PermissionProps {
  defaultIsExpanded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>, isExpanded: boolean) => any;
  title: React.ReactNode;
  icon: React.ReactChild;
  children: React.ReactNode;
}

export interface ScopeProps {
  defaultIsExpanded?: boolean;
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>, isExpanded: boolean) => any;
}

export interface ScopesMetadata {
  action: React.ReactNode;
  entities: React.ReactNode[];
  descriptions: React.ReactNode[];
}

export interface ProductPermissionProps {
  service: string;
  scopes: ScopesMetadata[];
}
