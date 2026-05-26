import React from 'react';

import type { Valign } from '@atlaskit/adf-schema/layout-column';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { LayoutSectionCompiled } from './layoutColumn-compiled';
import { LayoutSectionEmotion } from './layoutColumn-emotion';

const LayoutSectionMigration = componentWithCondition(
	() => expValEquals('platform_editor_renderer_static_css', 'isEnabled', true),
	LayoutSectionCompiled,
	LayoutSectionEmotion,
);

/**
 * Render a layout column in renderer.
 */
export default function LayoutSection(
	props: React.PropsWithChildren<{ valign?: Valign; width?: number }>,
): React.JSX.Element {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <LayoutSectionMigration {...props} />;
}
