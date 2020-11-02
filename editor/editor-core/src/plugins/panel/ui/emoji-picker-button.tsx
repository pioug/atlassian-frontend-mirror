import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Emoji from '@atlaskit/icon/glyph/editor/emoji';
import { EditorView } from 'prosemirror-view';
import {
  Popup,
  ProviderFactory,
  Providers,
  WithProviders,
} from '@atlaskit/editor-common';
import { EmojiPicker, EmojiId } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';

// helps adjusts position of popup
const EmojiPickerButtonWrapper = styled.div`
  position: relative;
`;

export type Props = {
  className?: string;
  view?: EditorView;
  idx?: number;
  providerFactory?: ProviderFactory;
  title?: string;
  onChange?: (emoji: EmojiId) => void;
  isSelected?: boolean;
};

export type State = {
  isPopupOpen?: Boolean;
  activeIcon?: string;
};

export const EmojiPickerButton = (props: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const updateEmoji = (emoji: EmojiId) => {
    setIsPopupOpen(false);
    props.onChange && props.onChange(emoji);
  };

  const renderPicker = (providers: Providers) => {
    if (!providers.emojiProvider) {
      return null;
    }

    return (
      <EmojiPicker
        emojiProvider={providers.emojiProvider}
        onSelection={updateEmoji}
        onPickerRef={() => {}}
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
        mountTo={buttonRef.current.parentElement!}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 10]}
      >
        <WithProviders
          providers={['emojiProvider']}
          providerFactory={props.providerFactory!}
          renderNode={renderPicker}
        />
      </Popup>
    );
  };

  const title = props.title || '';

  return (
    <EmojiPickerButtonWrapper>
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
          iconBefore={<Emoji label="emoji" />}
        />
      </Tooltip>
      {renderPopup()}
    </EmojiPickerButtonWrapper>
  );
};
