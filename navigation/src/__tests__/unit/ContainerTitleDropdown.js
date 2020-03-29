import React from 'react';
import AkDropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { AtlassianIcon } from '@atlaskit/logo';
import ContainerTitleDropdown from '../../components/js/ContainerTitleDropdown';
import { mountWithRootTheme } from './_theme-util';

describe('<ContainerTitleDropdown />', () => {
  let wrapper;
  beforeEach(() => {
    const items = [
      'Project 1',
      'Project 2',
      'Project 3',
      'Project 4',
      'Project 5',
    ];

    const dropdownItems = (
      <DropdownItemGroup title="Recent Projects">
        {items.map(item => (
          <DropdownItem key={item} description="this is description">
            {item}
          </DropdownItem>
        ))}
      </DropdownItemGroup>
    );

    wrapper = mountWithRootTheme(
      <ContainerTitleDropdown
        text="Project Switcher very long text"
        icon={<AtlassianIcon label="Atlassian" />}
        subText="Software project"
      >
        {dropdownItems}
      </ContainerTitleDropdown>,
    );
  });

  it('should render an AkDropdownMenu', () => {
    expect(wrapper.find(AkDropdownMenu)).toHaveLength(1);
  });

  it('should pass down defaultOpen to dropdown', () => {
    wrapper.setProps({ defaultDropdownOpen: true });
    expect(wrapper.find(AkDropdownMenu).prop('defaultOpen')).toBe(true);

    wrapper.setProps({ defaultDropdownOpen: false });
    expect(wrapper.find(AkDropdownMenu).prop('defaultOpen')).toBe(false);
  });

  it('should pass down isOpen to dropdown', () => {
    wrapper.setProps({ isDropdownOpen: true });
    expect(wrapper.find(AkDropdownMenu).prop('isOpen')).toBe(true);

    wrapper.setProps({ isDropdownOpen: false });
    expect(wrapper.find(AkDropdownMenu).prop('isOpen')).toBe(false);
  });

  it('should pass down isLoading to dropdown', () => {
    wrapper.setProps({ isDropdownLoading: true });
    expect(wrapper.find(AkDropdownMenu).prop('isLoading')).toBe(true);

    wrapper.setProps({ isDropdownLoading: false });
    expect(wrapper.find(AkDropdownMenu).prop('isLoading')).toBe(false);
  });

  it('should pass down onOpenChange to dropdown', () => {
    const noop = () => {};
    wrapper.setProps({ onDropdownOpenChange: noop });

    expect(wrapper.find(AkDropdownMenu).prop('onOpenChange')).toBe(noop);
  });
});
