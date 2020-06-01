import { shallow } from 'enzyme';
import Spinner from '@atlaskit/spinner';
import React from 'react';
import { ModalSpinner } from '../../index';

describe('Modal Spinner', () => {
  it('should show spinner', () => {
    const component = shallow(
      <ModalSpinner blankedColor={'white'} invertSpinnerColor={false} />,
    );
    expect(component.find(Spinner)).toHaveLength(1);
  });
  it('should set spinner to inverted mode when specified to do so', () => {
    const component = shallow(
      <ModalSpinner blankedColor={'white'} invertSpinnerColor={true} />,
    );
    expect(component.find(Spinner).prop('appearance')).toEqual('invert');
  });
  it('should set blanked background color to specified one', () => {
    const component = shallow(
      <ModalSpinner blankedColor={'white'} invertSpinnerColor={true} />,
    );
    expect(component.props().style.backgroundColor).toEqual('white');
  });
  it('should handle default (no props provided) case', () => {
    const component = shallow(<ModalSpinner />);
    expect(component.props().style.backgroundColor).toEqual('none');
    expect(component.find(Spinner).prop('appearance')).toEqual('inherit');
  });
});
