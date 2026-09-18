import React from 'react';

import { useIntl } from 'react-intl';

import { Box } from '@atlaskit/primitives/compiled';

import { EditorThemeContext } from '../../hooks/use-editor-theme';
import { useEditorTheme } from '../../hooks/use-editor-theme/useEditorTheme';
import { useEditorThemeContext } from '../../hooks/use-editor-theme/useEditorThemeContext';
import { splitTextByNewLine } from '../../utils/split-text-by-new-line';
import { ReadOnlyControlsContent } from '../jql-editor-controls-content/read-only-controls-content';
import { messages } from '../messages';
import {
	EditorControls,
	EditorFooter,
	EditorMain,
	LineNumberToolbar,
	ReadOnlyEditorView,
	ReadOnlyEditorViewContainer,
} from './styled';

type ReadOnlyProps = {
	query: string;
};

/**
 * A read only version of the JQL Editor which mimics the layout of the complete component, suitable as an intermediary
 * state when rendering the editor asynchronously.
 * In order to minimise bundle size impact on consumers, it is critical that this component (and any child component)
 * only imports the bare minimum dependencies required to replicate the editor layout.
 */
const JQLEditorReadOnlyWithoutTheme = ({ query }: ReadOnlyProps) => {
	const { defaultMaxRows, expandedRows, isSearch, isCompact, defaultRows } =
		useEditorThemeContext();

	const blocks = splitTextByNewLine(query);
	const lineNumbersVisible = blocks.length > 1;

	const { formatMessage } = useIntl();

	return (
		<EditorMain>
			<ReadOnlyEditorViewContainer>
				<LineNumberToolbar lineNumbersVisible={lineNumbersVisible} />
				<ReadOnlyEditorView
					data-testid="jql-editor-read-only"
					role="combobox"
					aria-readonly
					defaultMaxRows={defaultMaxRows}
					expandedRows={expandedRows}
					lineNumbersVisible={lineNumbersVisible}
					isCompact={isCompact}
					// aria-expanded and aria-controls here are placeholders only. This is to avoid a11y violations.
					// This component JQLEditorReadOnlyWithoutTheme is only a loading state
					// Therefore the autocomplete combobox is never shown to the users
					aria-expanded={false}
					aria-controls="dummy-jql-editor-auto-complete-id"
					aria-label={formatMessage(messages.inputLabel)}
					defaultRows={defaultRows}
				>
					{blocks.map((block, index) => (
						<Box as="p" key={index}>
							{block}
						</Box>
					))}
				</ReadOnlyEditorView>
				<EditorControls isSearch={isSearch} isCompact={isCompact}>
					<ReadOnlyControlsContent />
				</EditorControls>
			</ReadOnlyEditorViewContainer>
			<EditorFooter />
		</EditorMain>
	);
};

export const JQLEditorReadOnly = ({
	isSearch,
	isCompact,
	defaultRows,
	...props
}: ReadOnlyProps & {
	defaultRows?: number;
	isCompact?: boolean;
	isSearch?: boolean;
}): React.JSX.Element => {
	const editorTheme = useEditorTheme({ isSearch, isCompact, defaultRows });

	return (
		<EditorThemeContext.Provider value={editorTheme}>
			<JQLEditorReadOnlyWithoutTheme {...props} />
		</EditorThemeContext.Provider>
	);
};
