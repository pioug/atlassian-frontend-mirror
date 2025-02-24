import { snapshot } from '@af/visual-regression';
import { DecisionItemEditor, DecisionItemEditorWithPlaceholder } from './DecisionItem.fixtures';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(DecisionItemEditor, {
	featureFlags,
});

snapshot(DecisionItemEditorWithPlaceholder, {
	featureFlags,
});
