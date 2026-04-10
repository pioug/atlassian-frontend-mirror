export type BooleanCallback<T> = (args: T) => boolean;

export type Token = {
	token: string;
	fallback: string;
};

export type ShadowDefintion = Array<{
	radius: number;
	offset: {
		x: number;
		y: number;
	};
	color: string;
	opacity: number;
}>;
