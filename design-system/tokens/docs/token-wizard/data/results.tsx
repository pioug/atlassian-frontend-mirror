import { ActiveTokens } from '../../../src/artifacts/types';

/**
 * An object type can't use its own keys in its object definition
 * Instead we have to define an object type with all the result keys
 */

export type Results = {
  [key in keyof resultId]: {
    suggestion: ActiveTokens[];
    metadata?: {
      hints?: string[];
    };
  };
};
interface resultId {
  'text/default': any;
  'text/neutral/subtle': any;
  'text/neutral/subtlest': any;
  'text/neutral/disabled': any;
  'text/neutral/on-bold': any;
  'text/link/default': any;
  'text/link/subtle': any;
  'text/colored/brand': any;
  'text/colored/information': any;
  'text/colored/success': any;
  'text/colored/warning': any;
  'text/colored/danger': any;
  'text/colored/discovery': any;
  'text/colored/selected': any;
  'text/colored/accent/blue': any;
  'text/colored/accent/teal': any;
  'text/colored/accent/green': any;
  'text/colored/accent/yellow': any;
  'text/colored/accent/orange': any;
  'text/colored/accent/red': any;
  'text/colored/accent/magenta': any;
  'text/colored/accent/purple': any;
  'text/colored/accent/gray': any;
  'background-surface/surface/main-background': any;
  'background-surface/surface/modal-dropdown': any;
  'background-surface/surface/card': any;
  'background-surface/surface/grouping': any;
  'background-surface/background/colored/brand': any;
  'background-surface/background/colored/information': any;
  'background-surface/background/colored/success': any;
  'background-surface/background/colored/warning': any;
  'background-surface/background/colored/danger': any;
  'background-surface/background/colored/discovery': any;
  'background-surface/background/colored/selected': any;
  'background-surface/background/colored/accent/blue': any;
  'background-surface/background/colored/accent/teal': any;
  'background-surface/background/colored/accent/green': any;
  'background-surface/background/colored/accent/red': any;
  'background-surface/background/colored/accent/orange': any;
  'background-surface/background/colored/accent/yellow': any;
  'background-surface/background/colored/accent/magenta': any;
  'background-surface/background/colored/accent/purple': any;
  'background-surface/background/colored/accent/gray': any;
  'background-surface/background/neutral/input': any;
  'background-surface/background/neutral/disabled': any;
  'background-surface/background/neutral/neutral': any;
  'background-surface/background/neutral/subtle': any;
  'background-surface/background/neutral/vibrant': any;
  'background-surface/background/neutral/on-bold': any;
  'shadow/raised': any;
  'shadow/overlay': any;
  'shadow/overflow': any;
  'border/colored/brand': any;
  'border/colored/information': any;
  'border/colored/success': any;
  'border/colored/warning': any;
  'border/colored/danger': any;
  'border/colored/discovery': any;
  'border/colored/focused': any;
  'border/colored/selected': any;
  'border/colored/blue': any;
  'border/colored/teal': any;
  'border/colored/green': any;
  'border/colored/yellow': any;
  'border/colored/orange': any;
  'border/colored/red': any;
  'border/colored/magenta': any;
  'border/colored/purple': any;
  'border/colored/gray': any;
  'border/neutral/input': any;
  'border/neutral/neutral': any;
  'border/neutral/disabled': any;
  'icon/colored/brand': any;
  'icon/colored/information': any;
  'icon/colored/success': any;
  'icon/colored/warning': any;
  'icon/colored/danger': any;
  'icon/colored/discovery': any;
  'icon/colored/selected': any;
  'icon/colored/blue': any;
  'icon/colored/teal': any;
  'icon/colored/green': any;
  'icon/colored/yellow': any;
  'icon/colored/orange': any;
  'icon/colored/red': any;
  'icon/colored/magenta': any;
  'icon/colored/purple': any;
  'icon/colored/gray': any;
  'icon/neutral/default': any;
  'icon/neutral/subtle': any;
  'icon/neutral/on-bold': any;
  'icon/neutral/disabled': any;
  'other/blanket/modal': any;
  'other/blanket/deletion': any;
  'other/blanket/selection': any;
  'other/skeleton': any;
  'other/skeleton/subtle': any;
  'opacity/disabled': any;
  'opacity/loading': any;
}

const results: Results = {
  'text/default': {
    suggestion: ['color.text'],
  },
  'text/neutral/subtle': {
    suggestion: ['color.text.subtle'],
  },
  'text/neutral/subtlest': {
    suggestion: ['color.text.subtlest'],
  },
  'text/neutral/disabled': {
    suggestion: ['color.text.disabled'],
  },
  'text/neutral/on-bold': {
    suggestion: ['color.text.inverse', 'color.text.warning.inverse'],
  },
  'text/link/default': {
    suggestion: ['color.link'],
  },
  'text/link/subtle': {
    suggestion: ['color.text.subtle'],
  },
  'text/colored/brand': {
    suggestion: ['color.text.brand'],
  },
  'text/colored/information': {
    suggestion: ['color.text.information'],
  },
  'text/colored/success': {
    suggestion: ['color.text.success'],
  },
  'text/colored/warning': {
    suggestion: ['color.text.warning'],
  },
  'text/colored/danger': {
    suggestion: ['color.text.danger'],
  },
  'text/colored/discovery': {
    suggestion: ['color.text.discovery'],
  },
  'text/colored/selected': {
    suggestion: ['color.text.selected'],
  },
  'text/colored/accent/blue': {
    suggestion: ['color.text.accent.blue', 'color.text.accent.blue.bolder'],
  },
  'text/colored/accent/teal': {
    suggestion: ['color.text.accent.teal', 'color.text.accent.teal.bolder'],
  },
  'text/colored/accent/green': {
    suggestion: ['color.text.accent.green', 'color.text.accent.green.bolder'],
  },
  'text/colored/accent/yellow': {
    suggestion: ['color.text.accent.yellow', 'color.text.accent.yellow.bolder'],
  },
  'text/colored/accent/orange': {
    suggestion: ['color.text.accent.orange', 'color.text.accent.orange.bolder'],
  },
  'text/colored/accent/red': {
    suggestion: ['color.text.accent.red', 'color.text.accent.red.bolder'],
  },
  'text/colored/accent/magenta': {
    suggestion: [
      'color.text.accent.magenta',
      'color.text.accent.magenta.bolder',
    ],
  },
  'text/colored/accent/purple': {
    suggestion: ['color.text.accent.purple', 'color.text.accent.purple.bolder'],
  },
  'text/colored/accent/gray': {
    suggestion: ['color.text.accent.gray', 'color.text.accent.gray.bolder'],
  },

  'background-surface/surface/main-background': {
    suggestion: ['elevation.surface'],
    metadata: {
      hints: [''],
    },
  },
  'background-surface/surface/modal-dropdown': {
    suggestion: ['elevation.surface.overlay'],
    metadata: {
      hints: ['Pair this elevation with `shadow.overlay`'],
    },
  },
  'background-surface/surface/card': {
    suggestion: ['elevation.surface.raised'],
    metadata: {
      hints: ['Pair this elevation with `shadow.raised`'],
    },
  },
  'background-surface/surface/grouping': {
    suggestion: ['elevation.surface.sunken'],
    metadata: {
      hints: [
        'Use elevation.surface.sunken on top of the elevation.surface',
        'You can also use color.border + no background to group content together',
      ],
    },
  },
  'background-surface/background/colored/brand': {
    suggestion: ['color.background.brand.bold'],
  },
  'background-surface/background/colored/information': {
    suggestion: [
      'color.background.information',
      'color.background.information.bold',
    ],
  },
  'background-surface/background/colored/success': {
    suggestion: ['color.background.success', 'color.background.success.bold'],
  },
  'background-surface/background/colored/warning': {
    suggestion: ['color.background.warning', 'color.background.warning.bold'],
  },
  'background-surface/background/colored/danger': {
    suggestion: ['color.background.danger', 'color.background.danger.bold'],
  },
  'background-surface/background/colored/discovery': {
    suggestion: [
      'color.background.discovery',
      'color.background.discovery.bold',
    ],
  },
  'background-surface/background/colored/selected': {
    suggestion: ['color.background.selected', 'color.background.selected.bold'],
  },
  'background-surface/background/colored/accent/blue': {
    suggestion: [
      'color.background.accent.blue.subtlest',
      'color.background.accent.blue.subtler',
      'color.background.accent.blue.subtle',
      'color.background.accent.blue.bolder',
    ],
  },
  'background-surface/background/colored/accent/teal': {
    suggestion: [
      'color.background.accent.teal.subtlest',
      'color.background.accent.teal.subtler',
      'color.background.accent.teal.subtle',
      'color.background.accent.teal.bolder',
    ],
  },
  'background-surface/background/colored/accent/green': {
    suggestion: [
      'color.background.accent.green.subtlest',
      'color.background.accent.green.subtler',
      'color.background.accent.green.subtle',
      'color.background.accent.green.bolder',
    ],
  },
  'background-surface/background/colored/accent/red': {
    suggestion: [
      'color.background.accent.red.subtlest',
      'color.background.accent.red.subtler',
      'color.background.accent.red.subtle',
      'color.background.accent.red.bolder',
    ],
  },
  'background-surface/background/colored/accent/orange': {
    suggestion: [
      'color.background.accent.orange.subtlest',
      'color.background.accent.orange.subtler',
      'color.background.accent.orange.subtle',
      'color.background.accent.orange.bolder',
    ],
  },
  'background-surface/background/colored/accent/yellow': {
    suggestion: [
      'color.background.accent.yellow.subtlest',
      'color.background.accent.yellow.subtler',
      'color.background.accent.yellow.subtle',
      'color.background.accent.yellow.bolder',
    ],
  },
  'background-surface/background/colored/accent/magenta': {
    suggestion: [
      'color.background.accent.magenta.subtlest',
      'color.background.accent.magenta.subtler',
      'color.background.accent.magenta.subtle',
      'color.background.accent.magenta.bolder',
    ],
  },
  'background-surface/background/colored/accent/purple': {
    suggestion: [
      'color.background.accent.purple.subtlest',
      'color.background.accent.purple.subtler',
      'color.background.accent.purple.subtle',
      'color.background.accent.purple.bolder',
    ],
  },
  'background-surface/background/colored/accent/gray': {
    suggestion: [
      'color.background.accent.gray.subtlest',
      'color.background.accent.gray.subtler',
      'color.background.accent.gray.subtle',
      'color.background.accent.gray.bolder',
    ],
  },
  'background-surface/background/neutral/input': {
    suggestion: ['color.background.input'],
  },
  'background-surface/background/neutral/disabled': {
    suggestion: ['color.background.disabled'],
  },
  'background-surface/background/neutral/neutral': {
    suggestion: ['color.background.neutral'],
  },
  'background-surface/background/neutral/subtle': {
    suggestion: ['color.background.neutral.subtle'],
    metadata: {
      hints: [
        'Use color.background.neutral.subtle for the resting state; though transparent it allows for fade animation',
      ],
    },
  },
  'background-surface/background/neutral/vibrant': {
    suggestion: ['color.background.neutral.bold'],
  },
  'background-surface/background/neutral/on-bold': {
    suggestion: ['color.background.inverse.subtle'],
  },

  'shadow/raised': {
    suggestion: ['elevation.shadow.raised'],
    metadata: {
      hints: ['Make sure to pair this shadow with the matching surface'],
    },
  },
  'shadow/overlay': {
    suggestion: ['elevation.shadow.overlay'],
    metadata: {
      hints: ['Make sure to pair this shadow with the matching surface'],
    },
  },
  'shadow/overflow': {
    suggestion: ['elevation.shadow.overflow'],
  },

  'border/colored/brand': {
    suggestion: ['color.border.brand'],
  },
  'border/colored/information': {
    suggestion: ['color.border.information'],
  },
  'border/colored/success': {
    suggestion: ['color.border.success'],
  },
  'border/colored/warning': {
    suggestion: ['color.border.warning'],
  },
  'border/colored/danger': {
    suggestion: ['color.border.danger'],
  },
  'border/colored/discovery': {
    suggestion: ['color.border.discovery'],
  },
  'border/colored/focused': {
    suggestion: ['color.border.focused'],
  },
  'border/colored/selected': {
    suggestion: ['color.border.selected'],
  },
  'border/colored/blue': {
    suggestion: ['color.border.accent.blue'],
  },
  'border/colored/teal': {
    suggestion: ['color.border.accent.teal'],
  },
  'border/colored/green': {
    suggestion: ['color.border.accent.green'],
  },
  'border/colored/yellow': {
    suggestion: ['color.border.accent.yellow'],
  },
  'border/colored/orange': {
    suggestion: ['color.border.accent.orange'],
  },
  'border/colored/red': {
    suggestion: ['color.border.accent.red'],
  },
  'border/colored/magenta': {
    suggestion: ['color.border.accent.magenta'],
  },
  'border/colored/purple': {
    suggestion: ['color.border.accent.purple'],
  },
  'border/colored/gray': {
    suggestion: ['color.border.accent.gray'],
  },
  'border/neutral/input': {
    suggestion: ['color.border.input'],
  },
  'border/neutral/neutral': {
    suggestion: ['color.border', 'color.border.bold', 'color.border.inverse'],
  },
  'border/neutral/disabled': {
    suggestion: ['color.border.disabled'],
  },

  'icon/colored/brand': {
    suggestion: ['color.icon.brand'],
  },
  'icon/colored/information': {
    suggestion: ['color.icon.information'],
  },
  'icon/colored/success': {
    suggestion: ['color.icon.success'],
  },
  'icon/colored/warning': {
    suggestion: ['color.icon.warning'],
  },
  'icon/colored/danger': {
    suggestion: ['color.icon.danger'],
  },
  'icon/colored/discovery': {
    suggestion: ['color.icon.discovery'],
  },
  'icon/colored/selected': {
    suggestion: ['color.icon.selected'],
  },
  'icon/colored/blue': {
    suggestion: ['color.icon.accent.blue'],
  },
  'icon/colored/teal': {
    suggestion: ['color.icon.accent.teal'],
  },
  'icon/colored/green': {
    suggestion: ['color.icon.accent.green'],
  },
  'icon/colored/yellow': {
    suggestion: ['color.icon.accent.yellow'],
  },
  'icon/colored/orange': {
    suggestion: ['color.icon.accent.orange'],
  },
  'icon/colored/red': {
    suggestion: ['color.icon.accent.red'],
  },
  'icon/colored/magenta': {
    suggestion: ['color.icon.accent.magenta'],
  },
  'icon/colored/purple': {
    suggestion: ['color.icon.accent.purple'],
  },
  'icon/colored/gray': {
    suggestion: ['color.icon.accent.gray'],
  },
  'icon/neutral/default': {
    suggestion: ['color.icon'],
  },
  'icon/neutral/subtle': {
    suggestion: ['color.icon.subtle'],
  },
  'icon/neutral/on-bold': {
    suggestion: ['color.icon.inverse', 'color.icon.warning.inverse'],
    metadata: {
      hints: [
        'Ensure that `color.icon.warning.inverse` is used when the icon is on a warning background.',
      ],
    },
  },
  'icon/neutral/disabled': {
    suggestion: ['color.icon.disabled'],
  },
  'other/blanket/modal': {
    suggestion: ['color.blanket'],
  },
  'other/blanket/deletion': {
    suggestion: ['color.blanket.danger'],
  },
  'other/blanket/selection': {
    suggestion: ['color.blanket.selected'],
  },
  'other/skeleton': {
    suggestion: ['color.skeleton'],
  },
  'other/skeleton/subtle': {
    suggestion: ['color.skeleton.subtle'],
  },
  'opacity/disabled': {
    suggestion: ['opacity.disabled'],
  },
  'opacity/loading': {
    suggestion: ['opacity.loading'],
  },
};

export default results;
