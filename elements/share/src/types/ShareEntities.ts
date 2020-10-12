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
