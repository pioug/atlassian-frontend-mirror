/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { css, jsx } from '@emotion/core';

import { HorizontalWrapper, VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { IconType, SmartLinkSize } from '../src/constants';
import { exampleTokens, getContext } from './utils/flexible-ui';
import { LinkIcon } from '../src/view/FlexibleCard/components/elements';
import { smallImage } from '@atlaskit/media-test-helpers';

const boxStyles = css`
  color: ${exampleTokens.iconColor};
  background-color: ${exampleTokens.iconBackgroundColor};
  border-radius: 5px;
`;
const overrideCss = css`
  background-color: ${exampleTokens.overrideColor};
  border-radius: 15px;
`;
const context = getContext();

export default () => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // https://example.com:81/ - is a url that loads for long time. Returns timeout eventually.
    // Following is a trick that allows VR test to "load" the page.
    // If link above placed to icon right away test will never be able to "goto" this page
    // because some of the resources (this image) hasn't finished loading.
    // loadTimeoutIcon is called during test run.
    // @ts-ignore TS2339: Property 'setLoadingIconUrl' does not exist on type 'Window & typeof globalThis'
    window.setLoadingIconUrl = () => setUrl('https://example.com:81');
  }, []);

  return (
    <VRTestWrapper title="Flexible UI: Element: Icon">
      <FlexibleUiContext.Provider value={context}>
        {Object.values(SmartLinkSize).map((size, sIdx) => (
          <React.Fragment key={sIdx}>
            <h5>Size: {size}</h5>
            <HorizontalWrapper>
              {Object.values(IconType)
                .filter((iconType) => !iconType.startsWith('Badge:'))
                .map((iconType, tIdx) => (
                  <LinkIcon
                    key={`${sIdx}-${tIdx}`}
                    icon={iconType}
                    label={iconType}
                    size={size}
                    testId={`vr-test-icon-${sIdx}-${tIdx}`}
                  />
                ))}
            </HorizontalWrapper>
          </React.Fragment>
        ))}
        <h5>Custom icon</h5>
        <HorizontalWrapper>
          {Object.values(SmartLinkSize).map((size, idx) => (
            <LinkIcon key={idx} render={() => 'LP'} size={size} />
          ))}
          {Object.values(SmartLinkSize).map((size, idx) => (
            <LinkIcon
              key={idx}
              render={() => <div css={boxStyles}>LP</div>}
              size={size}
            />
          ))}
          {Object.values(SmartLinkSize).map((size, idx) => (
            <LinkIcon
              key={idx}
              render={() => <img src={smallImage} />}
              size={size}
            />
          ))}
        </HorizontalWrapper>
        <h5>Loading</h5>
        <HorizontalWrapper>
          {Object.values(SmartLinkSize).map((size, idx) => (
            <LinkIcon
              key={idx}
              icon={IconType.Default}
              label="loading"
              size={size}
              url={url}
              testId="vr-test-image-icon"
            />
          ))}
        </HorizontalWrapper>
        <h5>Override CSS</h5>
        <LinkIcon
          icon={IconType.Default}
          label="Override css"
          overrideCss={overrideCss}
          size={SmartLinkSize.XLarge}
        />
      </FlexibleUiContext.Provider>
    </VRTestWrapper>
  );
};
