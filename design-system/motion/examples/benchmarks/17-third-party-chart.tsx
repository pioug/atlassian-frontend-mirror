/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	chart: {
		display: 'grid',
		gap: token('space.100'),
		maxWidth: '480px',
	},
	track: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.full'),
		overflow: 'hidden',
	},
	bar: {
		height: '24px',
		backgroundColor: token('color.background.brand.bold'),
		borderRadius: token('radius.full'),
		transitionProperty: 'width',
		transitionTimingFunction: token('motion.easing.out.practical'),
	},
});

function ThirdPartyChart({ values, animate }: { values: number[]; animate: boolean }): JSX.Element {
	return (
		<div css={styles.chart} aria-label="Completion by team">
			{values.map((value, index) => (
				<div css={styles.track} key={index}>
					<div
						css={styles.bar}
						style={{
							width: `${value}%`,
							transitionDuration: animate ? '400ms' : '0ms',
						}}
					/>
				</div>
			))}
		</div>
	);
}

/**
 * Benchmark prompt:
 * Make this third-party chart respect changes to the user's reduced-motion preference without
 * requiring a page refresh.
 */
export default function ThirdPartyChartBenchmark(): JSX.Element {
	const [alternateData, setAlternateData] = useState(false);
	const values = alternateData ? [72, 44, 88] : [40, 68, 56];

	return (
		<BenchmarkLayout title="Team completion" description="Update the chart to see its animation.">
			<Stack space="space.150">
				<Button onClick={() => setAlternateData((alternate) => !alternate)}>Update data</Button>
				<ThirdPartyChart values={values} animate />
				<Text color="color.text.subtle">The chart library exposes an `animate` boolean.</Text>
			</Stack>
		</BenchmarkLayout>
	);
}
