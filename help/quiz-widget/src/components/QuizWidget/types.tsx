export interface QuizInterface {
  name: string;
  questions: QuizElement;
  answers: { [key: number]: string[] };
}
export type QuizElement = {
  [key: number]: string;
};
