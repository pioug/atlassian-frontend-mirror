import { JQLParseError } from './jql-parse-error';

/**
 * Represents a syntax error occurring at a specific token in the parser token stream.
 *
 * This error will be constructed using the error message produced by an {@link ANTLRErrorStrategy}. As such, consumers
 * should refer to the {@link ANTLRErrorStrategy} implementation to know if the message is i18n safe and suitable to
 * display to users.
 */
export class JQLSyntaxError extends JQLParseError {
	/**
	 * The starting character position (zero-indexed) of the offending token.
	 */
	start: number;
	/**
	 * The last character position (zero-indexed) of the offending token.
	 */
	stop: number;
	/**
	 * The line number (starting from 1) in the input where the error occurred.
	 */
	line: number;
	/**
	 * The character position (zero-indexed) within that line where the error occurred.
	 */
	charPositionInLine: number;

	constructor(
		message: string,
		start: number,
		stop: number,
		line: number,
		charPositionInLine: number,
	) {
		super(message);
		this.name = 'JQLSyntaxError';
		this.start = start;
		this.stop = stop;
		this.line = line;
		this.charPositionInLine = charPositionInLine;
	}
}
