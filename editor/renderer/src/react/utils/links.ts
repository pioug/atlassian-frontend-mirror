import {
  HeadingAnchorLinksProps,
  HeadingAnchorLinksConfig,
} from '../../ui/Renderer/types';

export function isNestedHeaderLinksEnabled(
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps,
) {
  // If it's a boolean or undefined, then we don't support nesting.
  if (
    !allowHeadingAnchorLinks ||
    typeof allowHeadingAnchorLinks === 'boolean'
  ) {
    return false;
  }

  const { allowNestedHeaderLinks } = allowHeadingAnchorLinks;
  // Explicit cast to a boolean to cover scenario where it's undefined.
  return !!allowNestedHeaderLinks;
}

export function getActiveHeadingId(
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps,
) {
  if (!isNestedHeaderLinksEnabled(allowHeadingAnchorLinks)) {
    return undefined;
  }

  return (allowHeadingAnchorLinks as HeadingAnchorLinksConfig).activeHeadingId;
}
