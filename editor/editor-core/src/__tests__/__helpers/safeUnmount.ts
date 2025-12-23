import type { ReactWrapper } from 'enzyme';

export default function safeUnmount<P>(wrapper?: ReactWrapper<P>): void {
	if (wrapper && typeof wrapper.unmount === 'function') {
		wrapper.unmount();
	}
}
