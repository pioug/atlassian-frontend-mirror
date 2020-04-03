import { CardDimensionValue } from '../';
import { size } from '@atlaskit/media-ui';

export type BreakpointSizeValue = 'small' | 'medium' | 'large' | 'xlarge';

export const breakpointSize = (
  width: CardDimensionValue,
  sizes: any = cardBreakpointSizes,
): BreakpointSizeValue => {
  const value = parseInt(`${width}`, 10); // Normalize value
  const keys = Object.keys(sizes);
  const defaultValue = keys[0];
  let breakpoint: any;

  keys.forEach(label => {
    if (value < sizes[label] && !breakpoint) {
      breakpoint = label;
    }
  });

  return breakpoint || defaultValue;
};

export interface BreakpointProps {
  breakpointSize: BreakpointSizeValue;
}

export type CardBreakpoint = { [P in BreakpointSizeValue]?: number };

export const cardBreakpointSizes: CardBreakpoint = {
  small: 173,
  medium: 225,
  large: 300,
  xlarge: Infinity,
};

export const breakpointStyles = ({ breakpointSize }: BreakpointProps) => {
  switch (breakpointSize) {
    case 'small':
      return `
        .title {
          font-size: 12px;
        }
        .file-type-icon span {
          // We need to use important here since we can't use the dimensions provided by the Icon component
          ${size('14px !important')}
        }
      `;

    case 'medium':
      return `
        .title {
          font-size: 14px;
        }
        .file-type-icon span {
          ${size('16px !important')}
        }
      `;

    case 'large':
      return `
        .overlay {
          padding: 24px;
        }
        .title {
          font-size: 14px;
        }
        .file-size {
          font-size: 14px;
        }
        .file-type-icon span {
          ${size('18px !important')}
        }
      `;

    case 'xlarge':
      return `
        border-radius: 2px;

        .title {
          font-size: 16px;
        }

        .file-size {
          font-size: 14px;
        }
        
        .wrapper, .img-wrapper {
          border-radius: 2px;
        }

        .overlay {
          padding: 24px;
        }

        .file-type-icon span {
          ${size('18px !important')}
        }
      `;
  }
};
