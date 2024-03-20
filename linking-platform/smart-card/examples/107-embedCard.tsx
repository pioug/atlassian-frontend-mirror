import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { SmartCardProvider } from '@atlaskit/link-provider';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { EmbedCardResolvedView } from '../src/view/EmbedCard/views/ResolvedView';
import { IntlProvider } from 'react-intl-next';
import { FrameStyle } from '../src/view/EmbedCard/types';
import { token } from '@atlaskit/tokens';

const previewUrl = 'https://www.youtube.com/embed/uhHyh55n5l0';
const preview = { src: previewUrl };
const cardWrapperStyles = {
  borderBottom: '1px solid',
  paddingBottom: token('space.200', '16px'),
};

export default () => {
  const [isSelected, setSelected] = useState<boolean>(false);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('show');
  const onIsSelectedChange = () => setSelected(!isSelected);

  return (
    <IntlProvider locale={'en'}>
      <SmartCardProvider>
        <div
          style={{
            width: '640px',
            margin: '0 auto',
            marginTop: token('space.800', '64px'),
            // we hardcode the margin bottom to account for the spacing of the floating bar on the example page
            marginBottom: '120px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginBottom: token('space.150', '12px'),
            }}
          >
            EmbedCardResolvedView
            <Checkbox label="isSelected" onChange={onIsSelectedChange} />
            <DropdownMenu trigger="Frame Styles">
              <DropdownItem onClick={() => setFrameStyle('show')}>
                Show
              </DropdownItem>
              <DropdownItem onClick={() => setFrameStyle('hide')}>
                Hide
              </DropdownItem>
              <DropdownItem onClick={() => setFrameStyle('showOnHover')}>
                Show on Hover
              </DropdownItem>
            </DropdownMenu>
          </div>
          <div style={cardWrapperStyles}>
            <EmbedCardResolvedView
              link={previewUrl}
              preview={preview}
              context={{
                text: 'Hello world',
              }}
              isSelected={isSelected}
              frameStyle={frameStyle}
            />
          </div>
        </div>
      </SmartCardProvider>
    </IntlProvider>
  );
};
