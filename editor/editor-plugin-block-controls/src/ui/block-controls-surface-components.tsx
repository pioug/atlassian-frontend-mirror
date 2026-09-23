import React, { createContext, useContext, useMemo } from 'react';

import {
	BLOCK_CONTROLS_LEFT_GROUP,
	BLOCK_CONTROLS_LEFT_SECTION,
	BLOCK_CONTROLS_LEFT_SURFACE,
	BLOCK_CONTROLS_RIGHT_GROUP,
	BLOCK_CONTROLS_RIGHT_SECTION,
	BLOCK_CONTROLS_RIGHT_SURFACE,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import {
	getComponentIdentity,
	resolveSurface,
} from '@atlaskit/editor-ui-control-model/surface-renderer';
import type {
	CommonComponentProps,
	GroupType,
	RegisterComponent,
	RegisterGroup,
	SectionType,
	SurfaceContext,
	ToolbarType,
} from '@atlaskit/editor-ui-control-model/types';

import { partitionComponentsByPersistence } from './utils/partition-components-by-persistence';
import { VisibilityWrapper } from './visibility-container';

type BlockControlsVisibility = {
	shouldHideHoverControls: boolean;
	useCssStyles: boolean;
};

const BlockControlsVisibilityContext = createContext<BlockControlsVisibility>({
	shouldHideHoverControls: false,
	useCssStyles: false,
});

const BlockControlItem = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<div data-editor-block-control-item>{children}</div>
);

const HoverBlockControlItem = ({ children }: CommonComponentProps): React.JSX.Element => {
	const { shouldHideHoverControls, useCssStyles } = useContext(BlockControlsVisibilityContext);

	return (
		<BlockControlItem>
			<VisibilityWrapper shouldHide={shouldHideHoverControls} useCssStyles={useCssStyles}>
				{children}
			</VisibilityWrapper>
		</BlockControlItem>
	);
};

const PersistentBlockControlItem = ({ children }: CommonComponentProps): React.JSX.Element => {
	const { useCssStyles } = useContext(BlockControlsVisibilityContext);

	return (
		<BlockControlItem>
			<VisibilityWrapper shouldHide={false} useCssStyles={useCssStyles}>
				{children}
			</VisibilityWrapper>
		</BlockControlItem>
	);
};

type BlockControlsVisibilityProviderProps = BlockControlsVisibility & {
	children: React.ReactNode;
};

export const BlockControlsVisibilityProvider = ({
	children,
	shouldHideHoverControls,
	useCssStyles,
}: BlockControlsVisibilityProviderProps): React.JSX.Element => {
	const value = useMemo(
		() => ({ shouldHideHoverControls, useCssStyles }),
		[shouldHideHoverControls, useCssStyles],
	);

	return (
		<BlockControlsVisibilityContext.Provider value={value}>
			{children}
		</BlockControlsVisibilityContext.Provider>
	);
};

const withoutVisibilityPredicate = (component: RegisterComponent): RegisterComponent => {
	const { isHidden: _isHidden, ...visibleComponent } = component;
	return visibleComponent as RegisterComponent;
};

/**
 * Replaces the shared surface group with one stable wrapper group per visible control. The wrappers
 * inherit each control's rank, so SurfaceRenderer keeps the registry order without re-evaluating
 * the controls' visibility predicates.
 */
const getBlockControlsSurfaceComponents = (
	components: RegisterComponent[],
	{
		group,
		section,
		surface,
	}: {
		group: GroupType;
		section: SectionType;
		surface: ToolbarType;
	},
	surfaceContext: SurfaceContext,
): RegisterComponent[] | undefined => {
	const resolvedSurface = resolveSurface(components, surface);
	const groupIdentity = getComponentIdentity(group);
	const controls = resolvedSurface.childrenMap.get(groupIdentity) ?? [];
	const visibleControls = controls.filter(
		(control) => !(control.isHidden?.({ surfaceContext }) ?? false),
	);
	if (!resolvedSurface.root || visibleControls.length === 0) {
		return undefined;
	}

	const controlIdentities = new Set(controls.map(getComponentIdentity));
	const visibleControlIdentities = new Set(visibleControls.map(getComponentIdentity));
	const { persistentComponents } = partitionComponentsByPersistence(
		resolvedSurface.components.filter((component) => {
			const identity = getComponentIdentity(component);
			return !controlIdentities.has(identity) || visibleControlIdentities.has(identity);
		}),
		surface,
		surfaceContext,
	);
	const persistentIdentities = new Set(persistentComponents.map(getComponentIdentity));
	const structuralComponents = resolvedSurface.components
		.filter((component) => {
			const identity = getComponentIdentity(component);
			return identity !== groupIdentity && !controlIdentities.has(identity);
		})
		.map(withoutVisibilityPredicate);

	const wrappedControls = visibleControls.flatMap((control): RegisterComponent[] => {
		const identity = getComponentIdentity(control);
		const rank =
			control.parents?.find((parent) => getComponentIdentity(parent) === groupIdentity)?.rank ?? 0;
		const wrapper: RegisterGroup = {
			component: persistentIdentities.has(identity)
				? PersistentBlockControlItem
				: HoverBlockControlItem,
			key: `block-control-item:${identity}`,
			parents: [{ ...section, rank }],
			type: 'group',
		};
		const visibleControl = {
			...withoutVisibilityPredicate(control),
			parents: [{ key: wrapper.key, rank: 0, type: wrapper.type }],
		} as RegisterComponent;

		return [wrapper, visibleControl];
	});

	return [...structuralComponents, ...wrappedControls];
};

export const getBlockControlsLeftSurfaceComponents = (
	components: RegisterComponent[],
	surfaceContext: SurfaceContext,
): RegisterComponent[] | undefined =>
	getBlockControlsSurfaceComponents(
		components,
		{
			group: BLOCK_CONTROLS_LEFT_GROUP,
			section: BLOCK_CONTROLS_LEFT_SECTION,
			surface: BLOCK_CONTROLS_LEFT_SURFACE,
		},
		surfaceContext,
	);

export const getBlockControlsRightSurfaceComponents = (
	components: RegisterComponent[],
	surfaceContext: SurfaceContext,
): RegisterComponent[] | undefined =>
	getBlockControlsSurfaceComponents(
		components,
		{
			group: BLOCK_CONTROLS_RIGHT_GROUP,
			section: BLOCK_CONTROLS_RIGHT_SECTION,
			surface: BLOCK_CONTROLS_RIGHT_SURFACE,
		},
		surfaceContext,
	);
