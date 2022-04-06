import questions, { Questions } from './data/questions';
import results, { Results } from './data/results';

export type questionID = keyof typeof questions;
export type resultID = keyof typeof results;

export interface Token {
  value: string;
  name: string;
  attributes: {
    group: string;
    description?: string;
    state?: string;
    replacement?: string;
  };
  original: {
    value: string;
  };
}

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
