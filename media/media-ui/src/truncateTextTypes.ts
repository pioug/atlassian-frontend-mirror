export type TruncateProps = {
	text: string;
	fontSizePX?: number;
	startFixedChars?: number;
	endFixedChars?: number;
};

export type TruncateOutput = {
	left: string;
	right: string;
};

export type TruncateStyledProps = Omit<Required<TruncateProps>, 'text'>;
