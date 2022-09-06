import {
  Groups,
  OpacityToken,
  PaintToken,
  RawToken,
  ShadowToken,
} from '../../src/types';

import questions, { Questions } from './data/questions';
import results, { Results } from './data/results';

export type questionID = keyof typeof questions;
export type resultID = keyof typeof results;

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
  title?: string;
  summary: string;
  answers: Answer[];
  metadata?: {
    description?: string;
  };
}

export type Answer = {
  summary: string;
  description?: string;
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
