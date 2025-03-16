import React from 'react';

import type { MultiBodiedExtensionActions } from '@atlaskit/editor-common/extensions';

type ActionsProps = {
	updateActiveChild: (index: number) => void;
	children: React.ReactNode;
	// Allows MBE macro to render bodies; see RFC: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4843571091/Editor+RFC+064+MultiBodiedExtension+Extensibility
	allowBodiedOverride: boolean;
	childrenContainer: React.ReactNode;
};

export const useMultiBodiedExtensionActions = ({
	updateActiveChild,
	children,
	allowBodiedOverride,
	childrenContainer,
}: ActionsProps): MultiBodiedExtensionActions => {
	return React.useMemo(() => {
		return {
			changeActive(index: number) {
				if (!Number.isInteger(index)) {
					return false;
				}

				updateActiveChild(index);
				return true;
			},
			addChild() {
				return false;
			},
			getChildrenCount(): number {
				return children && Array.isArray(children) ? children.length : 0;
			},
			removeChild(_index: number) {
				return false;
			},
			updateParameters(_parameters): boolean {
				return false;
			},
			getChildren(): never[] {
				return [];
			},
			getChildrenContainer() {
				return allowBodiedOverride ? childrenContainer : null;
			},
		};
	}, [updateActiveChild, children, allowBodiedOverride, childrenContainer]);
};
