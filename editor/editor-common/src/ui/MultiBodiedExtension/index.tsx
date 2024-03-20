/** @jsx jsx */

import { css } from '@emotion/react';

import { N30, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// Wraps the navigation bar and extensionFrames
const mbeExtensionContainer = css({
  background: 'transparent !important',
  'padding:': {
    left: `${token('space.100', '8px')} !important`,
    right: `${token('space.100', '8px')} !important`,
  },
  paddingBottom: token('space.100', '8px'),
  '&.remove-padding': {
    paddingBottom: 0,
  },
  position: 'relative',
  verticalAlign: 'middle',
  cursor: 'pointer',
  '.multiBodiedExtension-handler-result': {
    marginLeft: token('space.100', '8px'),
  },
  ".multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'], .multiBodiedExtension--frames > [data-extension-frame='true']":
    {
      display: 'none',
      background: token('elevation.surface', 'white'),
    },
  '.multiBodiedExtension-content-dom-wrapper, .multiBodiedExtension--frames': {
    "[data-extension-frame='true'] > :not(style):first-child, [data-extension-frame='true'] > style:first-child + *":
      {
        marginTop: 0,
      },
  },
});

const mbeNavigation = css({
  borderTopLeftRadius: token('border.radius', '3px'),
  borderTopRightRadius: token('border.radius', '3px'),
  userSelect: 'none',
  WebkitUserModify: 'read-only',
  border: `1px solid ${token('color.border', N40)}`,
  borderBottom: 'none !important',
  background: token('elevation.surface', 'white'),
  marginLeft: token('space.100', '8px'),
  marginRight: token('space.100', '8px'),
  '&.remove-margins': {
    marginLeft: 0,
    marginRight: 0,
  },
  '&.remove-border': {
    border: 'none',
  },
});

const extensionFrameContent = css({
  padding: `${token('space.100', '8px')} !important`,
  border: `1px solid ${token('color.border', N30)}`,
  display: 'block',
  minHeight: '100px',
  background: token('elevation.surface', 'white'),
  borderBottomLeftRadius: token('border.radius', '3px'),
  borderBottomRightRadius: token('border.radius', '3px'),
  marginLeft: token('space.100', '8px'),
  marginRight: token('space.100', '8px'),
  cursor: 'initial',
  '.pm-table-with-controls': {
    marginLeft: `${token('space.150', '12px')} !important`,
    paddingRight: `${token('space.150', '12px')} !important`,
  },
  '.bodiedExtensionView-content-wrap': {
    marginTop: `${token('space.150', '12px')} !important`,
  },
  '.extensionView-content-wrap': {
    marginTop: `${token('space.100', '8px')} !important`,
  },
});

export const removeMarginsAndBorder = css({
  marginLeft: 0,
  marginRight: 0,
  border: 'none',
});

export const sharedMultiBodiedExtensionStyles = {
  mbeExtensionContainer,
  mbeNavigation,
  extensionFrameContent,
};
