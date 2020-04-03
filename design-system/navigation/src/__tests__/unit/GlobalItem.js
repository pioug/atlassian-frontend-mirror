import React from 'react';
import { GlobalItemBase } from '../../components/js/GlobalItem';
import DefaultLinkComponent from '../../components/js/DefaultLinkComponent';
import GlobalItemInner from '../../components/styled/GlobalItemInner';
import { shallowWithTheme, mountWithRootTheme } from './_theme-util';

describe('<GlobalItemBase />', () => {
  describe('rendering', () => {
    it('if no href prop supplied, renders a GlobalItemInner (with tabIndex 0) and no DefaultLinkComponent', () => {
      const wrapper = mountWithRootTheme(<GlobalItemBase />);
      expect(
        wrapper
          .find(GlobalItemInner)
          .find('button')
          .exists(),
      ).toBe(true);
      expect(wrapper.find(DefaultLinkComponent).exists()).toBe(false);
    });
    it('if href prop supplied, renders a DefaultLinkComponent containing a GlobalItemInner (without tabIndex', () => {
      const wrapper = mountWithRootTheme(<GlobalItemBase href="/" />);
      expect(wrapper.find(DefaultLinkComponent).exists()).toBe(true);
    });
  });

  describe('props', () => {
    describe('size', () => {
      it('default size prop is small', () => {
        expect(
          shallowWithTheme(<GlobalItemBase />)
            .find(GlobalItemInner)
            .props().size,
        ).toBe('small');
      });

      ['small', 'medium', 'large'].forEach(supportedSize => {
        it(`${supportedSize} size prop renders small global item`, () => {
          const wrapper = shallowWithTheme(
            <GlobalItemBase size={supportedSize} />,
          );
          expect(wrapper.find(GlobalItemInner).prop('size')).toBe(
            supportedSize,
          );
        });
      });
    });

    describe('linkComponent', () => {
      it('defaults to the internal DefaultLinkComponent', () => {
        const item = mountWithRootTheme(
          <GlobalItemBase href="http://google.com" />,
        );
        expect(item.find(DefaultLinkComponent).prop('href')).toBe(
          'http://google.com',
        );
      });

      it('can be used to render an arbitrary link', () => {
        const item = mountWithRootTheme(
          <GlobalItemBase
            href="http://google.com"
            linkComponent={({ href, children }) => (
              <a href={href} data-foo="foo">
                {children}
              </a>
            )}
            role="button"
            aria-haspopup="true"
          />,
        );
        expect(item.find('[data-foo]').length).toBe(1);
        expect(item.find('linkComponent').prop('href')).toBe(
          'http://google.com',
        );
        expect(item.find('linkComponent').prop('role')).toBe('button');
        expect(item.find('linkComponent').prop('aria-haspopup')).toBe('true');
      });
    });

    describe('aria-haspopup', () => {
      it('is not applied by default', () => {
        const wrapper = mountWithRootTheme(<GlobalItemBase />);
        expect(wrapper.find(GlobalItemInner).prop('aria-haspopup')).toBe(
          undefined,
        );
      });
      it('is applied by to GlobalItemInner if no href prop supplied', () => {
        const wrapper = mountWithRootTheme(
          <GlobalItemBase aria-haspopup="true" />,
        );
        expect(wrapper.find(GlobalItemInner).prop('aria-haspopup')).toBe(
          'true',
        );
      });
      it('is applied by to DefaultLinkComponent if href prop supplied', () => {
        const wrapper = mountWithRootTheme(
          <GlobalItemBase href="/" aria-haspopup="true" />,
        );
        expect(wrapper.find(DefaultLinkComponent).prop('aria-haspopup')).toBe(
          'true',
        );
      });
    });

    describe('role', () => {
      it('is not applied by default', () => {
        const wrapper = mountWithRootTheme(<GlobalItemBase />);
        expect(wrapper.find(GlobalItemInner).prop('role')).toBe(undefined);
      });
      it('is applied by to GlobalItemInner if no href prop supplied', () => {
        // eslint-disable-next-line jsx-a11y/aria-role
        const wrapper = mountWithRootTheme(<GlobalItemBase role="button" />);
        expect(wrapper.find(GlobalItemInner).prop('role')).toBe('button');
      });
      it('is applied by to DefaultLinkComponent if href prop supplied', () => {
        // eslint-disable-next-line jsx-a11y/aria-role
        const wrapper = mountWithRootTheme(
          <GlobalItemBase href="/" role="button" />,
        );
        expect(wrapper.find(DefaultLinkComponent).prop('role')).toBe('button');
      });
    });

    describe('onClick', () => {
      it('is called when GlobalItemInner is clicked if no href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(<GlobalItemBase onClick={spy} />);
        wrapper.find(GlobalItemInner).simulate('click');
        expect(spy).toHaveBeenCalled();
      });
      it('is called when DefaultLinkComponent is clicked if href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(
          <GlobalItemBase href="/" onClick={spy} />,
        );
        wrapper.find(DefaultLinkComponent).simulate('click');
        expect(spy).toHaveBeenCalled();
      });
      it('is called when Enter pressed on GlobalItemInner if no href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(<GlobalItemBase onClick={spy} />);
        wrapper.find(GlobalItemInner).simulate('keydown', { key: 'Enter' });
        expect(spy).toHaveBeenCalled();
      });
      it('is called when Enter pressed on DefaultLinkComponent if href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(
          <GlobalItemBase href="/" onClick={spy} />,
        );
        wrapper
          .find(DefaultLinkComponent)
          .simulate('keydown', { key: 'Enter' });
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('onMouseDown', () => {
      it('is called when GlobalItemInner is clicked if no href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(
          <GlobalItemBase onMouseDown={spy} />,
        );
        wrapper.find(GlobalItemInner).simulate('mousedown');
        expect(spy).toHaveBeenCalled();
      });
      it('is called when DefaultLinkComponent is clicked if href prop supplied', () => {
        const spy = jest.fn();
        const wrapper = mountWithRootTheme(
          <GlobalItemBase href="/" onMouseDown={spy} />,
        );
        wrapper.find(DefaultLinkComponent).simulate('mousedown');
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('isSelected', () => {
      it('is passed down to the styled component', () => {
        const styledComponent = shallowWithTheme(
          <GlobalItemBase isSelected />,
        ).find(GlobalItemInner);
        expect(styledComponent.props().isSelected).toBe(true);
      });
    });
  });
});

describe('<GlobalItem />', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should be wrapped with withGlobalItemAnalytics HOC', () => {
    const mockwithGlobalItemAnalytics = jest.fn();
    jest.doMock('../../utils/analytics', () => ({
      withGlobalItemAnalytics: mockwithGlobalItemAnalytics,
    }));

    expect(mockwithGlobalItemAnalytics).not.toHaveBeenCalled();

    const {
      GlobalItemBase: RequiredGlobalItemBase,
    } = require('../../components/js/GlobalItem');

    expect(mockwithGlobalItemAnalytics).toHaveBeenCalledTimes(1);
    expect(mockwithGlobalItemAnalytics).toHaveBeenCalledWith(
      RequiredGlobalItemBase,
    );
  });
});
