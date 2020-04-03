jest.mock('bricks.js');

import { shallow } from 'enzyme';
import React from 'react';
import BricksStub from 'bricks.js';
import { BricksLayout } from '../../bricksGrid';

const bricksInstanceStub = {
  resize: jest.fn(),
  pack: jest.fn(),
};

describe('StatelessGiphySidebarItem component', () => {
  beforeEach(() => {
    (BricksStub as any).mockReset();
    (BricksStub as any).mockReturnValue(bricksInstanceStub);
    bricksInstanceStub.pack.mockReset();
    bricksInstanceStub.resize.mockReset();
  });

  describe('#componentDidMount()', () => {
    it('should create an instance of Brick class from bricks.js', () => {
      shallow(<BricksLayout id={'some-id'}>{[]}</BricksLayout>);

      expect(BricksStub).toHaveBeenCalledTimes(1);
      expect(BricksStub).toHaveBeenCalledWith({
        container: '#some-id',
        packed: 'data-packed',
        sizes: [{ columns: 3, gutter: 10 }],
      });
    });

    it('should set the created instance of Brick class from bricks.js into the component state', () => {
      const element = shallow(<BricksLayout id={'some-id'}>{[]}</BricksLayout>);

      expect(element.state('instance')).toBe(bricksInstanceStub);
    });

    it('should call resize(true) on the created instance of Brick class from bricks.js', () => {
      shallow(<BricksLayout id={'some-id'}>{[]}</BricksLayout>);

      expect(bricksInstanceStub.resize).toHaveBeenCalledTimes(1);
      expect(bricksInstanceStub.resize).toHaveBeenCalledWith(true);
    });
  });

  describe('#componentDidUpdate()', () => {
    it('should NOT pack() the Bricks instance if prevChildren and currChildren have length 0', () => {
      const element = shallow(<BricksLayout id={'some-id'}>{[]}</BricksLayout>);

      element.setState({ instance: bricksInstanceStub });
      expect(bricksInstanceStub.pack).toHaveBeenCalledTimes(0);
    });

    it('should pack() the Bricks instance if currChildren have length greater than 0', () => {
      const child = [<div key="first-child">This is some child</div>];

      shallow(<BricksLayout id={'some-id'}>{child}</BricksLayout>);

      expect(bricksInstanceStub.pack).toHaveBeenCalledTimes(1);
    });
  });

  describe('#componentWillUnmount()', () => {
    it('should set the instance resize to false', () => {
      const element = shallow(<BricksLayout id={'some-id'}>{[]}</BricksLayout>);
      element.setState({ instance: bricksInstanceStub });
      (element.instance() as any).componentWillUnmount();
      expect(bricksInstanceStub.resize).toHaveBeenCalledTimes(2);
      expect(bricksInstanceStub.resize).toHaveBeenCalledWith(true);
      expect(bricksInstanceStub.resize).toHaveBeenLastCalledWith(false);
    });
  });

  describe('#render()', () => {
    it('should render passed in children', () => {
      const id = 'some-id';
      const child = [<div key="first-child">This is some child</div>];

      const element = shallow(<BricksLayout id={id}>{child}</BricksLayout>);

      expect(element.contains(child[0])).toBe(true);
    });

    it('should set id of root element to passed in id prop', () => {
      const id = 'some-id';
      const child = [<div key="first-child">This is some child</div>];

      const element = shallow(<BricksLayout id={id}>{child}</BricksLayout>);

      expect(element.props().id).toBe(id);
    });
  });
});
