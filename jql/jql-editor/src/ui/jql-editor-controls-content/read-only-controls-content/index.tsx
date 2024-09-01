import React from 'react';

import noop from 'lodash/noop';

import { useEditorThemeContext } from '../../../hooks/use-editor-theme';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseExpandToggle } from '../base-expand-toggle';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSearch } from '../base-search';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { BaseSyntaxHelp } from '../base-syntax-help';

export const ReadOnlyControlsContent = () => {
	const { isSearch } = useEditorThemeContext();
	return (
		<>
			<BaseExpandToggle
				// The label here is for avoiding a11y violations only
				// This component ReadOnlyControlsContent is only used as a fallback for a loading state
				label={'Editor'}
				editorId={''}
				expanded={false}
				onClick={noop}
				isDisabled={true}
			/>
			<BaseSyntaxHelp label={''} onClick={noop} isDisabled={true} />
			{isSearch && (
				<BaseSearch
					// The label here is for avoiding a11y violations only
					// This component ReadOnlyControlsContent is only used as a fallback for a loading state
					label={'Search'}
					onSearch={noop}
					isDisabled={true}
				/>
			)}
		</>
	);
};
