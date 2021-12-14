export type Content = {
  ari: string;
  link: string;
  title: string;
  type: string;
};

export type Comment = {
  format: 'plain_text' | 'adf';
  value: string;
};

export type MetaData = {
  productId: string;
  atlOriginId: string;
  shareeAction?: 'view' | 'edit';
};

// Third party integrations
export type IntegrationContentProps = {
  onClose: () => void;
  changeTab?: (index: TabType) => void;
};

export enum TabType {
  default = 0,
  Slack = 1,
}

export type Integration = {
  type: string;
  Icon: React.ComponentType;
  Content: React.ComponentType<IntegrationContentProps>;
};

export type IntegrationMode = 'tabs' | 'split' | 'off';
