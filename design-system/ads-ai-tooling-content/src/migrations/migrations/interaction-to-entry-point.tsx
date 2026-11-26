import type { MigrationGuide } from '../types';

export const interactionToEntryPoint: MigrationGuide = {
	id: 'interaction-to-entry-point',
	title: 'Interaction to EntryPoint migration',
	description:
		'Use when replacing an existing modal, popup, dropdown, or similar interaction boundary with an EntryPoint. It does not apply to new inline UI, API-only work, or test-only changes.',
	fromPackage: 'product-owned interaction',
	toPackage: '@atlassian/entry-points',
	examples: [
		{
			title: 'Move a controlled modal to an EntryPoint trigger',
			description:
				'Replace locally owned visibility state and direct rendering with the product-supported trigger and required provider.',
			before: `
const [isOpen, setIsOpen] = useState(false);

<Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
	Open modal
</Button>
{isOpen && <Modal onClose={() => setIsOpen(false)}>…</Modal>}
`,
			after: `
<ModalContextProvider>
	<ModalButtonTrigger entryPoint={modalEntryPoint} appearance="primary">
		Open modal
	</ModalButtonTrigger>
</ModalContextProvider>
`,
			explanation:
				'The trigger owns visibility while the loaded root receives the supplied close callback. This is a structural example only: confirm the product API, provider requirements, focus return, Escape and outside dismissal, analytics, and any existing controlled-open contract before applying it.',
		},
	],
	bestPractices: [
		'Read the applicable product and package guides, then inspect the current interaction, its callers, and the shipped target trigger. Identify open/close paths, callbacks, state and data owners, provider lifetime, and the trigger ref, keyboard, disabled, and semantic props.',
		'Use a direct conversion only when the supported target contract preserves required behavior. Do not remove public controlled or default-open behavior, manufacture unsupported props, or force a migration by changing requirements.',
		'Move deferred UI behind the product-supported lazy root and remove eager value imports that defeat it. Keep preload parameters, queries, runtime props, and injected trigger props separate.',
		'Forward the supplied trigger ref and interaction props to the actual control. Keep state, analytics, providers, and close side effects with the owner whose lifetime the existing contract requires.',
		'For GraphQL, preload only data available at open time and consume the matching query reference in the lazy UI. Do not hand-edit generated artifacts or replace unrelated data architectures.',
		'Trace the launcher through the trigger, EntryPoint, and lazy root to the rendered experience. A disconnected descriptor or unused preload is not a completed migration.',
		'Run the smallest supported checks that observe changed behavior. Check opening, closing, callbacks, focus and keyboard behavior, data freshness, loading, and failures only when the original interaction requires them.',
	],
	additionalResources:
		'Report independently whether the conversion is full, partial, or blocked; whether behavior is preserved, changed, or unresolved; and which checks actually ran. Do not claim performance gains or runtime parity without evidence.',
};
