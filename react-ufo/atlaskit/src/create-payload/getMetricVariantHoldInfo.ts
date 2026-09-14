import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { HoldActive, HoldInfo, InteractionMetrics, MetricVariantCategory } from '../common';

import { type LabelStackRegistry } from './common/utils/label-stack-registry';
import { type getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';
import { optimizeHoldInfo } from './utils/optimize-hold-info';

const METRIC_VARIANT_CATEGORIES: MetricVariantCategory[] = ['third-party', 'gen-ai'];

const isMetricVariantCategory = (type: unknown): type is MetricVariantCategory =>
	type === 'third-party' || type === 'gen-ai';

const getMetricVariantCategoriesFromLabelStack = (
	labelStack: (HoldInfo | HoldActive)['labelStack'],
): MetricVariantCategory[] => {
	const categories = new Set<MetricVariantCategory>();

	labelStack.forEach((label) => {
		if ('type' in label && isMetricVariantCategory(label.type)) {
			categories.add(label.type);
		}
	});

	return [...categories];
};

const getMetricVariantHoldEnd = (
	interaction: InteractionMetrics,
	category: MetricVariantCategory,
): number | undefined => {
	const categoryEnd = interaction.metricCategoryEnds?.[category];

	if (categoryEnd !== undefined) {
		return categoryEnd;
	}

	return category === 'third-party' ? interaction.end3p : undefined;
};

export const getMetricVariantHoldInfo: any = (
	interaction: InteractionMetrics,
	interactionStart: number,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
) => {
	if (!fg('platform_ufo_emit_metric_variant_holds')) {
		return {};
	}

	const holdInfoByCategory = Object.fromEntries(
		METRIC_VARIANT_CATEGORIES.map((category) => {
			const categoryHoldInfo = (interaction.hold3pInfo ?? []).filter((hold) =>
				getMetricVariantCategoriesFromLabelStack(hold.labelStack).includes(category),
			);
			const activeCategoryHoldEnd = getMetricVariantHoldEnd(interaction, category);
			const activeCategoryHoldInfo =
				activeCategoryHoldEnd !== undefined
					? [...(interaction.hold3pActive?.values() ?? [])]
							.filter((hold) =>
								getMetricVariantCategoriesFromLabelStack(hold.labelStack).includes(category),
							)
							.map((hold): HoldInfo => ({ ...hold, end: activeCategoryHoldEnd }))
					: [];
			const optimizedHoldInfo = optimizeHoldInfo(
				[...categoryHoldInfo, ...activeCategoryHoldInfo],
				interactionStart,
				reactUFOVersion,
				registry,
			);

			return [category, optimizedHoldInfo] as const;
		}).filter(([, categoryHoldInfo]) => categoryHoldInfo.length > 0),
	);

	return Object.keys(holdInfoByCategory).length > 0
		? { metricVariantHoldInfo: holdInfoByCategory }
		: {};
};
