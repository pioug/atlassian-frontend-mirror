import React, { ReactNode } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Spinner from '@atlaskit/spinner';

import {
  ActionsContainer,
  Container,
  Description,
  Header,
  Image,
  SpinnerContainer,
} from './styled';
import type { RenderImageProps, Width } from './types';

export interface EmptyStateProps {
  /**
   * Title that briefly describes the page to the user.
   */
  header: string;
  /**
   * The main block of text that holds additional supporting information.
   */
  description?: ReactNode;
  /**
   * Controls how much horizontal space the component fills. Defaults to "wide".
   */
  width?: Width;
  /**
   * @deprecated
   * Duplicates the `width` prop. Use `width instead`.
   */
  size?: Width;
  /**
   * The url of image that will be shown above the title, fed directly into the `src` prop of an <img> element.
   * Note, this image will be constrained by the `maxWidth` and `maxHeight` props.
   */
  imageUrl?: string;
  /**
   * Maximum width (in pixels) of the image, default value is 160.
   */
  maxImageWidth?: number;
  /**
   * Maximum height (in pixels) of the image, default value is 160.
   */
  maxImageHeight?: number;
  /**
   * Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages).
   */
  primaryAction?: ReactNode;
  /**
   * An alternative API to supply an image using a render prop. Only rendered if no `imageUrl` is supplied.
   */
  renderImage?: (props: RenderImageProps) => React.ReactNode;
  /**
   * Secondary action button for the page.
   */
  secondaryAction?: ReactNode;
  /**
   * Button with link to some external resource like documentation or tutorial, it will be opened in a new tab.
   */
  tertiaryAction?: ReactNode;
  /**
   * Used to indicate a loading state. Will show a spinner next to the action buttons when true.
   */
  isLoading?: boolean;
  /**
   * Width of the image that is rendered in EmptyState component.
   * Useful when you want image to be of exact width to stop it bouncing around when loading in.
   */
  imageWidth?: number;
  /**
   * Height of the image that is rendered in EmptyState component.
   * Useful when you want image to be of exact height to stop it bouncing around when loading in.
   * Only set `height` if you want the image to resize down on smaller devices.
   */
  imageHeight?: number;
}

/**
 * __Empty state__
 *
 * A component used for presenting various empty states.
 * e.g. (no items, empty search, broken link, welcome screen etc.)
 *
 * @example
 * ```tsx
 * import EmptyState from '@atlaskit/empty-state';
 *
 * // An example of a 404 state
 * export default () => {
 *  <EmptyState
 *   header="Page not found"
 *   imageUrl="https://cdn.io/images/404"
 *   description="Looks like you've stumbled off track. Sorry about that! This page either doesn't exist or has been removed."
 *   primaryAction={<Button appearance="primary">Home Page</Button>}
 *   secondaryAction={<Button>Report a problem</Button>}
 *  />;
 * };
 * ```
 */
const EmptyState = ({
  description,
  header,
  imageHeight,
  imageUrl,
  imageWidth,
  isLoading,
  maxImageHeight = 160,
  maxImageWidth = 160,
  primaryAction,
  renderImage,
  secondaryAction,
  width = 'wide',
  size = 'wide',
  tertiaryAction,
}: EmptyStateProps) => {
  const actionsContainer =
    primaryAction || secondaryAction || isLoading ? (
      <ActionsContainer>
        <ButtonGroup>
          {secondaryAction}
          {primaryAction}
        </ButtonGroup>
        <SpinnerContainer>{isLoading && <Spinner />}</SpinnerContainer>
      </ActionsContainer>
    ) : null;

  return (
    <Container width={size || width}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          maxWidth={maxImageWidth}
          maxHeight={maxImageHeight}
          width={imageWidth}
          height={imageHeight}
        />
      ) : (
        renderImage &&
        renderImage({ maxImageWidth, maxImageHeight, imageWidth, imageHeight })
      )}
      <Header>{header}</Header>
      {description && <Description>{description}</Description>}
      {actionsContainer}
      {tertiaryAction}
    </Container>
  );
};

export default EmptyState;
