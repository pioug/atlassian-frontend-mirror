/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import Button from '@atlaskit/button';
import { EditorView } from 'prosemirror-view';
import {
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { Popup } from '@atlaskit/editor-common/ui';
import { EmojiPicker, EmojiId } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import EditorEmojiAddIcon from './EditorEmojiAddIcon';
import withOuterListeners from '../../../ui/with-outer-listeners';

// helps adjusts position of popup
const emojiPickerButtonWrapper = css`
  position: relative;
`;

// helps to vertically align emoji picker
// both top and bottom margin should be 2px
// https://product-fabric.atlassian.net/browse/CETI-148
const emojiPickerWrapper = css`
  margin-bottom: -12px;
  margin-top: -4px;
`;

export const EmojiPickerButton: React.FunctionComponent<{
  className?: string;
  editorView?: EditorView;
  idx?: number;
  providerFactory?: ProviderFactory;
  title?: string;
  onChange?: (emoji: EmojiId) => void;
  isSelected?: boolean;
  mountPoint?: HTMLElement;
  setDisableParentScroll?: (disable: boolean) => void;
}> = (props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const EmojiPickerWithListener = withOuterListeners(EmojiPicker);

  React.useEffect(() => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const updateEmoji = (emoji: EmojiId) => {
    setIsPopupOpen(false);
    props.editorView && props.editorView.focus();
    props.onChange && props.onChange(emoji);
  };

  const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);

  const handleEmojiClickOutside = (e: MouseEvent) => {
    // Ignore click events for detached elements.
    // Workaround for CETI-240 - where two onClicks fire - one when the upload button is
    // still in the document, and one once it's detached. Does not always occur, and
    // may be a side effect of a react render optimisation
    if (e && e.target && !isDetachedElement(e.target as HTMLElement)) {
      togglePopup();
    }
  };

  const renderPicker = (providers: Providers) => {
    if (!providers.emojiProvider) {
      return null;
    }

    return (
      <EmojiPickerWithListener
        emojiProvider={providers.emojiProvider}
        onSelection={updateEmoji}
        onPickerRef={() => {}}
        handleClickOutside={handleEmojiClickOutside}
      />
    );
  };

  const renderPopup = () => {
    if (!buttonRef.current || !isPopupOpen) {
      return;
    }

    return (
      <Popup
        target={buttonRef.current}
        mountTo={
          props.setDisableParentScroll
            ? props.mountPoint
            : buttonRef.current.parentElement!
        }
        fitHeight={350}
        fitWidth={350}
        offset={[0, 10]}
        // Confluence inline comment editor has z-index: 500
        // if the toolbar is scrollable, this will be mounted in the root editor
        // we need an index of > 500 to display over it
        zIndex={props.setDisableParentScroll ? 600 : undefined}
      >
        <div css={emojiPickerWrapper}>
          <WithProviders
            providers={['emojiProvider']}
            providerFactory={props.providerFactory!}
            renderNode={renderPicker}
          />
        </div>
      </Popup>
    );
  };

  const title = props.title || '';

  return (
    <div css={emojiPickerButtonWrapper}>
      <Tooltip content={title} position="top">
        <Button
          appearance={'subtle'}
          key={props.idx}
          style={{
            padding: 0,
            margin: 0,
            display: 'flex',
            height: '24px',
            width: '24px',
          }}
          onClick={togglePopup}
          ref={buttonRef}
          isSelected={props.isSelected}
          iconBefore={<EditorEmojiAddIcon />}
        />
      </Tooltip>
      {renderPopup()}
    </div>
  );
};
