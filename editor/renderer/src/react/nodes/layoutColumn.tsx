import React from 'react';

import type { Valign } from '@atlaskit/adf-schema/valign';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react/component-with-condition';

import { LayoutSectionCompiled } from './layoutColumn-compiled';
import { LayoutSectionEmotion } from './layoutColumn-emotion';

const LayoutSectionMigration = componentWithCondition(
	() => isExperimentEnabled('platform_editor_renderer_static_css'),
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
