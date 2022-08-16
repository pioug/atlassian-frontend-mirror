import { token } from '@atlaskit/tokens';

export const tokens = {
  actionIcon: token('color.icon', '#44546F'),
  background: token('elevation.surface.raised', '#FFFFFF'),
  badgeIcon: token('color.icon.subtle', '#626F86'),
  badgeText: token('color.text.subtlest', '#626F86'),
  blackLink: token('color.text.subtle', '#44546F'),
  blackLinkPressed: token('color.text', '#172B4D'),
  blueLink: token('color.link', '#0C66E4'),
  blueLinkPressed: token('color.link.pressed', '#0055CC'),
  elevation: token(
    'elevation.shadow.raised',
    '0px 1px 1px #091E4240, 0px 0px 1px #091E424F',
  ),
  errorMessage: token('color.text.disabled', '#6B778C'),
  errorMessageHover: token('color.text.subtle', '#8993A4'),
  focus: token('color.border.focused', '#388BFF'),
  snippet: token('color.text', '#172B4D'),
  text: token('color.text.subtlest', '#626F86'),
};
