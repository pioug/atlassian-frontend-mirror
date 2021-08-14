import WhatsNewIconExperiment from '../assets/WhatsNewIcoExperiment';
import WhatsNewIconFix from '../assets/WhatsNewIconFix';
import WhatsNewIconRemoved from '../assets/WhatsNewIconRemoved';
import WhatsNewIconImprovement from '../assets/WhatsNewIconImprovement';
import WhatsNewIconNew from '../assets/WhatsNewIconNew';
import { WHATS_NEW_ITEM_TYPES } from '../model/WhatsNew';
import { messages } from '../messages';

export const getTypeIcon = (itemType?: WHATS_NEW_ITEM_TYPES) => {
  switch (itemType) {
    case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
      return WhatsNewIconNew();

    case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
      return WhatsNewIconExperiment();

    case WHATS_NEW_ITEM_TYPES.FIX:
      return WhatsNewIconFix();

    case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
      return WhatsNewIconImprovement();

    case WHATS_NEW_ITEM_TYPES.REMOVED:
      return WhatsNewIconRemoved();

    default:
      return '';
  }
};

export const getTypeTitle = (itemType: WHATS_NEW_ITEM_TYPES) => {
  switch (itemType) {
    case WHATS_NEW_ITEM_TYPES.NEW_FEATURE:
      return messages.help_whats_new_filter_select_option_new;

    case WHATS_NEW_ITEM_TYPES.EXPERIMENT:
      return messages.help_whats_new_filter_select_option_experiment;

    case WHATS_NEW_ITEM_TYPES.FIX:
      return messages.help_whats_new_filter_select_option_fix;

    case WHATS_NEW_ITEM_TYPES.IMPROVEMENT:
      return messages.help_whats_new_filter_select_option_improvement;

    case WHATS_NEW_ITEM_TYPES.REMOVED:
      return messages.help_whats_new_filter_select_option_removed;
  }
};
