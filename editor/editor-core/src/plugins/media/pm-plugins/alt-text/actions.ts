export type CloseMediaAltTextMenu = {
  type: 'closeMediaAltTextMenu';
};

export type OpenMediaAltTextMenu = {
  type: 'openMediaAltTextMenu';
};

export type UpdateAltText = {
  type: 'updateAltText';
};

export type MediaAltTextAction =
  | OpenMediaAltTextMenu
  | CloseMediaAltTextMenu
  | UpdateAltText;
