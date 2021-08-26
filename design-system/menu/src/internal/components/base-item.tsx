/** @jsx jsx */
import { memo } from 'react';

import { ClassNames, jsx } from '@emotion/core';

import type { BaseItemProps, RenderFunction } from '../../types';
import {
  contentCSS,
  contentCSSWrapper,
  descriptionCSS,
  elemAfterCSS,
  elemBeforeCSS,
  truncateCSS,
  wrapDescriptionCSS,
  wrapTextCSS,
} from '../styles/menu-item/base-item';

const defaultRender: RenderFunction = (Component, props) => (
  <Component {...props} />
);

/**
 * __Base item__
 *
 * A base item should be composed for all item experiences.
 */
const BaseItem = memo(
  ({
    children,
    description,
    iconAfter,
    iconBefore,
    overrides,
    shouldTitleWrap = false,
    shouldDescriptionWrap = false,
  }: BaseItemProps) => {
    const renderTitle =
      (overrides && overrides.Title && overrides.Title.render) || defaultRender;

    return (
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      <div css={contentCSSWrapper}>
        {iconBefore && (
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          <span data-item-elem-before css={elemBeforeCSS}>
            {iconBefore}
          </span>
        )}
        {children && (
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          <span css={contentCSS}>
            <ClassNames>
              {({ css }) =>
                renderTitle('span', {
                  children,
                  className: css(shouldTitleWrap ? wrapTextCSS : truncateCSS),
                  'data-item-title': true,
                })
              }
            </ClassNames>
            {description && (
              <span
                data-item-description
                css={
                  // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
                  shouldDescriptionWrap ? wrapDescriptionCSS : descriptionCSS
                }
              >
                {description}
              </span>
            )}
          </span>
        )}
        {iconAfter && (
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          <span data-item-elem-after css={elemAfterCSS}>
            {iconAfter}
          </span>
        )}
      </div>
    );
  },
);

export default BaseItem;
