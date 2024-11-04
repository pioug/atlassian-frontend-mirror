import { EventEmitter } from 'events';

import { useCallback, useEffect, useState } from 'react';

import { isPreRelease2 } from './advanced-layouts-flags';

export class ActiveAnchorTracker {
	emitter: EventEmitter;
	lastActiveAnchor: string = '';

	constructor() {
		this.emitter = new EventEmitter();
	}

	public subscribe(anchorName: string, callback: (isActive: boolean) => void) {
		this.emitter.on(anchorName, callback);
	}

	public unsubscribe(anchorName: string, callback: (isActive: boolean) => void) {
		this.emitter.removeListener(anchorName, callback);
	}

	public emit(anchorName: string) {
		if (this.lastActiveAnchor !== anchorName) {
			this.emitter.emit(this.lastActiveAnchor, false);
			this.emitter.emit(anchorName, true);
			this.lastActiveAnchor = anchorName;
		}
	}

	public reset() {
		this.emitter.removeAllListeners();
	}
}

export const defaultActiveAnchorTracker: ActiveAnchorTracker = new ActiveAnchorTracker();

export const useActiveAnchorTracker = (
	anchorName: string,
	activeAnchorTracker: ActiveAnchorTracker = defaultActiveAnchorTracker,
) => {
	const [isActive, setIsActive] = useState(false);

	const onActive = (eventIsActive: boolean) => {
		setIsActive(eventIsActive);
	};

	useEffect(() => {
		if (activeAnchorTracker && anchorName && isPreRelease2()) {
			activeAnchorTracker.subscribe(anchorName, onActive);

			const unsubscribe = () => {
				activeAnchorTracker.unsubscribe(anchorName, onActive);
			};

			return unsubscribe;
		}
	}, [activeAnchorTracker, anchorName]);

	const setActive = useCallback(() => {
		activeAnchorTracker.emit(anchorName);
	}, [activeAnchorTracker, anchorName]);

	return [isActive, setActive] as [boolean, () => void];
};
