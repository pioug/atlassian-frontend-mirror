import { B200 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/media-ui';
/*
 * Used to display the blue border around a selected card without
 * shrinking the image OR growing the card size
 */
export const getSelectedBorderStyle = ({
  selected,
}: {
  selected?: boolean;
}) => {
  const border = `border: 2px solid ${selected ? B200 : 'transparent'};`;

  return `
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      box-sizing: border-box;
      pointer-events: none;
      ${borderRadius} 
      ${border};
    }
  `;
};
