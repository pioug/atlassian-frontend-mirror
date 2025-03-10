import { EventEmitter } from 'events';

import { useCallback, useEffect, useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export class ActiveAnchorTracker {
	emitter: EventEmitter | null;
	lastActiveAnchor: string = '';

	constructor() {
		this.emitter = new EventEmitter();
	}

	public getActiveAnchor() {
		return this.lastActiveAnchor;
	}

	public subscribe(anchorName: string, callback: (isActive: boolean) => void) {
		if (this.emitter) {
			this.emitter.on(anchorName, callback);
		}
	}

	public unsubscribe(anchorName: string, callback: (isActive: boolean) => void) {
		if (this.emitter) {
			this.emitter.removeListener(anchorName, callback);
		}
	}

	public emit(anchorName: string) {
		if (this.lastActiveAnchor !== anchorName && this.emitter) {
			this.emitter.emit(this.lastActiveAnchor, false);
			this.emitter.emit(anchorName, true);
			this.lastActiveAnchor = anchorName;
		}
	}

	public reset() {
		if (this.emitter) {
			// To prevent any potential memory leaks,
			// we set the event emitter to null and then create a new event emitter.
			this.emitter.removeAllListeners();
			this.emitter = null;
			this.emitter = new EventEmitter();
		}
	}
}

// TODO: ED-26959 - We should use a scoped ActiveAnchorTracker rather than the global static object.
// Move this into the plugin scope once the newApply functions becomes default apply.
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
		if (activeAnchorTracker && anchorName && editorExperiment('advanced_layouts', true)) {
			activeAnchorTracker.subscribe(anchorName, onActive);

			if (
				activeAnchorTracker.getActiveAnchor() === anchorName &&
				fg('platform_editor_advanced_layouts_post_fix_patch_3')
			) {
				setIsActive(true);
			}

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
