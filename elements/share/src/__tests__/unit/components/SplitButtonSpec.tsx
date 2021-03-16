import Button from '@atlaskit/button/custom-theme-button';
import { mount } from 'enzyme';
import React from 'react';
import SplitButton from '../../../components/SplitButton';
import {
  DropdownMenuStateless,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import IntegrationButton from '../../../components/IntegrationButton';

describe('Share Split Button', () => {
  const mockCreateAndFireEventFunction = jest.fn();
  const mockOpenSplitButtonFunction = jest.fn();
  const mockCloseSplitButtonFunction = jest.fn();
  const mockToggleShareToSlackFunction = jest.fn();
  const mockIntegrationClickHandler = jest.fn();

  const MockShareButton = () => <Button />;
  const MockIcon = () => <div />;
  const MockContent = () => <div />;
  const defaultSplitButtonProps = {
    shareButton: <MockShareButton />,
    handleOpenSplitButton: mockOpenSplitButtonFunction,
    handleCloseSplitButton: mockCloseSplitButtonFunction,
    isUsingSplitButton: false,
    toggleShareToSlack: mockToggleShareToSlackFunction,
    createAndFireEvent: mockCreateAndFireEventFunction,
    shareIntegrations: [
      { type: 'Slack', Icon: MockIcon, Content: MockContent },
    ],
    onIntegrationClick: mockIntegrationClickHandler,
  };

  describe('is rendering', () => {
    it('just the two buttons when the menu is closed', () => {
      const component = mount(<SplitButton {...defaultSplitButtonProps} />);
      expect(component.find(MockShareButton)).toHaveLength(1);
      expect(component.find(DropdownMenuStateless)).toHaveLength(1);
    });
    it('dropdown menu when the split button has been clicked', () => {
      const component = mount(<SplitButton {...defaultSplitButtonProps} />);
      component.setProps({ isUsingSplitButton: true });

      expect(component.find(MockShareButton)).toHaveLength(1);
      expect(component.find(DropdownMenuStateless)).toHaveLength(1);
      expect(component.find(DropdownItemGroup)).toHaveLength(1);
      expect(component.find(IntegrationButton)).toHaveLength(1);
      expect(component.find(IntegrationButton).find(MockIcon)).toHaveLength(1);
    });
  });
  describe('is rendering', () => {
    it('just the two buttons when the menu is closed', () => {
      const component = mount(<SplitButton {...defaultSplitButtonProps} />);
      expect(component.find(MockShareButton)).toHaveLength(1);
      expect(component.find(DropdownMenuStateless)).toHaveLength(1);
    });
    it('dropdown menu when the split button has been clicked', () => {
      const component = mount(<SplitButton {...defaultSplitButtonProps} />);
      component.setProps({ isUsingSplitButton: true });

      expect(component.find(MockShareButton)).toHaveLength(1);
      expect(component.find(DropdownMenuStateless)).toHaveLength(1);
      expect(component.find(DropdownItemGroup)).toHaveLength(1);
      expect(component.find(IntegrationButton)).toHaveLength(1);
      expect(component.find(IntegrationButton).find(MockIcon)).toHaveLength(1);
    });
  });
  describe('provides the correct functionality', () => {
    it('when clicking on the slack option in the dropdown menu', () => {
      const component = mount(<SplitButton {...defaultSplitButtonProps} />);
      component.setProps({ isUsingSplitButton: true });
      component.find(IntegrationButton).simulate('click');
      expect(mockIntegrationClickHandler).toHaveBeenCalledTimes(1);
    });
  });
});
