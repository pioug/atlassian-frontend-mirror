import React from 'react';
import {
  Truncate,
  TruncateProps,
  TruncateLeft,
  TruncateRight,
} from '../../truncateText';
import { mount } from 'enzyme';
import { calculateTruncation } from '../../truncateText';

const setup = (props: TruncateProps) => mount(<Truncate {...props} />);

describe('TruncateText', () => {
  describe('Text Calculation', () => {
    it('it should not truncate text when enough size', () => {
      const output = calculateTruncation('1234567890.ext', 14, 0);
      expect(output.left).toEqual(output.right);
    });

    it('it should truncate text when required', () => {
      const output = calculateTruncation('1234567890.ext', 5, 4);
      expect(output.left).toEqual('1234567890'); // everything before 4 chars from end
      expect(output.right).toEqual('.ext'); // 4 chars from text end
    });
  });

  describe('Truncate Component', () => {
    it('it should not create left and right elements when enough size', () => {
      const el = setup({
        text: '1234567890.ext',
        startFixedChars: 14,
        endFixedChars: 0,
      });
      expect(el.find(TruncateLeft)).toHaveLength(0);
      expect(el.find(TruncateRight)).toHaveLength(0);
      expect(el.text()).toEqual('1234567890.ext');
    });

    it('it should create left and right elements when required', () => {
      const el = setup({
        text: '1234567890.ext',
        startFixedChars: 5,
        endFixedChars: 4,
      });
      expect(el.find(TruncateLeft)).toHaveLength(1);
      expect(el.find(TruncateRight)).toHaveLength(1);
      expect(el.find(TruncateLeft).text()).toEqual('1234567890');
      expect(el.find(TruncateRight).text()).toEqual('.ext');
    });
  });
});
