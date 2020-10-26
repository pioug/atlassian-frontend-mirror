import React from 'react';
import styled from 'styled-components';

import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import ColorPalette from '../../../ui/ColorPalette';
import { panelBackgroundPalette } from '../../../ui/ColorPalette/Palettes/panelBackgroundPalette';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';

// helps adjusts position of popup
const ColorPickerButtonWrapper = styled.div`
  position: relative;
`;

// Control the size of color picker buttons and preview
const ColorPickerWrapper = styled.div`
  border-radius: ${borderRadius()}px;
  background-color: white;
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  padding: 4px;
`;

type Props = {
  view?: EditorView;
  currentColor?: string;
  title?: string;
  onChange?: (color: string) => void;
};

export const ColorPickerButton = (props: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const onColorSelected = (color: string) => {
    setIsPopupOpen(false);

    if (props.onChange) {
      props.onChange(color);
    }
  };

  const renderPopup = () => {
    if (!isPopupOpen || !buttonRef.current) {
      return;
    }

    return (
      <Popup
        target={buttonRef.current}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 10]}
      >
        <ColorPickerWrapper>
          <ColorPalette
            palette={panelBackgroundPalette}
            selectedColor={props.currentColor || null}
            onClick={onColorSelected}
          />
        </ColorPickerWrapper>
      </Popup>
    );
  };

  const title = props.title || '';

  return (
    <ColorPickerButtonWrapper>
      <Tooltip content={title} position="top">
        <Button
          ref={buttonRef}
          aria-label={title}
          spacing="compact"
          onClick={togglePopup}
          style={{
            backgroundColor: props.currentColor || 'transparent',
            border: `1px solid ${DEFAULT_BORDER_COLOR}`,
            width: `20px`,
            height: `20px`,
            padding: 0,
          }}
        />
      </Tooltip>
      {renderPopup()}
    </ColorPickerButtonWrapper>
  );
};
