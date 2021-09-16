/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const gridSize = getGridSize();

const imageStyles = css({
  maxWidth: '100%',
  height: 'auto',
});

const actionItemContainerStyles = css({
  display: 'flex',
  margin: `0 -${gridSize / 2}px`,
  /* When there is more than one action, place primary action visually on the
  right, but keep it's position as the first focusable element in the DOM */
  flexDirection: 'row-reverse',
});

const actionItemStyles = css({
  margin: `0 ${gridSize / 2}px`,
});

/**
 * __Dialog image__
 *
 * An optional header image in spotlight dialogs.
 *
 * @internal
 */
export const DialogImage: React.FC<React.ImgHTMLAttributes<
  HTMLImageElement
>> = ({ alt, ...props }) => <img css={imageStyles} alt={alt} {...props} />;

/**
 * __Dialog action item container__
 *
 * Flex wrapper around dialog action items.
 *
 * @internal
 */
export const DialogActionItemContainer: React.FC<{}> = ({ children }) => (
  <div css={actionItemContainerStyles}>{children}</div>
);

/**
 * __Dialog action item__
 *
 * Action items shown inside of the dialog.
 *
 * @internal
 */
export const DialogActionItem: React.FC<{}> = ({ children }) => (
  <div css={actionItemStyles}>{children}</div>
);
