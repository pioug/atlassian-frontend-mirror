import React from 'react';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';
import { MediaPluginState } from '../../pm-plugins/types';
import { EditorAppearance } from '../../../../types/editor-appearance';
import WithPluginState from '../../../../ui/WithPluginState';
import { focusStateKey } from '../../../../plugins/base/pm-plugins/focus-handler';

type Props = {
  mediaState: MediaPluginState;
  editorDomElement: Element;
  appearance: EditorAppearance;
};

type State = {
  isPopupOpened: boolean;
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
    const { mediaState, editorDomElement, appearance } = this.props;
    const { isPopupOpened } = this.state;
    const featureFlags =
      mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;

    return (
      <WithPluginState
        plugins={{
          focus: focusStateKey,
        }}
        render={({ focus }) => {
          const clipboard = focus ? (
            <ClipboardWrapper
              mediaState={mediaState}
              featureFlags={featureFlags}
            />
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
              {!mediaState.shouldUseMediaPickerPopup() && (
                <BrowserWrapper
                  onBrowseFn={this.onBrowseFn}
                  mediaState={mediaState}
                  featureFlags={featureFlags}
                />
              )}
            </>
          );
        }}
      />
    );
  }
}
