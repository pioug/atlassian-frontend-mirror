/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ImageLoader from 'react-render-image';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { gs } from '../utils';

export interface IconProps {
  /* Url of the icon to be displayed. Note that this is only used if a JSX element is not provided */
  url?: string;
  /* Element to be displayed as an icon. We naively render this if it is provided. Allows us to pass in AK icons */
  icon?: React.ReactNode;
  /* Element to be displayed as an icon if icon not provided or icon url request return error. */
  defaultIcon?: React.ReactNode;
  /* A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests. */
  testId?: string;
}

export const blockCardIconImageClassName = 'block-card-icon-image';

export const Icon = ({
  url,
  icon,
  defaultIcon,
  testId = 'block-card-icon',
}: IconProps) => {
  const placeholder = defaultIcon || (
    <LinkIcon label="link" size="small" testId={`${testId}-default`} />
  );

  const image = url && (
    <ImageLoader
      src={url}
      loaded={
        <img
          css={{ height: gs(2), width: gs(2) }}
          src={url}
          data-testid={`${testId}-image`}
          className={blockCardIconImageClassName}
        />
      }
      errored={placeholder}
    />
  );

  return (
    <span
      css={{
        height: gs(2.5),
        width: gs(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      data-testid={testId}
    >
      {icon || image || placeholder}
    </span>
  );
};
