import type { RevisionPayload } from '../../common/vc/types';

export const addPerformanceMeasures = (start: number, measures: RevisionPayload): void => {
	try {
		measures
			.sort((a, b) => b.revision.localeCompare(a.revision))
			.slice(0, 2)
			.forEach((entry) => {
				if (entry.vcDetails?.['90']?.t !== undefined) {
					performance.mark(`VC90 (${entry.revision})`, {
						startTime: start + entry.vcDetails?.['90']?.t,
						detail: {
							devtools: {
								dataType: 'marker',
							},
						},
					});
				}
			});

		measures.forEach((entry) => {
			if (!entry || !entry.vcDetails) {
				return;
			}

			const VCParts = Object.keys(entry.vcDetails);

			performance.measure(`VC90 (${entry.revision})`, {
				start,
				duration: entry.vcDetails?.['90']?.t,
				detail: {
					devtools: {
						track: `main metrics`,
						trackGroup: '🛸 reactUFO metrics',
						color: 'tertiary',
					},
				},
			});

			VCParts.forEach((key) => {
				const duration = entry.vcDetails?.[key].t;
				if (typeof duration !== 'number') {
					return;
				}

				performance.measure(`VC${key}`, {
					start,
					duration,
					detail: {
						devtools: {
							track: `VC ${entry.revision}`,
							trackGroup: '🛸 reactUFO metrics',
							color: key === '90' ? 'tertiary' : 'primary-light',
						},
					},
				});
			});
		});
	} catch (error) {}
};
