import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Button from '@atlaskit/button';
import { FlagWithoutAnalytics as Flag } from '../../Flag';
import Actions from '../../FlagActions';
import { Action } from '../../FlagActions/styledFlagActions';
import { FlagProps } from '../../../types';

describe('actions prop', () => {
  const generateFlag = (extraProps: Partial<FlagProps>) => (
    <Flag id="" icon={<div />} title="Flag" {...extraProps} />
  );
  let flag: ReactWrapper;
  let actionSpy: () => void;

  beforeEach(() => {
    actionSpy = jest.fn();
    flag = mount(
      generateFlag({
        actions: [
          { content: 'Hello!', onClick: actionSpy },
          { content: 'Goodbye!', onClick: actionSpy },
          { content: 'with href', href: 'hrefString' },
        ],
      }),
    );
  });

  it('actions should be rendered', () => {
    const actionItems = flag.find(Action);
    expect(actionItems.length).toBe(3);
    expect(actionItems.at(0).text()).toBe('Hello!');
    expect(actionItems.at(1).text()).toBe('Goodbye!');
    expect(actionItems.at(2).text()).toBe('with href');
  });

  it('action onClick should be triggered on click', () => {
    flag
      .find('button')
      .first()
      .simulate('click');
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  it('should pass appearance value on to styled sub-components', () => {
    // creating flag with appearance prop
    flag = mount(generateFlag({ appearance: 'info', isDismissAllowed: true }));
    flag.setState({ isExpanded: true });
    flag.setProps({
      actions: [{ content: 'Hello!', onClick: () => {} }],
      description: 'Hi there',
    });
    expect(flag.find(Actions).prop('appearance')).toBe('info');
  });

  it('should render atlaskit button as action', () => {
    flag = mount(generateFlag({ appearance: 'info', isDismissAllowed: true }));
    flag.setState({ isExpanded: true });
    flag.setProps({
      actions: [{ content: 'Hello!', onClick: () => {} }],
      description: 'Hi there',
    });
    expect(flag.find(Button).length).toBe(1);
  });
  it('should pass down href and target to the button', () => {
    flag = mount(generateFlag({ appearance: 'info', isDismissAllowed: true }));
    flag.setState({ isExpanded: true });
    flag.setProps({
      actions: [
        {
          content: 'Hello!',
          href: 'https://atlaskit.atlassian.com/',
          target: '_blank',
        },
      ],
      description: 'Hi there',
    });
    expect(flag.find(Button).prop('href')).toBe(
      'https://atlaskit.atlassian.com/',
    );
    expect(flag.find(Button).prop('target')).toBe('_blank');
  });
});
