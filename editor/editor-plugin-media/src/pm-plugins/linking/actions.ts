export enum MediaLinkingActionsTypes {
  showToolbar = 'MEDIA_SHOW_TOOLBAR',
  hideToolbar = 'MEDIA_HIDE_TOOLBAR',
  setUrl = 'MEDIA_SET_LINK_TO',
  unlink = 'MEDIA_LINKING_UNLINK',
}

export interface VisibleAction {
  type: MediaLinkingActionsTypes.showToolbar;
}

export interface HideAction {
  type: MediaLinkingActionsTypes.hideToolbar;
}

export interface SetLinkToMedia {
  type: MediaLinkingActionsTypes.setUrl;
  payload: string;
}

export interface Unlink {
  type: MediaLinkingActionsTypes.unlink;
}

export type MediaLinkingActions =
  | VisibleAction
  | SetLinkToMedia
  | HideAction
  | Unlink;
