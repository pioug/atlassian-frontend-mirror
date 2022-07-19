## API Report File for "@atlaskit/quiz-widget"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

declare interface Props {
  quizContent: QuizInterface;
  score: number | null;
  correctAnswers?: QuizElement | null;
  onSubmitButtonClick?: (choosenAnswers: string[]) => void;
  onNextButtonClick?: () => void;
}

declare type QuizElement = {
  [key: number]: string;
};

declare interface QuizInterface {
  name: string;
  questions: QuizElement;
  answers: {
    [key: number]: string[];
  };
}

export declare const QuizWidget: (props: Props) => JSX.Element;

export {};
```