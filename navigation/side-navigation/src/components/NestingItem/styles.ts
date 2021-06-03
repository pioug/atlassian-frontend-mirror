import { CSSFn } from '@atlaskit/menu';

// exposed for testing purposes
export const enabledCSS = {
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
  ['& [data-right-arrow]']: { display: 'none' },
};

export const nestingItemStyle: CSSFn = (state) => {
  return {
    ...(state.isDisabled ? disabledCSS : enabledCSS),
  };
};
