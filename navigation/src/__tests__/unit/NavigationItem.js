import React from 'react';
import Item from '@atlaskit/item';
import { toClass } from 'recompose';
import { ThemeProvider } from 'styled-components';
import Navigation from '../../components/js/Navigation';
import NavigationItem from '../../components/js/NavigationItem';
import NavigationItemIcon from '../../components/styled/NavigationItemIcon';
import NavigationItemAfter from '../../components/styled/NavigationItemAfter';
import { isDropdownOverflowKey } from '../../theme/util';
import { mountWithRootTheme } from './_theme-util';

describe('<NavigationItem />', () => {
  describe('props', () => {
    it('icon should render an image', () => {
      expect(
        mountWithRootTheme(<NavigationItem icon={<img alt="foo" />} />).find(
          'img',
        ).length,
      ).toBe(1);
    });
    it('isSelected=true should render a child with the isSelected prop', () => {
      expect(
        mountWithRootTheme(<NavigationItem isSelected />)
          .find('Item')
          .props().isSelected,
      ).toBe(true);
    });
    it('isSelected=false should not render a child with the isSelected prop', () => {
      expect(
        mountWithRootTheme(<NavigationItem />)
          .find('Item')
          .props().isSelected,
      ).toBe(false);
    });
    it('with a href should render onto the link', () => {
      expect(
        mountWithRootTheme(<NavigationItem href="foo" />)
          .find('Item')
          .props().href,
      ).toBe('foo');
    });
    it('with no href should not render a link', () => {
      expect(mountWithRootTheme(<NavigationItem />).find('a').length).toBe(0);
    });
    it('with an onClick should call the onClick', () => {
      const spy = jest.fn();
      const navigation = mountWithRootTheme(<NavigationItem onClick={spy} />);
      navigation.find('Item').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('with an onKeyDown should call the onKeyDown', () => {
      const spy = jest.fn();
      const navigation = mountWithRootTheme(<NavigationItem onKeyDown={spy} />);
      navigation.find('Item').simulate('keydown');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('with an onMouseEnter should call the onMouseEnter', () => {
      const spy = jest.fn();
      const navigation = mountWithRootTheme(
        <NavigationItem onMouseEnter={spy} />,
      );
      navigation.find('Item').simulate('mouseenter');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('with an onMouseLeave should call the onMouseLeave', () => {
      const spy = jest.fn();
      const navigation = mountWithRootTheme(
        <NavigationItem onMouseLeave={spy} />,
      );
      navigation.find('Item').simulate('mouseleave');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('with an onClick and href should render the href on a link, and bind the onClick to it', () => {
      const spy = jest.fn();
      const navigation = mountWithRootTheme(
        <NavigationItem href="foo" onClick={spy} />,
      );
      navigation.find('a').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(navigation.find('a').props().href).toBe('foo');
    });
    it('with target and href should render the href and target on a link', () => {
      const navigation = mountWithRootTheme(
        <NavigationItem href="foo" target="_blank" />,
      );
      expect(navigation.find('a').props().target).toBe('_blank');
    });
    it('linkComponent should render a custom link component', () => {
      const myLinkComponent = toClass(({ children, href }) => (
        <a className="custom" href={href}>
          {children}
        </a>
      ));
      const customLink = mountWithRootTheme(
        <NavigationItem href="#custom-href" linkComponent={myLinkComponent} />,
      ).find('.custom');
      expect(customLink).not.toBe(undefined);
      expect(customLink.props().href).toBe('#custom-href');
    });
    it('textAfter should render in the navigation item', () => {
      expect(
        mountWithRootTheme(
          <NavigationItem action={<span className="ACTION" />} />,
        ).find('.ACTION').length,
      ).toBeGreaterThan(0);
    });
    it('action should render in the navigation item', () => {
      expect(
        mountWithRootTheme(
          <NavigationItem textAfter={<span className="TEXTAFTER" />} />,
        ).find('.TEXTAFTER').length,
      ).toBeGreaterThan(0);
    });
    it('textAfter should not render if the prop is not set', () => {
      expect(
        mountWithRootTheme(<NavigationItem />).find('TextAfter').length,
      ).toBe(0);
    });
    it('action should not render if the prop is not set', () => {
      expect(
        mountWithRootTheme(<NavigationItem />).find('NavigationItemAction')
          .length,
      ).toBe(0);
    });
    it('textAfter and action should both be renderable at the same time', () => {
      const wrapper = mountWithRootTheme(
        <NavigationItem
          action={<span className="ACTION" />}
          textAfter={<span className="TEXTAFTER" />}
        />,
      );
      expect(wrapper.find('.ACTION').length).toBeGreaterThan(0);
      expect(wrapper.find('.TEXTAFTER').length).toBeGreaterThan(0);
    });
    it('subText should render in the navigation item', () => {
      expect(
        mountWithRootTheme(<NavigationItem subText="SUBTEXT" />).html(),
      ).toEqual(expect.stringContaining('SUBTEXT'));
    });

    describe('isDropdownTrigger=true and dropIcon is provided', () => {
      it('should render dropIcon', () => {
        const wrapper = mountWithRootTheme(
          <NavigationItem isDropdownTrigger dropIcon={<img alt="foo" />} />,
        );
        expect(wrapper.find('img').length).toBe(1);
      });

      it('should render NavigationItemIcon wrapper with isDropdownTrigger prop forwarded', () => {
        const wrapper = mountWithRootTheme(
          <NavigationItem isDropdownTrigger dropIcon={<img alt="foo" />} />,
        );
        expect(wrapper.find(NavigationItemIcon).prop('isDropdownTrigger')).toBe(
          true,
        );
      });

      describe('if textAfter is provided', () => {
        it('should render NavigationItemAfter wrapper with isDropdownTrigger prop forwarded', () => {
          const wrapper = mountWithRootTheme(
            <NavigationItem
              isDropdownTrigger
              dropIcon={<img alt="foo" />}
              textAfter="test"
            />,
          );
          expect(
            wrapper
              .find(NavigationItemAfter)
              .at(0)
              .prop('isDropdownTrigger'),
          ).toBe(true);
        });
      });
    });
    it('should render a caption if one is provided', () => {
      const wrapper = mountWithRootTheme(<NavigationItem caption="CAPTION" />);
      expect(wrapper.html()).toEqual(expect.stringContaining('CAPTION'));
    });

    describe('isDropdownTrigger=false and dropIcon is provided', () => {
      it('should not render dropIcon', () => {
        const wrapper = mountWithRootTheme(
          <NavigationItem dropIcon={<img alt="foo" />} />,
        );
        expect(wrapper.find(NavigationItemIcon).length).toBe(0);
        expect(wrapper.find('img').length).toBe(0);
      });

      describe('if textAfter is provided', () => {
        it('should render NavigationItemAfter wrapper without isDropdownTrigger prop forwarded', () => {
          const wrapper = mountWithRootTheme(
            <NavigationItem dropIcon={<img alt="foo" />} textAfter="test" />,
          );
          expect(
            wrapper.find(NavigationItemAfter).prop('isDropdownTrigger'),
          ).toBe(false);
        });
      });
    });
  });
  describe('props required for drag and drop compatibility', () => {
    it('should be able to get a reference to the navigation item', () => {
      const refSpy = jest.fn();
      const dnd = {
        innerRef: refSpy,
        draggableProps: { style: {} },
        placeholder: null,
      };
      mountWithRootTheme(<NavigationItem text="test" dnd={dnd} />);
      expect(refSpy).toHaveBeenCalled();
    });
    it('should be able to apply inline styles', () => {
      const refSpy = jest.fn();
      const dnd = {
        innerRef: refSpy,
        draggableProps: { style: { textDecoration: 'underline' } },
        placeholder: null,
      };
      mountWithRootTheme(<NavigationItem text="test" dnd={dnd} />);
      expect(refSpy.mock.calls[0][0].style.textDecoration).toBe('underline');
    });
  });
  describe('behaviour', () => {
    it('mousedown on the link is prevented', () => {
      const spy = jest.fn();
      mountWithRootTheme(<NavigationItem href="foo" />)
        .find('a')
        .simulate('mouseDown', {
          preventDefault: spy,
        });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('a11y nav item role dependening on context', () => {
    it('should apply role=menuitem when in the context of an overflow dropdown', () => {
      const wrapper = mountWithRootTheme(
        <Navigation>
          <ThemeProvider theme={{ [isDropdownOverflowKey]: true }}>
            <NavigationItem />
          </ThemeProvider>
        </Navigation>,
      );
      const navItem = wrapper.find(Item).find('span[role="menuitem"]');
      expect(navItem.length).toBe(1);
    });

    it('should not apply role when not in the context of an overflow dropdown', () => {
      const wrapper = mountWithRootTheme(
        <Navigation>
          <NavigationItem />
        </Navigation>,
      );
      const navItem = wrapper.find(Item).find('span[role="menuitem"]');
      expect(navItem.length).toBe(0);
    });
  });
});

describe('NavigationItemWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mountWithRootTheme(
      <Navigation>
        <NavigationItem />
      </Navigation>,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
