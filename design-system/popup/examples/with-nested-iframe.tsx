/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import {
  Content,
  Main,
  PageLayout,
  TopNavigation,
} from '@atlaskit/page-layout';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const popupStyles = css({
  width: 300,
  height: 300,
});

const layerComponentsContainerStyles = css({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-evenly',
  flexWrap: 'wrap',
});

const iframeStyles = css({
  width: '100%',
  height: '300px',
});

const stubIframeStyles = css({
  background: token('color.background.accent.yellow.bolder', '#946F00'),
});

const selectWrapperStyles = css({
  width: '150px',
});

export default () => {
  const [isPopupOpen, setPopupIsOpen] = useState<boolean>(false);
  const [isPopupWithIframeOpen, setPopupWithIframeIsOpen] =
    useState<boolean>(false);

  return (
    <PageLayout>
      <TopNavigation
        testId="topNavigation"
        id="product-navigation"
        skipLinkTitle="Product Navigation"
        height={50}
        isFixed={false}
      >
        <div css={layerComponentsContainerStyles}>
          <Popup
            isOpen={isPopupOpen}
            onClose={() => setPopupIsOpen(false)}
            placement="bottom-start"
            content={() => (
              <div css={popupStyles}>
                <iframe
                  css={[iframeStyles, stubIframeStyles]}
                  title="stubIframe1"
                />
              </div>
            )}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                isSelected={isPopupOpen}
                onClick={() => setPopupIsOpen(!isPopupOpen)}
              >
                Popup
              </Button>
            )}
          />
          <Popup
            isOpen={isPopupWithIframeOpen}
            onClose={() => setPopupWithIframeIsOpen(false)}
            placement="bottom-start"
            content={() => (
              <div css={popupStyles}>
                <iframe
                  css={iframeStyles}
                  title="ADIframe1"
                  src="https://atlassian.design/"
                />
              </div>
            )}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                isSelected={isPopupWithIframeOpen}
                onClick={() => setPopupWithIframeIsOpen(!isPopupWithIframeOpen)}
              >
                Popup with nested iframe
              </Button>
            )}
          />
          <div css={selectWrapperStyles}>
            <Select
              inputId="single-select-example"
              className="single-select"
              classNamePrefix="react-select"
              options={[
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
                { label: 'D', value: 'D' },
                { label: 'E', value: 'E' },
                { label: 'F', value: 'F' },
                { label: 'G', value: 'g' },
              ]}
              placeholder="Select"
            />
          </div>
        </div>
      </TopNavigation>
      <Content testId="content">
        <Main testId="main" id="main" skipLinkTitle="Main Content">
          <iframe
            css={iframeStyles}
            title="ADIframe2"
            src="https://atlassian.design/"
          />
          <iframe css={[iframeStyles, stubIframeStyles]} title="stubIframe2" />
        </Main>
      </Content>
    </PageLayout>
  );
};
