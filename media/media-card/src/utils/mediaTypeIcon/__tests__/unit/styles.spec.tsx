import React from 'react';
import { mount } from 'enzyme';
import { IconWrapper } from '../../iconWrapper';

describe('CardGenericViewSmall', () => {
  describe('MediaTypeIcon', () => {
    describe('IconWrapper', () => {
      const iconWrapperId = 'div#iconWrapper';

      it('should render the correct color when type="image"', () => {
        const element = mount(<IconWrapper type="image" />);

        const wrapper = element.find(iconWrapperId);
        const styles = getComputedStyle(wrapper.getDOMNode());

        expect(styles.color).toBe('rgb(255, 196, 0)');
      });

      it('should render the correct color when type="audio"', () => {
        const element = mount(<IconWrapper type="audio" />);

        const wrapper = element.find(iconWrapperId);
        const styles = getComputedStyle(wrapper.getDOMNode());

        expect(styles.color).toBe('rgb(135, 119, 217)');
      });

      it('should render the correct color when type="video"', () => {
        const element = mount(<IconWrapper type="video" />);

        const wrapper = element.find(iconWrapperId);
        const styles = getComputedStyle(wrapper.getDOMNode());

        expect(styles.color).toBe('rgb(255, 113, 67)');
      });

      it('should render the correct color when type="doc"', () => {
        const element = mount(<IconWrapper type="doc" />);

        const wrapper = element.find(iconWrapperId);
        const styles = getComputedStyle(wrapper.getDOMNode());

        expect(styles.color).toBe('rgb(0, 101, 255)');
      });

      it('should render the correct color when type="unknown"', () => {
        const element = mount(<IconWrapper type="unknown" />);

        const wrapper = element.find(iconWrapperId);
        const styles = getComputedStyle(wrapper.getDOMNode());

        expect(styles.color).toBe('rgb(61, 199, 220)');
      });
    });
  });
});
