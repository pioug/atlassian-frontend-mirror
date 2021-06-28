interface MarkJson {
  type: string;
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
    case 'confluenceInlineComment':
    case 'breakout':
    case 'alignment':
    case 'indentation':
      return defaultAllowOverrideBehaviour;
    default:
      return defaultDoNotAllowOverrideBehaviour;
  }
};
