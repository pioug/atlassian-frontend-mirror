import type { VCObserverEntry, VCObserverEntryType } from "../../types";
import VCCalculator_FY26_04 from "../fy26_04";

const getConsideredEntryTypes = () => {
	const consideredEntryTypes: VCObserverEntryType[] = [];

	return consideredEntryTypes;
};

const getExcludedEntryTypes = () => {
	const excludedEntryTypes: VCObserverEntryType[] = [];

	return excludedEntryTypes;
};

export default class VCCalculator_Next extends VCCalculator_FY26_04 {
	constructor() {
		super('next');
	}

	protected isEntryIncluded(
			entry: VCObserverEntry,
			include3p?: boolean,
			excludeSmartAnswersInSearch?: boolean,
		): boolean {
			const isEntryIncludedInV4 = super.isEntryIncluded(
				entry,
				include3p,
				excludeSmartAnswersInSearch,
			);

			if (isEntryIncludedInV4 && !getExcludedEntryTypes().includes(entry.data.type)) {
				return true;
			}

			return getConsideredEntryTypes().includes(entry.data.type);
		}
}
