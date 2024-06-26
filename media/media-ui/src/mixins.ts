import { borderRadius as akBorderRadius } from '@atlaskit/theme/constants';

export const ellipsis = (maxWidth: string | number = '100%') => {
	const unit = typeof maxWidth === 'number' ? 'px' : '';

	return `
    max-width: ${maxWidth}${unit};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
};

export const size = (value: string | number = '100%') => {
	const unit = typeof value === 'number' ? 'px' : '';

	return `
    width: ${value}${unit};
    height: ${value}${unit};
  `;
};

export const center = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const absolute = (top = 0, left = 0) => `
  position: absolute;
  top: ${top}px;
  left: ${left}px;
`;

export const borderRadius = `
  border-radius: ${akBorderRadius()}px;
`;

export const borderRadiusBottom = `
  border-bottom-left-radius: ${akBorderRadius()}px;
  border-bottom-right-radius: ${akBorderRadius()}px;
`;

export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
