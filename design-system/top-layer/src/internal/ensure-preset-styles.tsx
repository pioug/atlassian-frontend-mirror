/**
 * Per-preset CSS injection.
 *
 * Each preset's CSS is injected at most once into `<head>`.
 * Shared by both PopoverContent and DialogContent.
 *
 * Note: injected `<style>` elements and the tracking Set are append-only —
 * they are never removed. This is intentional: the number of distinct
 * presets is bounded (handful of animation + arrow presets), so the
 * memory footprint is negligible. Removing styles would risk breaking
 * other instances of the same preset that are still mounted.
 *
 * Decision (2026-03-17 audit): Accepted as a non-issue. The bounded
 * preset count (~5 presets) makes cleanup unnecessary. We plan to move
 * to a Compiled-based solution which will handle style injection and
 * deduplication natively.
 */
const injectedPresets = new Set<string>();

export function ensurePresetStyles({ preset }: { preset: { css: string; name: string } }): void {
	if (injectedPresets.has(preset.name) || typeof document === 'undefined') {
		return;
	}
	injectedPresets.add(preset.name);
	const style = document.createElement('style');
	style.textContent = preset.css;
	document.head.appendChild(style);
}
