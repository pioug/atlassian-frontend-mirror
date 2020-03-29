import React from 'react';
import { mount } from 'enzyme';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { Transition } from 'react-transition-group';
import Flag from '../../..';
import Container, { DismissButton } from '../../Flag/styledFlag';
import FlagGroup from '../../FlagGroup';
import { FlagProps } from '../../../types';

describe('FlagGroup', () => {
  const generateFlag = (extraProps?: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );

  it('should render the correct number of Flag children', () => {
    const wrapper = mount(
      <FlagGroup>
        {generateFlag()}
        {generateFlag()}
        {generateFlag()}
      </FlagGroup>,
    );
    expect(wrapper.find(Container).length).toBe(3);
  });

  it('onDismissed should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <FlagGroup onDismissed={spy}>
        {generateFlag({
          id: 'a',
          isDismissAllowed: true,
          onDismissed: spy,
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );
    wrapper.find(DismissButton).simulate('click');
    wrapper
      .find(Container)
      .first()
      .simulate('animationEnd');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('should render flagGroup in portal', () => {
    const wrapper = mount(<FlagGroup>{generateFlag()}</FlagGroup>);
    expect((wrapper.find(Portal).props() as { zIndex: number }).zIndex).toBe(
      layers.flag(),
    );
  });

  it('should properly add end listener to single flag in group', () => {
    const doneMock = jest.fn();
    const nodeMock: HTMLElement = ({
      addEventListener: jest.fn(),
    } as unknown) as HTMLElement;
    const wrapper = mount(<FlagGroup>{generateFlag({ id: 'a' })}</FlagGroup>);
    (wrapper
      .find(Transition)
      .first()
      .props() as any).addEndListener(nodeMock, doneMock);
    expect(doneMock).toBeCalledTimes(0);
    expect(nodeMock.addEventListener).toBeCalledTimes(2);
    expect(nodeMock.addEventListener).toHaveBeenCalledWith(
      'animationstart',
      expect.anything(),
    );
    expect(nodeMock.addEventListener).toHaveBeenCalledWith(
      'animationend',
      expect.anything(),
    );
  });

  it('should properly add end listener to many flags in group', () => {
    const doneMocks = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];
    const nodeMocks: Array<HTMLElement> = [
      ({ addEventListener: jest.fn() } as unknown) as HTMLElement,
      ({ addEventListener: jest.fn() } as unknown) as HTMLElement,
      ({ addEventListener: jest.fn() } as unknown) as HTMLElement,
      ({ addEventListener: jest.fn() } as unknown) as HTMLElement,
    ];
    const expectedResults = [
      { doneCalledTimes: 0, addEventListenerCalledTimes: 2 },
      { doneCalledTimes: 1, addEventListenerCalledTimes: 0 },
      { doneCalledTimes: 1, addEventListenerCalledTimes: 0 },
      { doneCalledTimes: 1, addEventListenerCalledTimes: 0 },
    ];
    const wrapper = mount(
      <FlagGroup>
        {generateFlag({ id: 'a' })}
        {generateFlag({ id: 'b' })}
        {generateFlag({ id: 'c' })}
        {generateFlag({ id: 'd' })}
      </FlagGroup>,
    );
    wrapper
      .find(Transition)
      .forEach((transition, index) =>
        (transition.props() as any).addEndListener(
          nodeMocks[index],
          doneMocks[index],
        ),
      );
    doneMocks.forEach((mock, index) => {
      expect(mock).toBeCalledTimes(expectedResults[index].doneCalledTimes);
    });
    nodeMocks.forEach((mock, index) => {
      expect(mock.addEventListener).toBeCalledTimes(
        expectedResults[index].addEventListenerCalledTimes,
      );
    });
    expect(nodeMocks[0].addEventListener).toHaveBeenCalledWith(
      'animationstart',
      expect.anything(),
    );
    expect(nodeMocks[0].addEventListener).toHaveBeenCalledWith(
      'animationend',
      expect.anything(),
    );
  });
});
