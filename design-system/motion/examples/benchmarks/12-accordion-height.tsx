import React, { useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Add motion when this disclosure reveals content of unknown height. Keep it responsive to content
 * changes and call out any performance concerns.
 */
export default function AccordionHeightBenchmark(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const contentId = useId();

	return (
		<BenchmarkLayout
			title="Project disclosure"
			description="Reveal content that can change height."
		>
			<BenchmarkSurface>
				<Stack space="space.100">
					<Button
						aria-controls={contentId}
						aria-expanded={isOpen}
						onClick={() => setIsOpen((open) => !open)}
					>
						{isOpen ? 'Hide project details' : 'Show project details'}
					</Button>
					{isOpen && (
						<Stack space="space.100">
							<div id={contentId}>
								<Text>This project aligns navigation behavior across Jira and Confluence.</Text>
								{showDetails && (
									<Text color="color.text.subtle">
										The work includes information architecture, interaction patterns, and migration
										guidance for product teams.
									</Text>
								)}
							</div>
							<Button onClick={() => setShowDetails((visible) => !visible)}>
								{showDetails ? 'Show less' : 'Show more'}
							</Button>
						</Stack>
					)}
				</Stack>
			</BenchmarkSurface>
		</BenchmarkLayout>
	);
}
