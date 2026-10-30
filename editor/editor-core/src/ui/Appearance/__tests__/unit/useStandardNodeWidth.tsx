import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Chromeless from '../../Chromeless';
import { CommentEditorWithIntl as Comment } from '../../Comment/Comment';

jest.mock('../../../EditorContentContainer/EditorContentContainer', () => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const ReactActual = require('react');
	return {
		__esModule: true,
		default: ReactActual.forwardRef(
			(
				{
					children,
					useStandardNodeWidth,
				}: { children?: React.ReactNode; useStandardNodeWidth?: boolean },
				ref: React.Ref<HTMLDivElement>,
			) => (
				<div
					ref={ref}
					data-testid="editor-content-container"
					data-use-standard-node-width={String(Boolean(useStandardNodeWidth))}
				>
					{children}
				</div>
			),
		),
	};
});

const GATE = 'platform_editor_expand_standard_width_fix';
const WORK_ITEM_MODERNIZATION = 'work_item_modernization';
const COHORT_GATE = 'wiv_modernization_cohort';

const blockMenuAPI = (useStandardNodeWidth: boolean) =>
	({
		blockMenu: { sharedState: { currentState: () => ({ useStandardNodeWidth }) } },
	}) as any;

describe('useStandardNodeWidth', () => {
	const createEditor = createEditorFactory();
	const editorView = () => createEditor({ doc: doc(p('Hello')) }).editorView;

	const renderComment = (useStandardNodeWidth: boolean) =>
		renderWithIntl(
			<Comment
				editorAPI={blockMenuAPI(useStandardNodeWidth)}
				editorView={editorView()}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		).getByTestId('editor-content-container');

	const renderChromeless = (useStandardNodeWidth: boolean) =>
		renderWithIntl(
			<Chromeless
				editorAPI={blockMenuAPI(useStandardNodeWidth)}
				editorView={editorView()}
				providerFactory={{} as any}
				editorDOMElement={<div />}
				featureFlags={{}}
			/>,
		).getByTestId('editor-content-container');

	describe('comment appearance', () => {
		it('uses the block menu value without the editor controls experiment when the gate is on', () => {
			passGate(GATE);
			setupEditorExperiments('test', { platform_editor_controls: 'control' });

			expect(renderComment(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});

		it('stays off when the block menu value is false and the gate is on', () => {
			passGate(GATE);
			setupEditorExperiments('test', { platform_editor_controls: 'variant1' });

			expect(renderComment(false)).toHaveAttribute('data-use-standard-node-width', 'false');
		});

		it('needs the editor controls experiment when the gate is off', () => {
			failGate(GATE);
			mockExpDisabled(WORK_ITEM_MODERNIZATION);
			setupEditorExperiments('test', { platform_editor_controls: 'control' });

			expect(renderComment(true)).toHaveAttribute('data-use-standard-node-width', 'false');
		});

		it('uses the block menu value in the editor controls experiment when the gate is off', () => {
			failGate(GATE);
			setupEditorExperiments('test', { platform_editor_controls: 'variant1' });

			expect(renderComment(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});

		it('uses the block menu value in the work item modernization experiment when the gate is off', () => {
			failGate(GATE);
			mockExpEnabled(WORK_ITEM_MODERNIZATION);
			setupEditorExperiments('test', { platform_editor_controls: 'control' });

			expect(renderComment(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});

		it('uses the block menu value in the modernization cohort when the gate is off', () => {
			failGate(GATE);
			passGate(COHORT_GATE);
			mockExpDisabled(WORK_ITEM_MODERNIZATION);
			setupEditorExperiments('test', { platform_editor_controls: 'control' });

			expect(renderComment(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});
	});

	describe('chromeless appearance', () => {
		it('uses the block menu value when the gate is on', () => {
			passGate(GATE);

			expect(renderChromeless(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});

		it('ignores the block menu value when the gate is off', () => {
			failGate(GATE);
			mockExpDisabled(WORK_ITEM_MODERNIZATION);

			expect(renderChromeless(true)).toHaveAttribute('data-use-standard-node-width', 'false');
		});

		it('uses the block menu value in the work item modernization experiment when the gate is off', () => {
			failGate(GATE);
			mockExpEnabled(WORK_ITEM_MODERNIZATION);

			expect(renderChromeless(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});

		it('uses the block menu value in the modernization cohort when the gate is off', () => {
			failGate(GATE);
			passGate(COHORT_GATE);
			mockExpDisabled(WORK_ITEM_MODERNIZATION);

			expect(renderChromeless(true)).toHaveAttribute('data-use-standard-node-width', 'true');
		});
	});
});
