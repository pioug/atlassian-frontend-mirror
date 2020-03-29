/** @jsx jsx */
import { jsx, ClassNames } from '@emotion/core';

import {
  elemBeforeCSS,
  elemAfterCSS,
  descriptionCSS,
  contentCSS,
  truncateCSS,
  contentCSSWrapper,
} from './styles';
import { BaseItemProps, RenderFunction } from '../types';

const defaultRender: RenderFunction = (Component, props) => (
  <Component {...props} />
);

const BaseItem = ({
  children,
  description,
  elemAfter,
  elemBefore,
  overrides,
}: BaseItemProps) => {
  const renderTitle =
    (overrides && overrides.Title && overrides.Title.render) || defaultRender;

  return (
    <div css={contentCSSWrapper}>
      {elemBefore && (
        <span data-item-elem-before css={elemBeforeCSS}>
          {elemBefore}
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
      {elemAfter && (
        <span data-item-elem-after css={elemAfterCSS}>
          {elemAfter}
        </span>
      )}
    </div>
  );
};

export default BaseItem;
