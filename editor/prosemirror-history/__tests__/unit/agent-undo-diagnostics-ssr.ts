/**
 * @jest-environment node
 *
 * The diagnostics recorder installs its debug entry points on `window`. `prosemirror-history` is
 * imported by editor code that renders server-side, so the module must be importable and callable
 * with no DOM at all. This file deliberately runs in the `node` environment — the sibling
 * `agent-undo-diagnostics.ts` covers the jsdom behaviour.
 */
import { agentUndoDiagnostics } from '../../src/diagnostics/agent-undo-diagnostics';

describe('agent undo diagnostics without a DOM', () => {
	it('runs in an environment that really has no window', () => {
		// Without this the whole file could pass in jsdom and prove nothing.
		expect(typeof window).toBe('undefined');
	});

	it('installs no globals', () => {
		const globals = globalThis as Record<string, unknown>;
		expect(globals.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__).toBeUndefined();
		expect(globals.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__).toBeUndefined();
		expect(globals.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__).toBeUndefined();
	});

	it('reports recording as disabled', () => {
		expect(agentUndoDiagnostics.isEnabled()).toBe(false);
	});

	it('records nothing and throws nothing', () => {
		expect(() => {
			agentUndoDiagnostics.record('batch-promoted', 'tab-1', 'inv-1');
			agentUndoDiagnostics.record('undo-blocked', 'tab-1', 'inv-1', 'mapped-step-failed');
		}).not.toThrow();

		expect(agentUndoDiagnostics.exportArtifact()).toMatchObject({ events: [], schemaVersion: 3 });
	});

	it('clears and disables without throwing', () => {
		expect(() => {
			agentUndoDiagnostics.clear();
			agentUndoDiagnostics.disable();
		}).not.toThrow();
	});
});
