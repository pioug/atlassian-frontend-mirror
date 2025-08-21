export interface QuizInterface {
	answers: { [key: number]: string[] };
	name: string;
	questions: QuizElement;
}
export type QuizElement = {
	[key: number]: string;
};
