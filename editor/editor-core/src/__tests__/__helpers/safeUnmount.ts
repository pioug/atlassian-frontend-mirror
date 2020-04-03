import { ReactWrapper } from 'enzyme';

export default function safeUnmount<P>(wrapper?: ReactWrapper<P>) {
  if (wrapper && typeof wrapper.unmount === 'function') {
    wrapper.unmount();
  }
}
