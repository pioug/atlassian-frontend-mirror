import { token } from '@atlaskit/tokens';

// Temporary safeguard while @atlaskit/tokens is being developed
export const safeToken = (path: string, fallback?: string) => {
  try {
    return token(path as any, fallback);
  } catch (e) {
    return fallback;
  }
};

export const tokens = {
  actionIcon: safeToken('color.icon', '#44546F'),
  background: safeToken('elevation.surface', '#FFFFFF'),
  badgeIcon: safeToken('color.icon.subtle', '#626F86'),
  badgeText: safeToken('color.text.subtlest', '#626F86'),
  blackLink: safeToken('color.text.subtle', '#44546F'),
  blackLinkPressed: safeToken('color.text', '#172B4D'),
  blueLink: safeToken('color.link', '#0C66E4'),
  blueLinkPressed: safeToken('color.link.pressed', '#0055CC'),
  elevation: safeToken(
    'elevation.shadow.raised',
    '0px 1px 1px #091E4240, 0px 0px 1px #091E424F',
  ),
  errorMessage: safeToken('color.text.disabled', '#6B778C'),
  errorMessageHover: safeToken('color.text.subtle', '#8993A4'),
  snippet: safeToken('color.text', '#172B4D'),
  text: safeToken('color.text.subtlest', '#626F86'),
};
