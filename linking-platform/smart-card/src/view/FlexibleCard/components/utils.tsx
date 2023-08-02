import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { Spacing } from '@atlaskit/button';
import { SmartLinkSize } from '../../../constants';
import { MessageProps } from './types';
import Icon from './elements/icon';
import { openEmbedModal } from '../../EmbedModal/utils';
import { AnalyticsFacade } from '../../../state/analytics';
import { PreviewActionData } from '../../../state/flexible-ui-context/types';

export const sizeToButtonSpacing: Record<SmartLinkSize, Spacing> = {
  [SmartLinkSize.Small]: 'none',
  [SmartLinkSize.Medium]: 'compact',
  [SmartLinkSize.Large]: 'compact',
  [SmartLinkSize.XLarge]: 'default',
};

export const getFormattedMessage = (message?: MessageProps) => {
  if (message) {
    const { descriptor, values } = message;
    return <FormattedMessage {...descriptor} values={values} />;
  }
};

const getIconDimensionStyles = (value: string): SerializedStyles => css`
  height: ${value};
  min-height: ${value};
  max-height: ${value};
  width: ${value};
  min-width: ${value};
  max-width: ${value};
`;

export const getIconSizeStyles = (width: string): SerializedStyles => {
  const sizeStyles = getIconDimensionStyles(width);
  return css`
    flex: 0 0 auto;
    ${sizeStyles}
    span,
    svg,
    img {
      ${sizeStyles}
    }
    svg {
      padding: 0;
    }
  `;
};

export const getIconWidth = (size?: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '2rem';
    case SmartLinkSize.Large:
      return '1.5rem';
    case SmartLinkSize.Medium:
      return '1rem';
    case SmartLinkSize.Small:
    default:
      return '.75rem';
  }
};

export const getLinkLineHeight = (size: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '1.5rem';
    case SmartLinkSize.Large:
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return '1rem';
  }
};

export const getLinkSizeStyles = (size: SmartLinkSize): SerializedStyles => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return css`
        font-size: 1.25rem;
        font-weight: 400;
        letter-spacing: -0.008em;
        line-height: ${getLinkLineHeight(size)};
      `;
    case SmartLinkSize.Large:
    case SmartLinkSize.Medium:
      return css`
        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: -0.003em;
        line-height: ${getLinkLineHeight(size)};
      `;
    case SmartLinkSize.Small:
    default:
      return css`
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0em;
        line-height: ${getLinkLineHeight(size)};
      `;
  }
};

export const getMaxLineHeight = (size: SmartLinkSize) => {
  // The maximum line height based on all elements in specific size.
  // These heights belongs to AvatarGroup.
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      return 1.75;
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return 1.5;
  }
};

export const getMaxLines = (
  value: number,
  defaultValue: number,
  max: number,
  min: number,
) => {
  if (value > max) {
    return defaultValue;
  }

  if (value < min) {
    return min;
  }

  return value;
};

export const getTruncateStyles = (
  maxLines: number,
  lineHeight: string = '1rem',
  wordBreak: 'break-word' | 'break-all' = 'break-word',
): SerializedStyles =>
  css`
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: ${wordBreak};
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    // Fallback options
    @supports not (-webkit-line-clamp: 1) {
      max-height: calc(${maxLines} * ${lineHeight});
    }
  `;

export const hasWhiteSpace = (str: string): boolean => {
  return str.search(/\s/) >= 0;
};

export const openEmbedModalWithFlexibleUiIcon = ({
  analytics,
  downloadUrl,
  linkIcon,
  onClose,
  providerName,
  src,
  title,
  url,
  isSupportTheming,
}: PreviewActionData & {
  analytics?: AnalyticsFacade;
  onClose?: () => void;
}) => {
  const icon = {
    icon: <Icon {...linkIcon} size={SmartLinkSize.Large} />,
    isFlexibleUi: true,
  };
  return openEmbedModal({
    analytics,
    download: downloadUrl,
    icon,
    // Flex should not send origin as block card. It should be able to support
    // its internal parent components like hover card, block card and
    // itself as a standalone. To be investigated and fix in EDM-7520.
    origin: 'smartLinkCard',
    providerName,
    onClose,
    src,
    title,
    url,
    isSupportTheming,
  });
};
