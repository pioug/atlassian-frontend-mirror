/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import VRTestWrapper from '../utils/vr-test-wrapper';
import { HorizontalWrapper } from '../utils/vr-test';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { IconType, SmartLinkSize } from '../../src/constants';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import { LinkIcon } from '../../src/view/FlexibleCard/components/elements';
import { smallImage } from '@atlaskit/media-test-helpers';

const boxStyles = css({
  color: exampleTokens.iconColor,
  backgroundColor: exampleTokens.iconBackgroundColor,
  borderRadius: '5px',
});
const overrideCss = css({
  backgroundColor: exampleTokens.overrideColor,
  borderRadius: '15px',
});
const context = getContext();

export default () => {
  return (
    <VRTestWrapper>
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
