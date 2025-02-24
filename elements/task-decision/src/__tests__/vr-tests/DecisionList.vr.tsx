import { snapshot } from '@af/visual-regression';
import { DecisionListEditor, DecisionListSingleItemEditor } from './DecisionList.fixtures';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(DecisionListEditor, {
	featureFlags,
});

snapshot(DecisionListSingleItemEditor, {
	featureFlags,
});
