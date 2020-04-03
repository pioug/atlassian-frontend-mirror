import React from 'react';
import { shallow } from 'enzyme';
import { Dropzone } from '../../dropzone';
import { Wrapper, Content, Label, Glass } from '../../styled';
import { UploadIcon } from '../../icons';

describe('<Dropzone>', () => {
  describe('#render()', () => {
    it('should render correct components', () => {
      const element = shallow(<Dropzone isActive={true} />);

      expect(element).toHaveLength(1);
      expect(element.find(Content)).toHaveLength(1);
      expect(element.find(Label)).toHaveLength(1);
      expect(element.find(Glass)).toHaveLength(1);
      expect(element.find(UploadIcon)).toHaveLength(1);
    });

    it('should pass through isActive to Wrapper', () => {
      const element = shallow(<Dropzone isActive={true} />);

      expect(element.find(Wrapper).prop('isActive')).toBeTruthy();
    });
  });
});
