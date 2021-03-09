/** @jsx jsx */
import { memo } from 'react';

import { ClassNames, jsx } from '@emotion/core';

import { BaseItemProps, RenderFunction } from '../types';

import {
  contentCSS,
  contentCSSWrapper,
  descriptionCSS,
  elemAfterCSS,
  elemBeforeCSS,
  truncateCSS,
} from './styles';

const defaultRender: RenderFunction = (Component, props) => (
  <Component {...props} />
);

const BaseItem = memo(
  ({
    children,
    description,
    iconAfter,
    iconBefore,
    overrides,
  }: BaseItemProps) => {
    const renderTitle =
      (overrides && overrides.Title && overrides.Title.render) || defaultRender;

    return (
      <div css={contentCSSWrapper}>
        {iconBefore && (
          <span data-item-elem-before css={elemBeforeCSS}>
            {iconBefore}
          </span>
        )}
        {children && (
          <span css={contentCSS}>
            <ClassNames>
              {({ css }) =>
                renderTitle('span', {
                  children,
                  className: css(truncateCSS),
                  'data-item-title': true,
                })
              }
            </ClassNames>
            {description && (
              <span data-item-description css={descriptionCSS}>
                {description}
              </span>
            )}
          </span>
        )}
        {iconAfter && (
          <span data-item-elem-after css={elemAfterCSS}>
            {iconAfter}
          </span>
        )}
      </div>
    );
  },
);

export default BaseItem;
