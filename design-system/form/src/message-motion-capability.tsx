import { isValidElement, type ReactNode } from 'react';

const messageMotionCapability = Symbol.for('@atlaskit/form/message-motion-capable');

const messageMotion = {
	mark(component: object): void {
		Object.defineProperty(component, messageMotionCapability, { value: true });
	},
	isCapable(child: ReactNode): boolean {
		if (!isValidElement(child)) {
			return false;
		}

		const childType = child.type;
		return (
			(typeof childType === 'function' || (typeof childType === 'object' && childType !== null)) &&
			Reflect.get(childType, messageMotionCapability) === true
		);
	},
};

export default messageMotion;
