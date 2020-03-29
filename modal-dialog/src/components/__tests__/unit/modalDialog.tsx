import React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';

import ModalDialog, { ModalTransition } from '../../..';
import Positioner from '../../Positioner';
import Content from '../../Content';
import Header from '../../Header';
import Footer from '../../Footer';
import { dialogHeight, dialogWidth, Dialog } from '../../../styled/Modal';

jest.mock('raf-schd', () => (fn: Function) => fn);

// dialogs require an onClose function
const noop = () => {};

const MyContent = () => <div>Hello</div>;

test('should render a modal dialog with content', () => {
  const wrapper = mount(
    <ModalTransition>
      <ModalDialog onClose={noop}>
        <MyContent />
      </ModalDialog>
    </ModalTransition>,
  );
  expect(wrapper.find(Content)).toHaveLength(1);
});

describe('modal-dialog', () => {
  describe('props', () => {
    describe('height', () => {
      it('should be passed to Dialog', () => {
        const wrapper = mount(<ModalDialog onClose={noop} height="42%" />);
        const dialogHeightProp = wrapper.find(Dialog).prop('heightValue');
        expect(dialogHeightProp).toBe('42%');
      });

      it('should return px if number', () => {
        expect(dialogHeight({ heightValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogHeight({ heightValue: '42%' })).toBe('42%');
        expect(dialogHeight({ heightValue: '42em' })).toBe('42em');
        expect(dialogHeight({ heightValue: 'initial' })).toBe('initial');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogHeight({})).toBe('auto');
      });
    });
    describe('width', () => {
      const TSHIRT_SIZES = ['small', 'medium', 'large', 'x-large'];

      it('should return px if number', () => {
        expect(dialogWidth({ widthValue: 42 })).toBe('42px');
      });

      it('should return raw value if string', () => {
        expect(dialogWidth({ widthValue: '42%' })).toBe('42%');
        expect(dialogWidth({ widthValue: '42em' })).toBe('42em');
        expect(dialogWidth({ widthValue: 'auto' })).toBe('auto');
      });

      it('should return "auto" if not supplied', () => {
        expect(dialogWidth({})).toBe('auto');
      });

      TSHIRT_SIZES.forEach(width => {
        it(`width = "${width}" is applied uniquely`, () => {
          const wrapper = mount(<ModalDialog width={width} onClose={noop} />);
          const widthProp = wrapper.find('Positioner').prop('widthName');
          expect(widthProp).toEqual(width);
        });
      });
    });

    describe('container', () => {
      it('should render element set via components prop', () => {
        const wrapper = mount(
          <ModalDialog components={{ Container: 'form' }} onClose={noop} />,
        );

        expect(wrapper.find('form')).toHaveLength(1);
      });
    });

    describe('header', () => {
      it('should render when set via components prop', () => {
        const node = <span>My header</span>;
        const wrapper = mount(
          <ModalDialog components={{ Header: () => node }} onClose={noop} />,
        );
        expect(wrapper.contains(node)).toBe(true);
      });
      it('should render when set via (deprecated) header prop', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const node = <span>My header</span>;
        const wrapper = mount(
          <ModalDialog header={() => node} onClose={noop} />,
        );
        expect(wrapper.contains(node)).toBe(true);
        expect(warnSpy).toHaveBeenCalled();
      });
      it('should prefer the components prop over header prop ', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const node = <span>My header</span>;
        const nodeDeprecated = <span>My deprecated header</span>;
        const wrapper = mount(
          <ModalDialog
            header={() => nodeDeprecated}
            components={{ Header: () => node }}
            onClose={noop}
          />,
        );

        expect(wrapper.contains(node)).toBe(true);
        expect(wrapper.contains(nodeDeprecated)).toBe(false);
        expect(warnSpy).toHaveBeenCalled();
      });
    });

    describe('footer', () => {
      it('should render when set via components prop', () => {
        const node = <span>My footer</span>;
        const wrapper = mount(
          <ModalDialog components={{ Footer: () => node }} onClose={noop} />,
        );

        expect(wrapper.contains(node)).toBe(true);
      });
      it('should render when set via (deprecated) footer prop', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const node = <span>My footer</span>;
        const wrapper = mount(
          <ModalDialog footer={() => node} onClose={noop} />,
        );

        expect(wrapper.contains(node)).toBe(true);
        expect(warnSpy).toHaveBeenCalled();
      });
      it('should prefer the components prop over footer prop ', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const node = <span>My footer</span>;
        const nodeDeprecated = <span>My deprecated footer</span>;
        const wrapper = mount(
          <ModalDialog
            footer={() => nodeDeprecated}
            components={{ Footer: () => node }}
            onClose={noop}
          />,
        );

        expect(wrapper.contains(node)).toBe(true);
        expect(wrapper.contains(nodeDeprecated)).toBe(false);
        expect(warnSpy).toHaveBeenCalled();
      });
    });

    describe('body', () => {
      it('should render when set via components prop', () => {
        const Node = React.forwardRef((_, ref: any) => {
          return <span ref={ref}>My body</span>;
        });
        const wrapper = mount(
          <ModalDialog components={{ Body: Node }} onClose={noop} />,
        );
        const TestSpan = <span>My body</span>;
        expect(wrapper.contains(TestSpan)).toBe(true);
      });

      it('should render when set via (deprecated) body prop', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});

        const node = React.forwardRef((_, ref: any) => (
          <span ref={ref}>My body</span>
        ));
        const wrapper = mount(<ModalDialog body={node} onClose={noop} />);

        const TestSpan = <span>My body</span>;
        expect(wrapper.contains(TestSpan)).toBe(true);
        expect(warnSpy).toHaveBeenCalled();
      });

      it('should prefer the components prop over body prop ', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const node = React.forwardRef((_, ref: any) => {
          return <span ref={ref}>My body</span>;
        });
        const nodeDeprecated = <span>My deprecated body</span>;
        const wrapper = mount(
          <ModalDialog
            body={() => nodeDeprecated}
            components={{ Body: node }}
            onClose={noop}
          />,
        );

        const TestSpan = <span>My body</span>;
        expect(wrapper.contains(TestSpan)).toBe(true);
        expect(wrapper.contains(nodeDeprecated)).toBe(false);
        expect(warnSpy).toHaveBeenCalled();
      });

      it('should warn the user about using forwardRef if not present on a custom body', () => {
        const warnSpy = jest
          .spyOn(console, 'warn')
          .mockImplementation(() => {});
        const errorSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(() => {});

        const node = (props: any) => {
          return (
            <>
              <span>My body</span>
              {props.children}
            </>
          );
        };

        mount(<ModalDialog components={{ Body: node }} />);

        expect(errorSpy).toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringMatching(/forwardRef/),
        );
      });
    });

    describe('children', () => {
      it('should render when set', () => {
        const node = (
          <form>
            This is <strong>my</strong> form
          </form>
        );
        const wrapper = mount(<ModalDialog onClose={noop}>{node}</ModalDialog>);

        expect(wrapper.contains(node)).toBe(true);
      });
    });

    describe('onClose', () => {
      it('should trigger when blanket clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(<ModalDialog onClose={spy} />);

        const blanket = wrapper.find(Blanket);

        blanket.simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should not trigger when blanket content clicked', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        wrapper.find(MyContent).simulate('click');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should close the modal when Escape is pressed', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        // The regular escape event
        const escapeKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
        });
        document.dispatchEvent(escapeKeyDownEvent);
        // Make TS happy about using Wrapper
        wrapper.find(MyContent);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should close the modal when Escape is pressed in IE11', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <ModalDialog onClose={spy}>
            <MyContent />
          </ModalDialog>,
        );

        // The IE11 escape event
        const escKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', {
          key: 'Esc',
        });
        document.dispatchEvent(escKeyDownEvent);
        // Make TS happy about using Wrapper
        wrapper.find(MyContent);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('scrolling header/footer keylines', () => {
    it('should enable header keyline only when header provided', () => {
      const CustomBody = React.forwardRef((_, ref: any) => {
        ref({
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          clientHeight: 200,
          scrollHeight: 100,
          scrollTop: 10,
        });
        return <div />;
      });

      const wrapper = mount(<ModalDialog onClose={noop} body={CustomBody} />);

      const header = wrapper.find(Header);
      expect(header.prop('showKeyline')).toEqual(true);
    });

    it('should enable footer keyline only when footer provided', () => {
      const CustomBody = React.forwardRef((_, ref: any) => {
        ref({
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          clientHeight: 100,
          scrollHeight: 200,
          scrollTop: 0,
        });

        return <div />;
      });

      const wrapper = mount(<ModalDialog onClose={noop} body={CustomBody} />);

      const header = wrapper.find(Footer);
      expect(header.prop('showKeyline')).toEqual(true);
    });
  });

  describe('chromeless', () => {
    it('header should not render if dialog is chromeless', () => {
      const HeaderSpan = <span>My header</span>;
      const MyHeader = () => HeaderSpan;
      const wrapper = mount(
        <ModalDialog
          isChromeless
          components={{ Header: MyHeader }}
          onClose={noop}
        />,
      );

      expect(wrapper.contains(HeaderSpan)).toBe(false);
    });

    it('footer should not render if dialog is chromeless', () => {
      const FooterSpan = <span>My footer</span>;
      const MyFooter = () => FooterSpan;
      const wrapper = mount(
        <ModalDialog
          isChromeless
          components={{ Footer: MyFooter }}
          onClose={noop}
        />,
      );

      expect(wrapper.contains(FooterSpan)).toBe(false);
    });
  });
});

test('multiple modals should stack on one another', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog>middle</ModalDialog>
      <ModalDialog>front</ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([2, 1, 0]);
});

test('nested modals should stack on one another', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog>
        middle
        <ModalDialog>front</ModalDialog>
      </ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([2, 1, 0]);
});

test('multiple modals update stack on unmount', () => {
  class Wrapper extends React.Component<{}, { open: boolean }> {
    state = { open: true };

    render() {
      return (
        <div>
          <ModalDialog />
          <ModalDialog />
          {this.state.open && (
            <ModalDialog>
              <button onClick={() => this.setState({ open: false })}>
                close
              </button>
            </ModalDialog>
          )}
        </div>
      );
    }
  }
  const wrapper = mount(<Wrapper />);
  wrapper.find('button').simulate('click');
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([1, 0]);
});

test('can manually override modals stack', () => {
  const wrapper = mount(
    <div>
      <ModalDialog>back</ModalDialog>
      <ModalDialog stackIndex={1}>front</ModalDialog>
    </div>,
  );
  const indexes = wrapper
    .find(Content)
    .map(content => content.prop('stackIndex'));
  expect(indexes).toEqual([1, 1]);
});

// beautiful-dnd will miscalculate positions if the container has a transform applied to it.
test('no transform is applied to content', () => {
  jest.useFakeTimers();
  const wrapper = mount(<ModalDialog />);
  jest.runAllTimers();
  // update enzyme's view of component tree after animations have finished
  wrapper.update();
  const style: React.CSSProperties = wrapper.find(Positioner).prop('style');
  expect(style.transform).toBeNull();
});

test('should throw deprecation error when using a function for auto focus', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() =>
    mount(<ModalDialog autoFocus={() => document.createElement('div')} />),
  ).toThrowError();
  expect(spy).toHaveBeenCalled();
  // needed otherwise global no console check will fail
  jest.resetAllMocks();
});

describe('ModalDialog', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(<ModalDialog onClose={noop} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
