import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import memoizeOne from 'memoize-one';
import { messages } from '../../components/i18n';
import type { OptionData, Option, GroupedOptions } from '../../types';

const getLabelForType = (type: NonNullable<OptionData['type']>) => {
	switch (type) {
		case 'user':
			return <FormattedMessage {...messages.userTypeLabel} />;
		case 'team':
			return <FormattedMessage {...messages.teamTypeLabel} />;
		case 'group':
			return <FormattedMessage {...messages.groupTypeLabel} />;
		case 'custom':
			return <FormattedMessage {...messages.customTypeLabel} />;
		case 'external_user':
			return <FormattedMessage {...messages.externalUserTypeLabel} />;
		default:
			return <FormattedMessage {...messages.otherTypeLabel} />;
	}
};

export const groupOptionsByType = memoizeOne(
	(options: Option[], groupByTypeOrder: NonNullable<OptionData['type']>[]) => {
		// If groupByTypeOrder is empty, just return the original options
		if (groupByTypeOrder.length === 0) {
			return options;
		}

		const groupedMap = new Map<string, Option[]>();
		options.forEach((option) => {
			const type = option.data.type || 'other';

			if (!groupedMap.has(type)) {
				groupedMap.set(type, []);
			}

			groupedMap.get(type)!.push(option);
		});

		const result: GroupedOptions[] = [];

		// add groups in the specified order
		// type is not in groupByTypeOrder, don't add it to the result
		groupByTypeOrder.forEach((type) => {
			if (groupedMap.has(type)) {
				result.push({
					label: getLabelForType(type),
					options: groupedMap.get(type)!,
				});

				groupedMap.delete(type);
			}
		});

		return result;
	},
);
