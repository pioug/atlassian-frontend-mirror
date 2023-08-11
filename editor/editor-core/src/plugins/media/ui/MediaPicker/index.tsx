import React from 'react';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';
import type { MediaPluginState } from '../../pm-plugins/types';
import type {
  EditorAppearance,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { MediaNextEditorPluginType } from '../../next-plugin-type';

type Props = {
  mediaState: MediaPluginState;
  editorDomElement: Element;
  appearance: EditorAppearance;
  api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
};

type State = {
  isPopupOpened: boolean;
};

type MediaPickerProps = {
  api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
  mediaState: MediaPluginState;
  appearance: EditorAppearance;
  isPopupOpened: boolean;
  editorDomElement: Element;
  onBrowseFn: (nativeBrowseFn: () => void) => void;
};
const MediaPicker = ({
  api,
  isPopupOpened,
  appearance,
  mediaState,
  onBrowseFn,
  editorDomElement,
}: MediaPickerProps) => {
  const { focusState } = useSharedPluginState(api, ['focus']);
  const featureFlags =
    mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;

  const clipboard = focusState?.hasFocus ? (
    <ClipboardWrapper mediaState={mediaState} featureFlags={featureFlags} />
  ) : null;

  return (
    <>
      {clipboard}
      <DropzoneWrapper
        mediaState={mediaState}
        isActive={!isPopupOpened}
        featureFlags={featureFlags}
        editorDomElement={editorDomElement}
        appearance={appearance}
      />
      <BrowserWrapper
        onBrowseFn={onBrowseFn}
        mediaState={mediaState}
        featureFlags={featureFlags}
      />
    </>
  );
};

export class MediaPickerComponents extends React.Component<Props, State> {
  static displayName = 'MediaPickerComponents';

  state = {
    isPopupOpened: false,
  };

  componentDidMount() {
    const { mediaState } = this.props;
    mediaState.onPopupToggle((isPopupOpened) => {
      this.setState({
        isPopupOpened,
      });
    });
  }

  onBrowseFn = (nativeBrowseFn: () => void) => {
    const { mediaState } = this.props;
    mediaState && mediaState.setBrowseFn(nativeBrowseFn);
  };

  render() {
    const { api, mediaState, editorDomElement, appearance } = this.props;
    const { isPopupOpened } = this.state;

    return (
      <MediaPicker
        mediaState={mediaState}
        editorDomElement={editorDomElement}
        appearance={appearance}
        isPopupOpened={isPopupOpened}
        onBrowseFn={this.onBrowseFn}
        api={api}
      />
    );
  }
}
