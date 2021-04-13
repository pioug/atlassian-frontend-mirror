import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { EmbedCardResolvedView } from '../src/EmbedCard/views/ResolvedView';
import { EmbedCardUnauthorisedView } from '../src/EmbedCard/views/UnauthorisedView';
import { EmbedCardForbiddenView } from '../src/EmbedCard/views/ForbiddenView';
import { EmbedCardNotFoundView } from '../src/EmbedCard/views/NotFoundView';

const previewUrl = 'https://www.youtube.com/embed/uhHyh55n5l0';
const preview = { src: previewUrl };
const cardWrapperStyles = {
  borderBottom: '1px solid',
  paddingBottom: '15px',
};

export default () => {
  const [isSelected, setSelected] = useState<boolean>(false);
  const [isFrameVisible, setIsFrameVisible] = useState<boolean>(true);
  const onIsSelectedChange = () => setSelected(!isSelected);
  const onIsFrameVisibleChange = () => setIsFrameVisible(!isFrameVisible);

  return (
    <div
      style={{
        width: '640px',
        margin: '0 auto',
        marginTop: '60px',
        marginBottom: '120px',
      }}
    >
      <div style={{ display: 'flex' }}>
        EmbedCardResolvedView
        <Checkbox label="isSelected" onChange={onIsSelectedChange} />
        <Checkbox
          label="isFrameVisible"
          isChecked={isFrameVisible}
          onChange={onIsFrameVisibleChange}
        />
      </div>
      <div style={cardWrapperStyles}>
        <EmbedCardResolvedView
          link={previewUrl}
          preview={preview}
          context={{
            text: 'Hello world',
          }}
          isSelected={isSelected}
          isFrameVisible={isFrameVisible}
        />
      </div>
      <div style={cardWrapperStyles}>
        EmbedCardUnauthorisedView
        <EmbedCardUnauthorisedView
          link={previewUrl}
          isSelected={isSelected}
          context={{
            text: 'Dropbox',
            icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
          }}
          onAuthorise={() => {}}
        />
      </div>
      <div style={cardWrapperStyles}>
        EmbedCardForbiddenView
        <EmbedCardForbiddenView
          isSelected={isSelected}
          link={previewUrl}
          context={{
            text: 'Dropbox',
            icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
          }}
          onAuthorise={() => {}}
        />
      </div>
      <div style={cardWrapperStyles}>
        EmbedCardNotFoundView
        <EmbedCardNotFoundView
          isSelected={isSelected}
          link={previewUrl}
          context={{
            text: 'Dropbox',
            icon: 'https://www.dropbox.com/static/30168/images/favicon.ico',
          }}
        />
      </div>
    </div>
  );
};
