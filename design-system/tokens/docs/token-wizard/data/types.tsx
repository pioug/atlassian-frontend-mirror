import { ActiveTokens } from '../../../src/artifacts/types';
import {
  Groups,
  OpacityToken,
  PaintToken,
  RawToken,
  ShadowToken,
} from '../../../src/types';

export type questionID = keyof Questions;
export type resultID = keyof Results;

export interface TokenBase<GroupName extends Groups, TokenValue> {
  value: string;
  name: string;
  attributes: {
    group: GroupName;
    description?: string;
    state?: string;
    replacement?: string;
  };
  original: TokenValue;
}

export type Token =
  | TokenBase<'paint', PaintToken<any>>
  | TokenBase<'shadow', ShadowToken<any>>
  | TokenBase<'opacity', OpacityToken>
  | TokenBase<'raw', RawToken>;

export interface Question {
  title: string;
  summary: string;
  answers: Answer[];
  image?: string;
  metadata?: {
    description?: string;
  };
}

export type Answer = {
  id: string;
  summary: string;
  description?: string;
  image?: string;
  metadata?: { hints?: string[] };
} & (
  | {
      result: keyof Results;
      next?: never;
    }
  | {
      result?: never;
      next: keyof Questions;
    }
);

export type Path = {
  questionId: questionID;
  question: string;
  answer: string;
};

export type Questions = {
  [key in keyof questionId]: Question;
};

export type Pairings = {
  icon: string;
  text: string;
  border: string;
  background: string;
};

export type Result = {
  name: ActiveTokens;
  image?: string;
  hints?: string[];
  pairings?: Pairings[];
};

export type Results = {
  [key in keyof resultId]: Result[];
};

export type questionId = {
  root: any;
  text: any;
  'text/neutral': any;
  'text/link': any;
  'text/colored': any;
  'text/colored/accent': any;
  'background-surface': any;
  'background-surface/surface': any;
  'background-surface/background': any;
  'background-surface/background/colored': any;
  'background-surface/background/colored/accent': any;
  'background-surface/background/neutral': any;
  shadow: any;
  border: any;
  'border/colored': any;
  'border/colored/accent': any;
  'border/neutral': any;
  icon: any;
  'icon/colored': any;
  'icon/colored/accent': any;
  'icon/neutral': any;
  'data-visualisation': any;
  'data-visualisation/product': any;
  'data-visualisation/product/none': any;
  'data-visualisation/product/success': any;
  'data-visualisation/product/warning': any;
  'data-visualisation/product/danger': any;
  'data-visualisation/product/discovery': any;
  'data-visualisation/product/information': any;
  'data-visualisation/product/brand': any;
  other: any;
  'other/blanket': any;
  'other/skeleton': any;
};
export type resultId = {
  'text/default_resultNode': any;
  'text/neutral/subtle_resultNode': any;
  'text/neutral/subtlest_resultNode': any;
  'text/neutral/disabled_resultNode': any;
  'text/neutral/on-bold_resultNode': any;
  'text/colored/accent/gray_resultNode': any;
  'text/link/default_resultNode': any;
  'text/link/subtle_resultNode': any;
  'text/colored/brand_resultNode': any;
  'text/colored/information_resultNode': any;
  'text/colored/success_resultNode': any;
  'text/colored/warning_resultNode': any;
  'text/colored/danger_resultNode': any;
  'text/colored/discovery_resultNode': any;
  'text/colored/selected_resultNode': any;
  'text/colored/accent/blue_resultNode': any;
  'text/colored/accent/teal_resultNode': any;
  'text/colored/accent/green_resultNode': any;
  'text/colored/accent/yellow_resultNode': any;
  'text/colored/accent/orange_resultNode': any;
  'text/colored/accent/red_resultNode': any;
  'text/colored/accent/magenta_resultNode': any;
  'text/colored/accent/purple_resultNode': any;
  'background-surface/surface/main-background_resultNode': any;
  'background-surface/surface/modal-dropdown_resultNode': any;
  'background-surface/surface/card_resultNode': any;
  'background-surface/surface/grouping_resultNode': any;
  'background-surface/background/colored/brand_resultNode': any;
  'background-surface/background/colored/information_resultNode': any;
  'background-surface/background/colored/success_resultNode': any;
  'background-surface/background/colored/warning_resultNode': any;
  'background-surface/background/colored/danger_resultNode': any;
  'background-surface/background/colored/discovery_resultNode': any;
  'background-surface/background/colored/selected_resultNode': any;
  'background-surface/background/colored/accent/blue_resultNode': any;
  'background-surface/background/colored/accent/teal_resultNode': any;
  'background-surface/background/colored/accent/green_resultNode': any;
  'background-surface/background/colored/accent/yellow_resultNode': any;
  'background-surface/background/colored/accent/orange_resultNode': any;
  'background-surface/background/colored/accent/red_resultNode': any;
  'background-surface/background/colored/accent/magenta_resultNode': any;
  'background-surface/background/colored/accent/purple_resultNode': any;
  'background-surface/background/colored/accent/gray_resultNode': any;
  'background-surface/background/neutral/input_resultNode': any;
  'background-surface/background/neutral/disabled_resultNode': any;
  'background-surface/background/neutral/neutral_resultNode': any;
  'background-surface/background/neutral/subtle_resultNode': any;
  'background-surface/background/neutral/vibrant_resultNode': any;
  'background-surface/background/neutral/on-bold_resultNode': any;
  'shadow/raised_resultNode': any;
  'shadow/overlay_resultNode': any;
  'shadow/overflow_resultNode': any;
  'border/colored/brand_resultNode': any;
  'border/colored/information_resultNode': any;
  'border/colored/success_resultNode': any;
  'border/colored/warning_resultNode': any;
  'border/colored/danger_resultNode': any;
  'border/colored/discovery_resultNode': any;
  'border/colored/focused_resultNode': any;
  'border/colored/selected_resultNode': any;
  'border/colored/blue_resultNode': any;
  'border/colored/teal_resultNode': any;
  'border/colored/green_resultNode': any;
  'border/colored/yellow_resultNode': any;
  'border/colored/orange_resultNode': any;
  'border/colored/red_resultNode': any;
  'border/colored/magenta_resultNode': any;
  'border/colored/purple_resultNode': any;
  'border/colored/gray_resultNode': any;
  'border/neutral/input_resultNode': any;
  'border/neutral/disabled_resultNode': any;
  'border/neutral/neutral_resultNode': any;
  'icon/colored/brand_resultNode': any;
  'icon/colored/information_resultNode': any;
  'icon/colored/success_resultNode': any;
  'icon/colored/warning_resultNode': any;
  'icon/colored/danger_resultNode': any;
  'icon/colored/discovery_resultNode': any;
  'icon/colored/selected_resultNode': any;
  'icon/colored/blue_resultNode': any;
  'icon/colored/teal_resultNode': any;
  'icon/colored/green_resultNode': any;
  'icon/colored/yellow_resultNode': any;
  'icon/colored/orange_resultNode': any;
  'icon/colored/red_resultNode': any;
  'icon/colored/magenta_resultNode': any;
  'icon/colored/purple_resultNode': any;
  'icon/colored/gray_resultNode': any;
  'icon/neutral/default_resultNode': any;
  'icon/neutral/subtle_resultNode': any;
  'icon/neutral/on-bold_resultNode': any;
  'icon/neutral/disabled_resultNode': any;
  'data-visualisation/end-user_resultNode': any;
  'data-visualisation/product/neutral_resultNode': any;
  'data-visualisation/product/none/one-color_resultNode': any;
  'data-visualisation/product/none/primary-and-neutral_resultNode': any;
  'data-visualisation/product/none/more-than-one-color_resultNode': any;
  'data-visualisation/product/success/one-or-more_resultNode': any;
  'data-visualisation/product/success/primary-and-neutral_resultNode': any;
  'data-visualisation/product/warning/one-or-more_resultNode': any;
  'data-visualisation/product/warning/primary-and-neutral_resultNode': any;
  'data-visualisation/product/danger/one-or-more_resultNode': any;
  'data-visualisation/product/danger/primary-and-neutral_resultNode': any;
  'data-visualisation/product/discovery/one-or-more_resultNode': any;
  'data-visualisation/product/discovery/primary-and-neutral_resultNode': any;
  'data-visualisation/product/information/one-or-more_resultNode': any;
  'data-visualisation/product/information/primary-and-neutral_resultNode': any;
  'data-visualisation/product/brand/one-or-more_resultNode': any;
  'data-visualisation/product/brand/primary-and-neutral_resultNode': any;
  'opacity/disabled_resultNode': any;
  'opacity/loading_resultNode': any;
  'other/blanket/modal_resultNode': any;
  'other/blanket/deletion_resultNode': any;
  'other/blanket/selection_resultNode': any;
  'other/skeleton_resultNode': any;
  'other/skeleton/subtle_resultNode': any;
};
