/** @jsx jsx */

import { useEffect, useRef, useState } from 'react';

import { jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import AKTooltip from '@atlaskit/tooltip';

import { itemWrapperStyles, separatorStyles } from '../internal/styles';
import { BreadcrumbsItemProps } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import Button from './Button';

const analyticsAttributes = {
  componentName: 'breadcrumbsItem',
  packageName,
  packageVersion,
};

const noop = () => {};

const BreadcrumbsItem = (props: BreadcrumbsItemProps) => {
  const [hasOverflow, setOverflow] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {
    hasSeparator = false,
    truncationWidth,
    analyticsContext,
    href = '#',
    text,
    onClick: onClickProvided = noop,
    ...restButtonProps
  } = props;

  const handleClicked = usePlatformLeafEventHandler({
    fn: onClickProvided,
    action: 'clicked',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  // Recalculate hasOverflow on every render cycle
  // Overflow happen if length of button component is greater than truncation width
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (truncationWidth && buttonRef.current) {
      const shouldOverflow = buttonRef.current.clientWidth >= truncationWidth;

      if (shouldOverflow !== hasOverflow) {
        setOverflow(shouldOverflow);
      }
    }
  });

  const buttonProps = {
    ...restButtonProps,
    onClick: handleClicked,
    href,
    truncationWidth,
    ref: buttonRef,
  };

  return (
    <div css={itemWrapperStyles}>
      {hasOverflow && truncationWidth ? (
        <AKTooltip content={text} position="bottom">
          <Button {...buttonProps}>{text}</Button>
        </AKTooltip>
      ) : (
        <Button {...buttonProps} hasOverflow={false}>
          {text}
        </Button>
      )}
      {hasSeparator ? <div css={separatorStyles}>/</div> : null}
    </div>
  );
};

export default BreadcrumbsItem;
