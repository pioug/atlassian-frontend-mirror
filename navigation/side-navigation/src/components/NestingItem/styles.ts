import { CSSFn } from '@atlaskit/menu';

const enabledCSS = {
  ['&:hover [data-custom-icon]']: { display: 'none' },
  ['&:active [data-custom-icon]']: { display: 'none' },
  ['&:focus [data-custom-icon]']: { display: 'none' },
  ['& [data-custom-icon]']: { display: 'inherit' },
  ['&:hover [data-right-arrow]']: { display: 'inherit' },
  ['&:active [data-right-arrow]']: { display: 'inherit' },
  ['&:focus [data-right-arrow]']: { display: 'inherit' },
  ['& [data-right-arrow]']: { display: 'none' },
};

const disabledCSS = {
  ['[data-item-elem-after]']: { opacity: 0 },
};

export const nestingItemStyle: CSSFn = (currentStyles, state) => {
  return {
    ...currentStyles,
    ...(state.isDisabled ? disabledCSS : enabledCSS),
  };
};
