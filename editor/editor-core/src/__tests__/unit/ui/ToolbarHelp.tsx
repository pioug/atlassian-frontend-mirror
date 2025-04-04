import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import EditorContext from '../../../ui/EditorContext';
import ToolbarHelp from '../../../ui/ToolbarHelp';
import { mountWithIntl } from '../../__helpers/enzyme';

describe('@atlaskit/editor-core/ui/ToolbarHelp', () => {
	const mountWithEditorContext = (props = {}) => {
		return mountWithIntl(
			<EditorContext>
				<ToolbarHelp {...props} editorApi={undefined} />
			</EditorContext>,
		);
	};

	it('should use default values if no props passed in', () => {
		const toolbarHelpElem = mountWithEditorContext();

		const tooltip = toolbarHelpElem.find(Tooltip);
		expect(tooltip).toHaveLength(1);
		expect(tooltip.prop('position')).toEqual('left');
		expect(tooltip.html()).toContain('Open help dialog');
		toolbarHelpElem.unmount();
	});

	it('should use the title passed in from props', () => {
		const toolbarHelpElem = mountWithEditorContext({ title: 'Custom title' });

		expect(toolbarHelpElem.find(Tooltip).html()).toContain('Custom title');
		toolbarHelpElem.unmount();
	});

	it('should use the titlePosition passed in from props', () => {
		const toolbarHelpElem = mountWithEditorContext({ titlePosition: 'top' });

		expect(toolbarHelpElem.find(Tooltip).prop('position')).toEqual('top');
		toolbarHelpElem.unmount();
	});
});
