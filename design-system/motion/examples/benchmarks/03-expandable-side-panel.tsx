/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

const styles = cssMap({
	preview: {
		minHeight: '240px',
	},
	panel: {
		maxWidth: '320px',
		marginInlineStart: 'auto',
	},
});

/**
 * Benchmark prompt:
 * Add appropriate motion when this details panel opens and closes. Preserve keyboard behavior,
 * focus handling, and layout.
 */
export default function ExpandableSidePanelBenchmark(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const panelId = useId();

	return (
		<BenchmarkLayout title="Details panel" description="Open and close the project details panel.">
			<Stack space="space.150" xcss={styles.preview}>
				<Inline>
					<Button
						aria-controls={panelId}
						aria-expanded={isOpen}
						onClick={() => setIsOpen((open) => !open)}
					>
						{isOpen ? 'Close details' : 'Open details'}
					</Button>
				</Inline>
				{isOpen && (
					<div id={panelId} css={styles.panel}>
						<BenchmarkSurface>
							<Stack space="space.100">
								<Text weight="semibold">Project details</Text>
								<Text color="color.text.subtle">
									Due Friday · Three contributors · Medium priority
								</Text>
								<Button onClick={() => setIsOpen(false)}>Done</Button>
							</Stack>
						</BenchmarkSurface>
					</div>
				)}
			</Stack>
		</BenchmarkLayout>
	);
}
