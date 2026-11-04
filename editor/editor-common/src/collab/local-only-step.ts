import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { StepMap, StepResult } from '@atlaskit/editor-prosemirror/transform';
import { Step } from '@atlaskit/editor-prosemirror/transform-override';

/**
 * A step that never changes the document and is never sent to collaborators.
 *
 * Use it to put a change that lives outside ADF, such as a page setting, into the local undo
 * history: undo history only records steps. The collab plugin drops these steps before it sends,
 * rebases or counts changes, the same way it drops analytics steps. Collaborators learn about the
 * change some other way, for example through the product's own sync.
 */
export abstract class LocalOnlyStep extends Step {
	apply(doc: PMNode): StepResult {
		return StepResult.ok(doc);
	}

	/** Covers no range, so history never groups it with content edits. */
	getMap(): StepMap {
		return StepMap.empty;
	}

	/** Has no positions, so mapping through other changes leaves it as is. */
	map(): Step {
		return this;
	}

	merge(): null {
		return null;
	}
}
