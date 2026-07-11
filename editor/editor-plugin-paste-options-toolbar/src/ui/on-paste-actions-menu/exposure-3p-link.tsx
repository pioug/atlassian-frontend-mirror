// Remove this file when experiment `confluence_editor_paste_3p_link_actions_menu` is cleaned up.
import type { Slice } from '@atlaskit/editor-prosemirror/model';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { isNotSingleLink } from '../utils/paste-menu-rules/isNotSingleLink';

// Manual exposure for `confluence_editor_paste_3p_link_actions_menu`. The menu only
// appears for single-link pastes, so fire the exposure in that case alone to avoid
// exposing users who would never see the experiment.
export const firePaste3pLinkActionsMenuExperimentExposure = (pastedSlice?: Slice): void => {
	if (isNotSingleLink(pastedSlice)) {
		return;
	}

	expVal('confluence_editor_paste_3p_link_actions_menu', 'isEnabled', false);
};
