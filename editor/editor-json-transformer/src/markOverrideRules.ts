interface MarkJson {
	type: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
}

type CanOverrideUnsupportedMark = (markJson?: MarkJson) => boolean;

interface MarkOverrideRule {
	canOverrideUnsupportedMark: CanOverrideUnsupportedMark;
}

type MarkOverrideRules = (type: string) => MarkOverrideRule;

const defaultAllowOverrideBehaviour: MarkOverrideRule = {
	canOverrideUnsupportedMark: () => {
		return true;
	},
};

const defaultDoNotAllowOverrideBehaviour: MarkOverrideRule = {
	canOverrideUnsupportedMark: () => {
		return false;
	},
};

export const markOverrideRuleFor: MarkOverrideRules = (type) => {
	switch (type) {
		case 'link':
		case 'em':
		case 'strong':
		case 'strike':
		case 'subsup':
		case 'underline':
		case 'code':
		case 'textColor':
		case 'backgroundColor':
		case 'confluenceInlineComment':
		case 'breakout':
		case 'alignment':
		case 'indentation':
		case 'border':
			return defaultAllowOverrideBehaviour;
		default:
			return defaultDoNotAllowOverrideBehaviour;
	}
};
