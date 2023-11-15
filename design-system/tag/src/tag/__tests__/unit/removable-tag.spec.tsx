import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { cssVar } from '../../../constants';
import * as styles from '../../../styles';
import RemovableTag from '../../internal/removable';
import getCSSVar from '../_utils/get-css-var';

describe('<RemovableTag />', () => {
  describe('removal indicator', () => {
    it('should render a remove button', () => {
      const { getByTestId } = render(<RemovableTag text="" testId="tag" />);
      expect(getByTestId('close-button-tag')).toBeInTheDocument();
    });

    it('should apply css vars on hover', () => {
      const { getByTestId } = render(<RemovableTag text="" testId="tag" />);
      const tag = getByTestId('tag');
      const removeButton = getByTestId('close-button-tag');
      fireEvent.mouseOver(removeButton);

      expect(getCSSVar(tag, cssVar.color.background.hover)).toBe(
        styles.removalHoverBackgroundColors,
      );

      expect(getCSSVar(tag, cssVar.color.background.active)).toBe(
        styles.removalActiveBackgroundColors,
      );

      expect(getCSSVar(tag, cssVar.color.text.default)).toBe(
        styles.removalTextColors,
      );
    });
  });
});
