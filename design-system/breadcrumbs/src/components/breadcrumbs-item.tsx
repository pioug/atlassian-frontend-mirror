/** @jsx jsx */

import { ComponentType, memo, useMemo, useRef } from 'react';

import { jsx } from '@emotion/core';
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import type { TooltipProps } from '@atlaskit/tooltip';

import { itemStyles, itemWrapperStyles } from '../internal/styles';
import { BreadcrumbsItemProps } from '../types';

import Step from './internal/step';
import useOverflowable from './internal/use-overflowable';

const AKTooltip = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_Tooltip" */ '@atlaskit/tooltip'
    ),
  { ssr: false },
) as ComponentType<TooltipProps>;

const BreadcrumbsItem = memo((props: BreadcrumbsItemProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { truncationWidth, text, ...restButtonProps } = props;

  const showTooltip = useOverflowable(truncationWidth, buttonRef);
  const buttonProps = {
    ...restButtonProps,
    ref: buttonRef,
    hasOverflow: showTooltip,
  };

  const styles = useMemo(() => itemStyles(truncationWidth), [truncationWidth]);
  const step = (
    <Step {...buttonProps} css={styles}>
      {text}
    </Step>
  );
  return (
    <li css={itemWrapperStyles}>
      {showTooltip ? (
        /* The div exists because of tooltip */
        <LazySuspense fallback={<div>{step}</div>}>
          <AKTooltip content={text} position="bottom">
            {step}
          </AKTooltip>
        </LazySuspense>
      ) : (
        step
      )}
    </li>
  );
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItem;
