import { token } from '@atlaskit/tokens';

/**
 * Design decisions for the drop indicator's main line
 */
export const line = {
  borderRadius: 0,
  thickness: 2,
  backgroundColor: token('color.border.brand', '#0052CC'),
};

/**
 * Design decisions for the drop indicator's terminal,
 * which is used for trees
 */
export const terminal = {
  size: 8,
  borderWidth: line.thickness,
  borderColor: line.backgroundColor,
  borderRadius: '50%',
  backgroundColor: 'transparent',
};

export const cssVar = {
  offset: '--local-line--offset',
  inset: '--local-line--inset',
};
