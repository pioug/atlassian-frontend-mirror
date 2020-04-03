import EditorActions from '../../actions';

export type RenderOnClickHandler = (
  editorActions: EditorActions,
  closePopup: () => void,
) => React.ReactElement<any>;

export interface AddonActions {
  actionOnClick?: (editorActions: EditorActions) => void;
  renderOnClick?: RenderOnClickHandler;
}

export interface AddonCommonProps extends AddonActions {
  icon: React.ReactElement<any>;
}

export interface AddonProps extends AddonCommonProps {
  onClick?: (actions: AddonActions) => void;
  children?: React.ReactElement<any>[];
}

export interface AddonConfiguration extends AddonCommonProps {
  text: string;
}
