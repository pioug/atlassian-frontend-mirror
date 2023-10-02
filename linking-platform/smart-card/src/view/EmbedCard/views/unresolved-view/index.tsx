/** @jsx jsx */
import LinkGlyph from '@atlaskit/icon/glyph/link';
import { jsx } from '@emotion/react';
import React, { type FC, useMemo } from 'react';
import { ExpandedFrame } from '../../components/ExpandedFrame';
import { ImageIcon } from '../../components/ImageIcon';

import {
  containerStyles,
  descriptionStyles,
  imageStyles,
  titleStyles,
} from './styled';
import type { UnresolvedViewProps } from './types';

const UnresolvedView: FC<UnresolvedViewProps> = ({
  button,
  description,
  icon: iconUrlOrElement,
  image,
  inheritDimensions,
  isSelected,
  onClick,
  testId,
  text,
  title,
  url,
}) => {
  const icon = useMemo(() => {
    if (React.isValidElement(iconUrlOrElement)) {
      return iconUrlOrElement;
    }
    return (
      <ImageIcon
        src={
          typeof iconUrlOrElement === 'string' ? iconUrlOrElement : undefined
        }
        default={
          <LinkGlyph
            label="icon"
            size="small"
            testId="embed-card-fallback-icon"
          />
        }
      />
    );
  }, [iconUrlOrElement]);

  return (
    <ExpandedFrame
      allowScrollBar={true}
      frameStyle="show"
      href={url}
      icon={icon}
      inheritDimensions={inheritDimensions}
      isSelected={isSelected}
      onClick={onClick}
      testId={testId}
      text={text}
    >
      <div css={containerStyles} data-testid={`${testId}-unresolved-container`}>
        <img
          css={imageStyles}
          data-testid={`${testId}-unresolved-image`}
          src={image}
        />
        <span css={titleStyles} data-testid={`${testId}-unresolved-title`}>
          {title}
        </span>
        <span
          css={descriptionStyles}
          data-testid={`${testId}-unresolved-description`}
        >
          {description}
        </span>
        {button}
      </div>
    </ExpandedFrame>
  );
};

export default UnresolvedView;
