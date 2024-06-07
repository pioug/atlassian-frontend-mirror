/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// Generated from JQLParser.g4 by ANTLR 4.7.3-SNAPSHOT

import { ATN } from 'antlr4ts/atn/ATN';
import { ATNDeserializer } from 'antlr4ts/atn/ATNDeserializer';
import { FailedPredicateException } from 'antlr4ts/FailedPredicateException';
import { NotNull } from 'antlr4ts/Decorators';
import { NoViableAltException } from 'antlr4ts/NoViableAltException';
import { Override } from 'antlr4ts/Decorators';
import { Parser } from 'antlr4ts/Parser';
import { ParserRuleContext } from 'antlr4ts/ParserRuleContext';
import { ParserATNSimulator } from 'antlr4ts/atn/ParserATNSimulator';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { RecognitionException } from 'antlr4ts/RecognitionException';
import { RuleContext } from 'antlr4ts/RuleContext';
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { Token } from 'antlr4ts/Token';
import { TokenStream } from 'antlr4ts/TokenStream';
import { Vocabulary } from 'antlr4ts/Vocabulary';
import { VocabularyImpl } from 'antlr4ts/VocabularyImpl';

import * as Utils from 'antlr4ts/misc/Utils';

import { JQLParserListener } from './JQLParserListener';
import { JQLParserVisitor } from './JQLParserVisitor';

export class JQLParser extends Parser {
	public static readonly LPAREN = 1;
	public static readonly RPAREN = 2;
	public static readonly COMMA = 3;
	public static readonly LBRACKET = 4;
	public static readonly RBRACKET = 5;
	public static readonly BANG = 6;
	public static readonly LT = 7;
	public static readonly GT = 8;
	public static readonly GTEQ = 9;
	public static readonly LTEQ = 10;
	public static readonly EQUALS = 11;
	public static readonly NOT_EQUALS = 12;
	public static readonly LIKE = 13;
	public static readonly NOT_LIKE = 14;
	public static readonly IN = 15;
	public static readonly IS = 16;
	public static readonly AND = 17;
	public static readonly OR = 18;
	public static readonly NOT = 19;
	public static readonly EMPTY = 20;
	public static readonly WAS = 21;
	public static readonly CHANGED = 22;
	public static readonly BEFORE = 23;
	public static readonly AFTER = 24;
	public static readonly FROM = 25;
	public static readonly TO = 26;
	public static readonly ON = 27;
	public static readonly DURING = 28;
	public static readonly ORDER = 29;
	public static readonly BY = 30;
	public static readonly ASC = 31;
	public static readonly DESC = 32;
	public static readonly POSNUMBER = 33;
	public static readonly NEGNUMBER = 34;
	public static readonly CUSTOMFIELD = 35;
	public static readonly RESERVED_WORD = 36;
	public static readonly STRING = 37;
	public static readonly MATCHWS = 38;
	public static readonly ERROR_RESERVED = 39;
	public static readonly ERRORCHAR = 40;
	public static readonly QUOTE_STRING = 41;
	public static readonly UNCLOSED_QUOTE_STRING = 42;
	public static readonly INVALID_QUOTE_STRING = 43;
	public static readonly SQUOTE_STRING = 44;
	public static readonly UNCLOSED_SQUOTE_STRING = 45;
	public static readonly INVALID_SQUOTE_STRING = 46;
	public static readonly RULE_jqlQuery = 0;
	public static readonly RULE_jqlWhere = 1;
	public static readonly RULE_jqlOrClause = 2;
	public static readonly RULE_jqlAndClause = 3;
	public static readonly RULE_jqlNotClause = 4;
	public static readonly RULE_jqlSubClause = 5;
	public static readonly RULE_jqlTerminalClause = 6;
	public static readonly RULE_jqlTerminalClauseRhs = 7;
	public static readonly RULE_jqlEqualsOperator = 8;
	public static readonly RULE_jqlLikeOperator = 9;
	public static readonly RULE_jqlComparisonOperator = 10;
	public static readonly RULE_jqlInOperator = 11;
	public static readonly RULE_jqlIsOperator = 12;
	public static readonly RULE_jqlWasOperator = 13;
	public static readonly RULE_jqlWasInOperator = 14;
	public static readonly RULE_jqlChangedOperator = 15;
	public static readonly RULE_jqlField = 16;
	public static readonly RULE_jqlFieldProperty = 17;
	public static readonly RULE_jqlCustomField = 18;
	public static readonly RULE_jqlString = 19;
	public static readonly RULE_jqlNumber = 20;
	public static readonly RULE_jqlOperand = 21;
	public static readonly RULE_jqlEmpty = 22;
	public static readonly RULE_jqlValue = 23;
	public static readonly RULE_jqlFunction = 24;
	public static readonly RULE_jqlFunctionName = 25;
	public static readonly RULE_jqlArgumentList = 26;
	public static readonly RULE_jqlList = 27;
	public static readonly RULE_jqlListStart = 28;
	public static readonly RULE_jqlListEnd = 29;
	public static readonly RULE_jqlPropertyArgument = 30;
	public static readonly RULE_jqlArgument = 31;
	public static readonly RULE_jqlWasPredicate = 32;
	public static readonly RULE_jqlChangedPredicate = 33;
	public static readonly RULE_jqlDatePredicateOperator = 34;
	public static readonly RULE_jqlDateRangePredicateOperator = 35;
	public static readonly RULE_jqlUserPredicateOperator = 36;
	public static readonly RULE_jqlValuePredicateOperator = 37;
	public static readonly RULE_jqlPredicateOperand = 38;
	public static readonly RULE_jqlOrderBy = 39;
	public static readonly RULE_jqlSearchSort = 40;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		'jqlQuery',
		'jqlWhere',
		'jqlOrClause',
		'jqlAndClause',
		'jqlNotClause',
		'jqlSubClause',
		'jqlTerminalClause',
		'jqlTerminalClauseRhs',
		'jqlEqualsOperator',
		'jqlLikeOperator',
		'jqlComparisonOperator',
		'jqlInOperator',
		'jqlIsOperator',
		'jqlWasOperator',
		'jqlWasInOperator',
		'jqlChangedOperator',
		'jqlField',
		'jqlFieldProperty',
		'jqlCustomField',
		'jqlString',
		'jqlNumber',
		'jqlOperand',
		'jqlEmpty',
		'jqlValue',
		'jqlFunction',
		'jqlFunctionName',
		'jqlArgumentList',
		'jqlList',
		'jqlListStart',
		'jqlListEnd',
		'jqlPropertyArgument',
		'jqlArgument',
		'jqlWasPredicate',
		'jqlChangedPredicate',
		'jqlDatePredicateOperator',
		'jqlDateRangePredicateOperator',
		'jqlUserPredicateOperator',
		'jqlValuePredicateOperator',
		'jqlPredicateOperand',
		'jqlOrderBy',
		'jqlSearchSort',
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined,
		"'('",
		"')'",
		"','",
		"'['",
		"']'",
		"'!'",
		"'<'",
		"'>'",
		"'>='",
		"'<='",
		"'='",
		"'!='",
		"'~'",
		"'!~'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined,
		'LPAREN',
		'RPAREN',
		'COMMA',
		'LBRACKET',
		'RBRACKET',
		'BANG',
		'LT',
		'GT',
		'GTEQ',
		'LTEQ',
		'EQUALS',
		'NOT_EQUALS',
		'LIKE',
		'NOT_LIKE',
		'IN',
		'IS',
		'AND',
		'OR',
		'NOT',
		'EMPTY',
		'WAS',
		'CHANGED',
		'BEFORE',
		'AFTER',
		'FROM',
		'TO',
		'ON',
		'DURING',
		'ORDER',
		'BY',
		'ASC',
		'DESC',
		'POSNUMBER',
		'NEGNUMBER',
		'CUSTOMFIELD',
		'RESERVED_WORD',
		'STRING',
		'MATCHWS',
		'ERROR_RESERVED',
		'ERRORCHAR',
		'QUOTE_STRING',
		'UNCLOSED_QUOTE_STRING',
		'INVALID_QUOTE_STRING',
		'SQUOTE_STRING',
		'UNCLOSED_SQUOTE_STRING',
		'INVALID_SQUOTE_STRING',
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(
		JQLParser._LITERAL_NAMES,
		JQLParser._SYMBOLIC_NAMES,
		[],
	);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return JQLParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string {
		return 'JQLParser.g4';
	}

	// @Override
	public get ruleNames(): string[] {
		return JQLParser.ruleNames;
	}

	// @Override
	public get serializedATN(): string {
		return JQLParser._serializedATN;
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(JQLParser._ATN, this);
	}
	// @RuleVersion(0)
	public jqlQuery(): JqlQueryContext {
		let _localctx: JqlQueryContext = new JqlQueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, JQLParser.RULE_jqlQuery);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 83;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (
					((_la & ~0x1f) === 0 &&
						((1 << _la) &
							((1 << JQLParser.LPAREN) | (1 << JQLParser.BANG) | (1 << JQLParser.NOT))) !==
							0) ||
					(((_la - 33) & ~0x1f) === 0 &&
						((1 << (_la - 33)) &
							((1 << (JQLParser.POSNUMBER - 33)) |
								(1 << (JQLParser.NEGNUMBER - 33)) |
								(1 << (JQLParser.CUSTOMFIELD - 33)) |
								(1 << (JQLParser.STRING - 33)) |
								(1 << (JQLParser.QUOTE_STRING - 33)) |
								(1 << (JQLParser.SQUOTE_STRING - 33)))) !==
							0)
				) {
					{
						this.state = 82;
						this.jqlWhere();
					}
				}

				this.state = 86;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JQLParser.ORDER) {
					{
						this.state = 85;
						this.jqlOrderBy();
					}
				}

				this.state = 88;
				this.match(JQLParser.EOF);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlWhere(): JqlWhereContext {
		let _localctx: JqlWhereContext = new JqlWhereContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, JQLParser.RULE_jqlWhere);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 90;
				this.jqlOrClause();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlOrClause(): JqlOrClauseContext {
		let _localctx: JqlOrClauseContext = new JqlOrClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, JQLParser.RULE_jqlOrClause);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 92;
				this.jqlAndClause();
				this.state = 97;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JQLParser.OR) {
					{
						{
							this.state = 93;
							this.match(JQLParser.OR);
							this.state = 94;
							this.jqlAndClause();
						}
					}
					this.state = 99;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlAndClause(): JqlAndClauseContext {
		let _localctx: JqlAndClauseContext = new JqlAndClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, JQLParser.RULE_jqlAndClause);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 100;
				this.jqlNotClause();
				this.state = 105;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JQLParser.AND) {
					{
						{
							this.state = 101;
							this.match(JQLParser.AND);
							this.state = 102;
							this.jqlNotClause();
						}
					}
					this.state = 107;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlNotClause(): JqlNotClauseContext {
		let _localctx: JqlNotClauseContext = new JqlNotClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, JQLParser.RULE_jqlNotClause);
		let _la: number;
		try {
			this.state = 112;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.BANG:
				case JQLParser.NOT:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 108;
						_la = this._input.LA(1);
						if (!(_la === JQLParser.BANG || _la === JQLParser.NOT)) {
							this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 109;
						this.jqlNotClause();
					}
					break;
				case JQLParser.LPAREN:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 110;
						this.jqlSubClause();
					}
					break;
				case JQLParser.POSNUMBER:
				case JQLParser.NEGNUMBER:
				case JQLParser.CUSTOMFIELD:
				case JQLParser.STRING:
				case JQLParser.QUOTE_STRING:
				case JQLParser.SQUOTE_STRING:
					this.enterOuterAlt(_localctx, 3);
					{
						this.state = 111;
						this.jqlTerminalClause();
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlSubClause(): JqlSubClauseContext {
		let _localctx: JqlSubClauseContext = new JqlSubClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, JQLParser.RULE_jqlSubClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 114;
				this.match(JQLParser.LPAREN);
				this.state = 115;
				this.jqlOrClause();
				this.state = 116;
				this.match(JQLParser.RPAREN);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlTerminalClause(): JqlTerminalClauseContext {
		let _localctx: JqlTerminalClauseContext = new JqlTerminalClauseContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, JQLParser.RULE_jqlTerminalClause);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 118;
				this.jqlField();
				this.state = 119;
				this.jqlTerminalClauseRhs();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlTerminalClauseRhs(): JqlTerminalClauseRhsContext {
		let _localctx: JqlTerminalClauseRhsContext = new JqlTerminalClauseRhsContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 14, JQLParser.RULE_jqlTerminalClauseRhs);
		let _la: number;
		try {
			this.state = 176;
			this._errHandler.sync(this);
			switch (this.interpreter.adaptivePredict(this._input, 14, this._ctx)) {
				case 1:
					_localctx = new JqlEqualsClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 121;
						this.jqlEqualsOperator();
						this.state = 125;
						this._errHandler.sync(this);
						switch (this.interpreter.adaptivePredict(this._input, 5, this._ctx)) {
							case 1:
								{
									this.state = 122;
									this.jqlEmpty();
								}
								break;

							case 2:
								{
									this.state = 123;
									this.jqlValue();
								}
								break;

							case 3:
								{
									this.state = 124;
									this.jqlFunction();
								}
								break;
						}
					}
					break;

				case 2:
					_localctx = new JqlLikeClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 127;
						this.jqlLikeOperator();
						this.state = 131;
						this._errHandler.sync(this);
						switch (this.interpreter.adaptivePredict(this._input, 6, this._ctx)) {
							case 1:
								{
									this.state = 128;
									this.jqlEmpty();
								}
								break;

							case 2:
								{
									this.state = 129;
									this.jqlValue();
								}
								break;

							case 3:
								{
									this.state = 130;
									this.jqlFunction();
								}
								break;
						}
					}
					break;

				case 3:
					_localctx = new JqlComparisonClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 3);
					{
						this.state = 133;
						this.jqlComparisonOperator();
						this.state = 136;
						this._errHandler.sync(this);
						switch (this.interpreter.adaptivePredict(this._input, 7, this._ctx)) {
							case 1:
								{
									this.state = 134;
									this.jqlValue();
								}
								break;

							case 2:
								{
									this.state = 135;
									this.jqlFunction();
								}
								break;
						}
					}
					break;

				case 4:
					_localctx = new JqlInClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 4);
					{
						this.state = 138;
						this.jqlInOperator();
						this.state = 141;
						this._errHandler.sync(this);
						switch (this._input.LA(1)) {
							case JQLParser.LPAREN:
								{
									this.state = 139;
									this.jqlList();
								}
								break;
							case JQLParser.POSNUMBER:
							case JQLParser.NEGNUMBER:
							case JQLParser.STRING:
							case JQLParser.QUOTE_STRING:
							case JQLParser.SQUOTE_STRING:
								{
									this.state = 140;
									this.jqlFunction();
								}
								break;
							default:
								throw new NoViableAltException(this);
						}
					}
					break;

				case 5:
					_localctx = new JqlIsClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 5);
					{
						this.state = 143;
						this.jqlIsOperator();
						this.state = 144;
						this.jqlEmpty();
					}
					break;

				case 6:
					_localctx = new JqlWasClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 6);
					{
						this.state = 146;
						this.jqlWasOperator();
						this.state = 150;
						this._errHandler.sync(this);
						switch (this.interpreter.adaptivePredict(this._input, 9, this._ctx)) {
							case 1:
								{
									this.state = 147;
									this.jqlEmpty();
								}
								break;

							case 2:
								{
									this.state = 148;
									this.jqlValue();
								}
								break;

							case 3:
								{
									this.state = 149;
									this.jqlFunction();
								}
								break;
						}
						this.state = 155;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (
							(_la & ~0x1f) === 0 &&
							((1 << _la) &
								((1 << JQLParser.BEFORE) |
									(1 << JQLParser.AFTER) |
									(1 << JQLParser.ON) |
									(1 << JQLParser.DURING) |
									(1 << JQLParser.BY))) !==
								0
						) {
							{
								{
									this.state = 152;
									this.jqlWasPredicate();
								}
							}
							this.state = 157;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
					}
					break;

				case 7:
					_localctx = new JqlWasInClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 7);
					{
						this.state = 158;
						this.jqlWasInOperator();
						this.state = 161;
						this._errHandler.sync(this);
						switch (this._input.LA(1)) {
							case JQLParser.LPAREN:
								{
									this.state = 159;
									this.jqlList();
								}
								break;
							case JQLParser.POSNUMBER:
							case JQLParser.NEGNUMBER:
							case JQLParser.STRING:
							case JQLParser.QUOTE_STRING:
							case JQLParser.SQUOTE_STRING:
								{
									this.state = 160;
									this.jqlFunction();
								}
								break;
							default:
								throw new NoViableAltException(this);
						}
						this.state = 166;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (
							(_la & ~0x1f) === 0 &&
							((1 << _la) &
								((1 << JQLParser.BEFORE) |
									(1 << JQLParser.AFTER) |
									(1 << JQLParser.ON) |
									(1 << JQLParser.DURING) |
									(1 << JQLParser.BY))) !==
								0
						) {
							{
								{
									this.state = 163;
									this.jqlWasPredicate();
								}
							}
							this.state = 168;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
					}
					break;

				case 8:
					_localctx = new JqlChangedClauseContext(_localctx);
					this.enterOuterAlt(_localctx, 8);
					{
						this.state = 169;
						this.jqlChangedOperator();
						this.state = 173;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						while (
							(_la & ~0x1f) === 0 &&
							((1 << _la) &
								((1 << JQLParser.BEFORE) |
									(1 << JQLParser.AFTER) |
									(1 << JQLParser.FROM) |
									(1 << JQLParser.TO) |
									(1 << JQLParser.ON) |
									(1 << JQLParser.DURING) |
									(1 << JQLParser.BY))) !==
								0
						) {
							{
								{
									this.state = 170;
									this.jqlChangedPredicate();
								}
							}
							this.state = 175;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						}
					}
					break;
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlEqualsOperator(): JqlEqualsOperatorContext {
		let _localctx: JqlEqualsOperatorContext = new JqlEqualsOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, JQLParser.RULE_jqlEqualsOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 178;
				_la = this._input.LA(1);
				if (!(_la === JQLParser.EQUALS || _la === JQLParser.NOT_EQUALS)) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlLikeOperator(): JqlLikeOperatorContext {
		let _localctx: JqlLikeOperatorContext = new JqlLikeOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, JQLParser.RULE_jqlLikeOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 180;
				_la = this._input.LA(1);
				if (!(_la === JQLParser.LIKE || _la === JQLParser.NOT_LIKE)) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlComparisonOperator(): JqlComparisonOperatorContext {
		let _localctx: JqlComparisonOperatorContext = new JqlComparisonOperatorContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 20, JQLParser.RULE_jqlComparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 182;
				_la = this._input.LA(1);
				if (
					!(
						(_la & ~0x1f) === 0 &&
						((1 << _la) &
							((1 << JQLParser.LT) |
								(1 << JQLParser.GT) |
								(1 << JQLParser.GTEQ) |
								(1 << JQLParser.LTEQ))) !==
							0
					)
				) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlInOperator(): JqlInOperatorContext {
		let _localctx: JqlInOperatorContext = new JqlInOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, JQLParser.RULE_jqlInOperator);
		try {
			this.state = 187;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.IN:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 184;
						this.match(JQLParser.IN);
					}
					break;
				case JQLParser.NOT:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 185;
						this.match(JQLParser.NOT);
						this.state = 186;
						this.match(JQLParser.IN);
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlIsOperator(): JqlIsOperatorContext {
		let _localctx: JqlIsOperatorContext = new JqlIsOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, JQLParser.RULE_jqlIsOperator);
		try {
			this.state = 192;
			this._errHandler.sync(this);
			switch (this.interpreter.adaptivePredict(this._input, 16, this._ctx)) {
				case 1:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 189;
						this.match(JQLParser.IS);
					}
					break;

				case 2:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 190;
						this.match(JQLParser.IS);
						this.state = 191;
						this.match(JQLParser.NOT);
					}
					break;
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlWasOperator(): JqlWasOperatorContext {
		let _localctx: JqlWasOperatorContext = new JqlWasOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, JQLParser.RULE_jqlWasOperator);
		try {
			this.state = 197;
			this._errHandler.sync(this);
			switch (this.interpreter.adaptivePredict(this._input, 17, this._ctx)) {
				case 1:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 194;
						this.match(JQLParser.WAS);
					}
					break;

				case 2:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 195;
						this.match(JQLParser.WAS);
						this.state = 196;
						this.match(JQLParser.NOT);
					}
					break;
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlWasInOperator(): JqlWasInOperatorContext {
		let _localctx: JqlWasInOperatorContext = new JqlWasInOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, JQLParser.RULE_jqlWasInOperator);
		try {
			this.state = 204;
			this._errHandler.sync(this);
			switch (this.interpreter.adaptivePredict(this._input, 18, this._ctx)) {
				case 1:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 199;
						this.match(JQLParser.WAS);
						this.state = 200;
						this.match(JQLParser.IN);
					}
					break;

				case 2:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 201;
						this.match(JQLParser.WAS);
						this.state = 202;
						this.match(JQLParser.NOT);
						this.state = 203;
						this.match(JQLParser.IN);
					}
					break;
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlChangedOperator(): JqlChangedOperatorContext {
		let _localctx: JqlChangedOperatorContext = new JqlChangedOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, JQLParser.RULE_jqlChangedOperator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 206;
				this.match(JQLParser.CHANGED);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlField(): JqlFieldContext {
		let _localctx: JqlFieldContext = new JqlFieldContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, JQLParser.RULE_jqlField);
		let _la: number;
		try {
			this.state = 219;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.POSNUMBER:
				case JQLParser.NEGNUMBER:
					_localctx = new JqlNumberFieldContext(_localctx);
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 208;
						this.jqlNumber();
					}
					break;
				case JQLParser.CUSTOMFIELD:
				case JQLParser.STRING:
				case JQLParser.QUOTE_STRING:
				case JQLParser.SQUOTE_STRING:
					_localctx = new JqlNonNumberFieldContext(_localctx);
					this.enterOuterAlt(_localctx, 2);
					{
						{
							this.state = 211;
							this._errHandler.sync(this);
							switch (this._input.LA(1)) {
								case JQLParser.STRING:
								case JQLParser.QUOTE_STRING:
								case JQLParser.SQUOTE_STRING:
									{
										this.state = 209;
										this.jqlString();
									}
									break;
								case JQLParser.CUSTOMFIELD:
									{
										this.state = 210;
										this.jqlCustomField();
									}
									break;
								default:
									throw new NoViableAltException(this);
							}
							this.state = 216;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
							while (_la === JQLParser.LBRACKET) {
								{
									{
										this.state = 213;
										this.jqlFieldProperty();
									}
								}
								this.state = 218;
								this._errHandler.sync(this);
								_la = this._input.LA(1);
							}
						}
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlFieldProperty(): JqlFieldPropertyContext {
		let _localctx: JqlFieldPropertyContext = new JqlFieldPropertyContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, JQLParser.RULE_jqlFieldProperty);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				{
					this.state = 221;
					this.match(JQLParser.LBRACKET);
					{
						this.state = 222;
						this.jqlArgument();
					}
					this.state = 223;
					this.match(JQLParser.RBRACKET);
				}
				this.state = 228;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (
					((_la - 33) & ~0x1f) === 0 &&
					((1 << (_la - 33)) &
						((1 << (JQLParser.POSNUMBER - 33)) |
							(1 << (JQLParser.NEGNUMBER - 33)) |
							(1 << (JQLParser.STRING - 33)) |
							(1 << (JQLParser.QUOTE_STRING - 33)) |
							(1 << (JQLParser.SQUOTE_STRING - 33)))) !==
						0
				) {
					{
						{
							this.state = 225;
							this.jqlPropertyArgument();
						}
					}
					this.state = 230;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlCustomField(): JqlCustomFieldContext {
		let _localctx: JqlCustomFieldContext = new JqlCustomFieldContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, JQLParser.RULE_jqlCustomField);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 231;
				this.match(JQLParser.CUSTOMFIELD);
				this.state = 232;
				this.match(JQLParser.LBRACKET);
				this.state = 233;
				this.match(JQLParser.POSNUMBER);
				this.state = 234;
				this.match(JQLParser.RBRACKET);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlString(): JqlStringContext {
		let _localctx: JqlStringContext = new JqlStringContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, JQLParser.RULE_jqlString);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 236;
				_la = this._input.LA(1);
				if (
					!(
						((_la - 37) & ~0x1f) === 0 &&
						((1 << (_la - 37)) &
							((1 << (JQLParser.STRING - 37)) |
								(1 << (JQLParser.QUOTE_STRING - 37)) |
								(1 << (JQLParser.SQUOTE_STRING - 37)))) !==
							0
					)
				) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlNumber(): JqlNumberContext {
		let _localctx: JqlNumberContext = new JqlNumberContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, JQLParser.RULE_jqlNumber);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 238;
				_localctx._jqlNum = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(_la === JQLParser.POSNUMBER || _la === JQLParser.NEGNUMBER)) {
					_localctx._jqlNum = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlOperand(): JqlOperandContext {
		let _localctx: JqlOperandContext = new JqlOperandContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, JQLParser.RULE_jqlOperand);
		try {
			this.state = 244;
			this._errHandler.sync(this);
			switch (this.interpreter.adaptivePredict(this._input, 23, this._ctx)) {
				case 1:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 240;
						this.jqlEmpty();
					}
					break;

				case 2:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 241;
						this.jqlValue();
					}
					break;

				case 3:
					this.enterOuterAlt(_localctx, 3);
					{
						this.state = 242;
						this.jqlFunction();
					}
					break;

				case 4:
					this.enterOuterAlt(_localctx, 4);
					{
						this.state = 243;
						this.jqlList();
					}
					break;
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlEmpty(): JqlEmptyContext {
		let _localctx: JqlEmptyContext = new JqlEmptyContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, JQLParser.RULE_jqlEmpty);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 246;
				this.match(JQLParser.EMPTY);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlValue(): JqlValueContext {
		let _localctx: JqlValueContext = new JqlValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, JQLParser.RULE_jqlValue);
		try {
			this.state = 250;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.STRING:
				case JQLParser.QUOTE_STRING:
				case JQLParser.SQUOTE_STRING:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 248;
						this.jqlString();
					}
					break;
				case JQLParser.POSNUMBER:
				case JQLParser.NEGNUMBER:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 249;
						this.jqlNumber();
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlFunction(): JqlFunctionContext {
		let _localctx: JqlFunctionContext = new JqlFunctionContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, JQLParser.RULE_jqlFunction);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 252;
				this.jqlFunctionName();
				this.state = 253;
				this.match(JQLParser.LPAREN);
				this.state = 255;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (
					((_la - 33) & ~0x1f) === 0 &&
					((1 << (_la - 33)) &
						((1 << (JQLParser.POSNUMBER - 33)) |
							(1 << (JQLParser.NEGNUMBER - 33)) |
							(1 << (JQLParser.STRING - 33)) |
							(1 << (JQLParser.QUOTE_STRING - 33)) |
							(1 << (JQLParser.SQUOTE_STRING - 33)))) !==
						0
				) {
					{
						this.state = 254;
						this.jqlArgumentList();
					}
				}

				this.state = 257;
				this.match(JQLParser.RPAREN);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlFunctionName(): JqlFunctionNameContext {
		let _localctx: JqlFunctionNameContext = new JqlFunctionNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, JQLParser.RULE_jqlFunctionName);
		try {
			this.state = 261;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.STRING:
				case JQLParser.QUOTE_STRING:
				case JQLParser.SQUOTE_STRING:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 259;
						this.jqlString();
					}
					break;
				case JQLParser.POSNUMBER:
				case JQLParser.NEGNUMBER:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 260;
						this.jqlNumber();
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlArgumentList(): JqlArgumentListContext {
		let _localctx: JqlArgumentListContext = new JqlArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, JQLParser.RULE_jqlArgumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 263;
				this.jqlArgument();
				this.state = 268;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JQLParser.COMMA) {
					{
						{
							this.state = 264;
							this.match(JQLParser.COMMA);
							this.state = 265;
							this.jqlArgument();
						}
					}
					this.state = 270;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlList(): JqlListContext {
		let _localctx: JqlListContext = new JqlListContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, JQLParser.RULE_jqlList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 271;
				this.jqlListStart();
				this.state = 272;
				this.jqlOperand();
				this.state = 277;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JQLParser.COMMA) {
					{
						{
							this.state = 273;
							this.match(JQLParser.COMMA);
							this.state = 274;
							this.jqlOperand();
						}
					}
					this.state = 279;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 280;
				this.jqlListEnd();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlListStart(): JqlListStartContext {
		let _localctx: JqlListStartContext = new JqlListStartContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, JQLParser.RULE_jqlListStart);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 282;
				this.match(JQLParser.LPAREN);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlListEnd(): JqlListEndContext {
		let _localctx: JqlListEndContext = new JqlListEndContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, JQLParser.RULE_jqlListEnd);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 284;
				this.match(JQLParser.RPAREN);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlPropertyArgument(): JqlPropertyArgumentContext {
		let _localctx: JqlPropertyArgumentContext = new JqlPropertyArgumentContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 60, JQLParser.RULE_jqlPropertyArgument);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 286;
				this.jqlArgument();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlArgument(): JqlArgumentContext {
		let _localctx: JqlArgumentContext = new JqlArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, JQLParser.RULE_jqlArgument);
		try {
			this.state = 290;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
				case JQLParser.STRING:
				case JQLParser.QUOTE_STRING:
				case JQLParser.SQUOTE_STRING:
					this.enterOuterAlt(_localctx, 1);
					{
						this.state = 288;
						this.jqlString();
					}
					break;
				case JQLParser.POSNUMBER:
				case JQLParser.NEGNUMBER:
					this.enterOuterAlt(_localctx, 2);
					{
						this.state = 289;
						this.jqlNumber();
					}
					break;
				default:
					throw new NoViableAltException(this);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlWasPredicate(): JqlWasPredicateContext {
		let _localctx: JqlWasPredicateContext = new JqlWasPredicateContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, JQLParser.RULE_jqlWasPredicate);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 295;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
					case JQLParser.BEFORE:
					case JQLParser.AFTER:
					case JQLParser.ON:
						{
							this.state = 292;
							this.jqlDatePredicateOperator();
						}
						break;
					case JQLParser.DURING:
						{
							this.state = 293;
							this.jqlDateRangePredicateOperator();
						}
						break;
					case JQLParser.BY:
						{
							this.state = 294;
							this.jqlUserPredicateOperator();
						}
						break;
					default:
						throw new NoViableAltException(this);
				}
				this.state = 297;
				this.jqlPredicateOperand();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlChangedPredicate(): JqlChangedPredicateContext {
		let _localctx: JqlChangedPredicateContext = new JqlChangedPredicateContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 66, JQLParser.RULE_jqlChangedPredicate);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 303;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
					case JQLParser.BEFORE:
					case JQLParser.AFTER:
					case JQLParser.ON:
						{
							this.state = 299;
							this.jqlDatePredicateOperator();
						}
						break;
					case JQLParser.DURING:
						{
							this.state = 300;
							this.jqlDateRangePredicateOperator();
						}
						break;
					case JQLParser.BY:
						{
							this.state = 301;
							this.jqlUserPredicateOperator();
						}
						break;
					case JQLParser.FROM:
					case JQLParser.TO:
						{
							this.state = 302;
							this.jqlValuePredicateOperator();
						}
						break;
					default:
						throw new NoViableAltException(this);
				}
				this.state = 305;
				this.jqlPredicateOperand();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlDatePredicateOperator(): JqlDatePredicateOperatorContext {
		let _localctx: JqlDatePredicateOperatorContext = new JqlDatePredicateOperatorContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 68, JQLParser.RULE_jqlDatePredicateOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 307;
				_la = this._input.LA(1);
				if (
					!(
						(_la & ~0x1f) === 0 &&
						((1 << _la) &
							((1 << JQLParser.BEFORE) | (1 << JQLParser.AFTER) | (1 << JQLParser.ON))) !==
							0
					)
				) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlDateRangePredicateOperator(): JqlDateRangePredicateOperatorContext {
		let _localctx: JqlDateRangePredicateOperatorContext = new JqlDateRangePredicateOperatorContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 70, JQLParser.RULE_jqlDateRangePredicateOperator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 309;
				this.match(JQLParser.DURING);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlUserPredicateOperator(): JqlUserPredicateOperatorContext {
		let _localctx: JqlUserPredicateOperatorContext = new JqlUserPredicateOperatorContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 72, JQLParser.RULE_jqlUserPredicateOperator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 311;
				this.match(JQLParser.BY);
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlValuePredicateOperator(): JqlValuePredicateOperatorContext {
		let _localctx: JqlValuePredicateOperatorContext = new JqlValuePredicateOperatorContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 74, JQLParser.RULE_jqlValuePredicateOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 313;
				_la = this._input.LA(1);
				if (!(_la === JQLParser.FROM || _la === JQLParser.TO)) {
					this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlPredicateOperand(): JqlPredicateOperandContext {
		let _localctx: JqlPredicateOperandContext = new JqlPredicateOperandContext(
			this._ctx,
			this.state,
		);
		this.enterRule(_localctx, 76, JQLParser.RULE_jqlPredicateOperand);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 315;
				this.jqlOperand();
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlOrderBy(): JqlOrderByContext {
		let _localctx: JqlOrderByContext = new JqlOrderByContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, JQLParser.RULE_jqlOrderBy);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 317;
				this.match(JQLParser.ORDER);
				this.state = 318;
				this.match(JQLParser.BY);
				this.state = 319;
				this.jqlSearchSort();
				this.state = 324;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === JQLParser.COMMA) {
					{
						{
							this.state = 320;
							this.match(JQLParser.COMMA);
							this.state = 321;
							this.jqlSearchSort();
						}
					}
					this.state = 326;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jqlSearchSort(): JqlSearchSortContext {
		let _localctx: JqlSearchSortContext = new JqlSearchSortContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, JQLParser.RULE_jqlSearchSort);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
				this.state = 327;
				this.jqlField();
				this.state = 329;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === JQLParser.ASC || _la === JQLParser.DESC) {
					{
						this.state = 328;
						_la = this._input.LA(1);
						if (!(_la === JQLParser.ASC || _la === JQLParser.DESC)) {
							this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
					}
				}
			}
		} catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		} finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		'\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x030\u014E\x04\x02' +
		'\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07' +
		'\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04' +
		'\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04' +
		'\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04' +
		'\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04' +
		'\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04"\t"\x04#' +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04'\t'\x04(\t(\x04)\t)\x04*\t*\x03\x02" +
		'\x05\x02V\n\x02\x03\x02\x05\x02Y\n\x02\x03\x02\x03\x02\x03\x03\x03\x03' +
		'\x03\x04\x03\x04\x03\x04\x07\x04b\n\x04\f\x04\x0E\x04e\v\x04\x03\x05\x03' +
		'\x05\x03\x05\x07\x05j\n\x05\f\x05\x0E\x05m\v\x05\x03\x06\x03\x06\x03\x06' +
		'\x03\x06\x05\x06s\n\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\b\x03\b\x03' +
		'\b\x03\t\x03\t\x03\t\x03\t\x05\t\x80\n\t\x03\t\x03\t\x03\t\x03\t\x05\t' +
		'\x86\n\t\x03\t\x03\t\x03\t\x05\t\x8B\n\t\x03\t\x03\t\x03\t\x05\t\x90\n' +
		'\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\x99\n\t\x03\t\x07\t' +
		'\x9C\n\t\f\t\x0E\t\x9F\v\t\x03\t\x03\t\x03\t\x05\t\xA4\n\t\x03\t\x07\t' +
		'\xA7\n\t\f\t\x0E\t\xAA\v\t\x03\t\x03\t\x07\t\xAE\n\t\f\t\x0E\t\xB1\v\t' +
		'\x05\t\xB3\n\t\x03\n\x03\n\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r\x03\r\x05' +
		'\r\xBE\n\r\x03\x0E\x03\x0E\x03\x0E\x05\x0E\xC3\n\x0E\x03\x0F\x03\x0F\x03' +
		'\x0F\x05\x0F\xC8\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x05\x10' +
		'\xCF\n\x10\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x05\x12\xD6\n\x12\x03' +
		'\x12\x07\x12\xD9\n\x12\f\x12\x0E\x12\xDC\v\x12\x05\x12\xDE\n\x12\x03\x13' +
		'\x03\x13\x03\x13\x03\x13\x03\x13\x07\x13\xE5\n\x13\f\x13\x0E\x13\xE8\v' +
		'\x13\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x16\x03' +
		'\x16\x03\x17\x03\x17\x03\x17\x03\x17\x05\x17\xF7\n\x17\x03\x18\x03\x18' +
		'\x03\x19\x03\x19\x05\x19\xFD\n\x19\x03\x1A\x03\x1A\x03\x1A\x05\x1A\u0102' +
		'\n\x1A\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x05\x1B\u0108\n\x1B\x03\x1C\x03' +
		'\x1C\x03\x1C\x07\x1C\u010D\n\x1C\f\x1C\x0E\x1C\u0110\v\x1C\x03\x1D\x03' +
		'\x1D\x03\x1D\x03\x1D\x07\x1D\u0116\n\x1D\f\x1D\x0E\x1D\u0119\v\x1D\x03' +
		'\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03 \x03 \x03!\x03!\x05!' +
		'\u0125\n!\x03"\x03"\x03"\x05"\u012A\n"\x03"\x03"\x03#\x03#\x03' +
		"#\x03#\x05#\u0132\n#\x03#\x03#\x03$\x03$\x03%\x03%\x03&\x03&\x03'\x03" +
		"'\x03(\x03(\x03)\x03)\x03)\x03)\x03)\x07)\u0145\n)\f)\x0E)\u0148\v)\x03" +
		'*\x03*\x05*\u014C\n*\x03*\x02\x02\x02+\x02\x02\x04\x02\x06\x02\b\x02\n' +
		'\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C' +
		'\x02\x1E\x02 \x02"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026' +
		'\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02' +
		'R\x02\x02\v\x04\x02\b\b\x15\x15\x03\x02\r\x0E\x03\x02\x0F\x10\x03\x02' +
		"\t\f\x05\x02''++..\x03\x02#$\x04\x02\x19\x1A\x1D\x1D\x03\x02\x1B\x1C" +
		'\x03\x02!"\x02\u0155\x02U\x03\x02\x02\x02\x04\\\x03\x02\x02\x02\x06^' +
		'\x03\x02\x02\x02\bf\x03\x02\x02\x02\nr\x03\x02\x02\x02\ft\x03\x02\x02' +
		'\x02\x0Ex\x03\x02\x02\x02\x10\xB2\x03\x02\x02\x02\x12\xB4\x03\x02\x02' +
		'\x02\x14\xB6\x03\x02\x02\x02\x16\xB8\x03\x02\x02\x02\x18\xBD\x03\x02\x02' +
		'\x02\x1A\xC2\x03\x02\x02\x02\x1C\xC7\x03\x02\x02\x02\x1E\xCE\x03\x02\x02' +
		'\x02 \xD0\x03\x02\x02\x02"\xDD\x03\x02\x02\x02$\xDF\x03\x02\x02\x02&' +
		'\xE9\x03\x02\x02\x02(\xEE\x03\x02\x02\x02*\xF0\x03\x02\x02\x02,\xF6\x03' +
		'\x02\x02\x02.\xF8\x03\x02\x02\x020\xFC\x03\x02\x02\x022\xFE\x03\x02\x02' +
		'\x024\u0107\x03\x02\x02\x026\u0109\x03\x02\x02\x028\u0111\x03\x02\x02' +
		'\x02:\u011C\x03\x02\x02\x02<\u011E\x03\x02\x02\x02>\u0120\x03\x02\x02' +
		'\x02@\u0124\x03\x02\x02\x02B\u0129\x03\x02\x02\x02D\u0131\x03\x02\x02' +
		'\x02F\u0135\x03\x02\x02\x02H\u0137\x03\x02\x02\x02J\u0139\x03\x02\x02' +
		'\x02L\u013B\x03\x02\x02\x02N\u013D\x03\x02\x02\x02P\u013F\x03\x02\x02' +
		'\x02R\u0149\x03\x02\x02\x02TV\x05\x04\x03\x02UT\x03\x02\x02\x02UV\x03' +
		'\x02\x02\x02VX\x03\x02\x02\x02WY\x05P)\x02XW\x03\x02\x02\x02XY\x03\x02' +
		'\x02\x02YZ\x03\x02\x02\x02Z[\x07\x02\x02\x03[\x03\x03\x02\x02\x02\\]\x05' +
		'\x06\x04\x02]\x05\x03\x02\x02\x02^c\x05\b\x05\x02_`\x07\x14\x02\x02`b' +
		'\x05\b\x05\x02a_\x03\x02\x02\x02be\x03\x02\x02\x02ca\x03\x02\x02\x02c' +
		'd\x03\x02\x02\x02d\x07\x03\x02\x02\x02ec\x03\x02\x02\x02fk\x05\n\x06\x02' +
		'gh\x07\x13\x02\x02hj\x05\n\x06\x02ig\x03\x02\x02\x02jm\x03\x02\x02\x02' +
		'ki\x03\x02\x02\x02kl\x03\x02\x02\x02l\t\x03\x02\x02\x02mk\x03\x02\x02' +
		'\x02no\t\x02\x02\x02os\x05\n\x06\x02ps\x05\f\x07\x02qs\x05\x0E\b\x02r' +
		'n\x03\x02\x02\x02rp\x03\x02\x02\x02rq\x03\x02\x02\x02s\v\x03\x02\x02\x02' +
		'tu\x07\x03\x02\x02uv\x05\x06\x04\x02vw\x07\x04\x02\x02w\r\x03\x02\x02' +
		'\x02xy\x05"\x12\x02yz\x05\x10\t\x02z\x0F\x03\x02\x02\x02{\x7F\x05\x12' +
		'\n\x02|\x80\x05.\x18\x02}\x80\x050\x19\x02~\x80\x052\x1A\x02\x7F|\x03' +
		'\x02\x02\x02\x7F}\x03\x02\x02\x02\x7F~\x03\x02\x02\x02\x80\xB3\x03\x02' +
		'\x02\x02\x81\x85\x05\x14\v\x02\x82\x86\x05.\x18\x02\x83\x86\x050\x19\x02' +
		'\x84\x86\x052\x1A\x02\x85\x82\x03\x02\x02\x02\x85\x83\x03\x02\x02\x02' +
		'\x85\x84\x03\x02\x02\x02\x86\xB3\x03\x02\x02\x02\x87\x8A\x05\x16\f\x02' +
		'\x88\x8B\x050\x19\x02\x89\x8B\x052\x1A\x02\x8A\x88\x03\x02\x02\x02\x8A' +
		'\x89\x03\x02\x02\x02\x8B\xB3\x03\x02\x02\x02\x8C\x8F\x05\x18\r\x02\x8D' +
		'\x90\x058\x1D\x02\x8E\x90\x052\x1A\x02\x8F\x8D\x03\x02\x02\x02\x8F\x8E' +
		'\x03\x02\x02\x02\x90\xB3\x03\x02\x02\x02\x91\x92\x05\x1A\x0E\x02\x92\x93' +
		'\x05.\x18\x02\x93\xB3\x03\x02\x02\x02\x94\x98\x05\x1C\x0F\x02\x95\x99' +
		'\x05.\x18\x02\x96\x99\x050\x19\x02\x97\x99\x052\x1A\x02\x98\x95\x03\x02' +
		'\x02\x02\x98\x96\x03\x02\x02\x02\x98\x97\x03\x02\x02\x02\x99\x9D\x03\x02' +
		'\x02\x02\x9A\x9C\x05B"\x02\x9B\x9A\x03\x02\x02\x02\x9C\x9F\x03\x02\x02' +
		'\x02\x9D\x9B\x03\x02\x02\x02\x9D\x9E\x03\x02\x02\x02\x9E\xB3\x03\x02\x02' +
		'\x02\x9F\x9D\x03\x02\x02\x02\xA0\xA3\x05\x1E\x10\x02\xA1\xA4\x058\x1D' +
		'\x02\xA2\xA4\x052\x1A\x02\xA3\xA1\x03\x02\x02\x02\xA3\xA2\x03\x02\x02' +
		'\x02\xA4\xA8\x03\x02\x02\x02\xA5\xA7\x05B"\x02\xA6\xA5\x03\x02\x02\x02' +
		'\xA7\xAA\x03\x02\x02\x02\xA8\xA6\x03\x02\x02\x02\xA8\xA9\x03\x02\x02\x02' +
		'\xA9\xB3\x03\x02\x02\x02\xAA\xA8\x03\x02\x02\x02\xAB\xAF\x05 \x11\x02' +
		'\xAC\xAE\x05D#\x02\xAD\xAC\x03\x02\x02\x02\xAE\xB1\x03\x02\x02\x02\xAF' +
		'\xAD\x03\x02\x02\x02\xAF\xB0\x03\x02\x02\x02\xB0\xB3\x03\x02\x02\x02\xB1' +
		'\xAF\x03\x02\x02\x02\xB2{\x03\x02\x02\x02\xB2\x81\x03\x02\x02\x02\xB2' +
		'\x87\x03\x02\x02\x02\xB2\x8C\x03\x02\x02\x02\xB2\x91\x03\x02\x02\x02\xB2' +
		'\x94\x03\x02\x02\x02\xB2\xA0\x03\x02\x02\x02\xB2\xAB\x03\x02\x02\x02\xB3' +
		'\x11\x03\x02\x02\x02\xB4\xB5\t\x03\x02\x02\xB5\x13\x03\x02\x02\x02\xB6' +
		'\xB7\t\x04\x02\x02\xB7\x15\x03\x02\x02\x02\xB8\xB9\t\x05\x02\x02\xB9\x17' +
		'\x03\x02\x02\x02\xBA\xBE\x07\x11\x02\x02\xBB\xBC\x07\x15\x02\x02\xBC\xBE' +
		'\x07\x11\x02\x02\xBD\xBA\x03\x02\x02\x02\xBD\xBB\x03\x02\x02\x02\xBE\x19' +
		'\x03\x02\x02\x02\xBF\xC3\x07\x12\x02\x02\xC0\xC1\x07\x12\x02\x02\xC1\xC3' +
		'\x07\x15\x02\x02\xC2\xBF\x03\x02\x02\x02\xC2\xC0\x03\x02\x02\x02\xC3\x1B' +
		'\x03\x02\x02\x02\xC4\xC8\x07\x17\x02\x02\xC5\xC6\x07\x17\x02\x02\xC6\xC8' +
		'\x07\x15\x02\x02\xC7\xC4\x03\x02\x02\x02\xC7\xC5\x03\x02\x02\x02\xC8\x1D' +
		'\x03\x02\x02\x02\xC9\xCA\x07\x17\x02\x02\xCA\xCF\x07\x11\x02\x02\xCB\xCC' +
		'\x07\x17\x02\x02\xCC\xCD\x07\x15\x02\x02\xCD\xCF\x07\x11\x02\x02\xCE\xC9' +
		'\x03\x02\x02\x02\xCE\xCB\x03\x02\x02\x02\xCF\x1F\x03\x02\x02\x02\xD0\xD1' +
		'\x07\x18\x02\x02\xD1!\x03\x02\x02\x02\xD2\xDE\x05*\x16\x02\xD3\xD6\x05' +
		'(\x15\x02\xD4\xD6\x05&\x14\x02\xD5\xD3\x03\x02\x02\x02\xD5\xD4\x03\x02' +
		'\x02\x02\xD6\xDA\x03\x02\x02\x02\xD7\xD9\x05$\x13\x02\xD8\xD7\x03\x02' +
		'\x02\x02\xD9\xDC\x03\x02\x02\x02\xDA\xD8\x03\x02\x02\x02\xDA\xDB\x03\x02' +
		'\x02\x02\xDB\xDE\x03\x02\x02\x02\xDC\xDA\x03\x02\x02\x02\xDD\xD2\x03\x02' +
		'\x02\x02\xDD\xD5\x03\x02\x02\x02\xDE#\x03\x02\x02\x02\xDF\xE0\x07\x06' +
		'\x02\x02\xE0\xE1\x05@!\x02\xE1\xE2\x07\x07\x02\x02\xE2\xE6\x03\x02\x02' +
		'\x02\xE3\xE5\x05> \x02\xE4\xE3\x03\x02\x02\x02\xE5\xE8\x03\x02\x02\x02' +
		'\xE6\xE4\x03\x02\x02\x02\xE6\xE7\x03\x02\x02\x02\xE7%\x03\x02\x02\x02' +
		'\xE8\xE6\x03\x02\x02\x02\xE9\xEA\x07%\x02\x02\xEA\xEB\x07\x06\x02\x02' +
		"\xEB\xEC\x07#\x02\x02\xEC\xED\x07\x07\x02\x02\xED'\x03\x02\x02\x02\xEE" +
		'\xEF\t\x06\x02\x02\xEF)\x03\x02\x02\x02\xF0\xF1\t\x07\x02\x02\xF1+\x03' +
		'\x02\x02\x02\xF2\xF7\x05.\x18\x02\xF3\xF7\x050\x19\x02\xF4\xF7\x052\x1A' +
		'\x02\xF5\xF7\x058\x1D\x02\xF6\xF2\x03\x02\x02\x02\xF6\xF3\x03\x02\x02' +
		'\x02\xF6\xF4\x03\x02\x02\x02\xF6\xF5\x03\x02\x02\x02\xF7-\x03\x02\x02' +
		'\x02\xF8\xF9\x07\x16\x02\x02\xF9/\x03\x02\x02\x02\xFA\xFD\x05(\x15\x02' +
		'\xFB\xFD\x05*\x16\x02\xFC\xFA\x03\x02\x02\x02\xFC\xFB\x03\x02\x02\x02' +
		'\xFD1\x03\x02\x02\x02\xFE\xFF\x054\x1B\x02\xFF\u0101\x07\x03\x02\x02\u0100' +
		'\u0102\x056\x1C\x02\u0101\u0100\x03\x02\x02\x02\u0101\u0102\x03\x02\x02' +
		'\x02\u0102\u0103\x03\x02\x02\x02\u0103\u0104\x07\x04\x02\x02\u01043\x03' +
		'\x02\x02\x02\u0105\u0108\x05(\x15\x02\u0106\u0108\x05*\x16\x02\u0107\u0105' +
		'\x03\x02\x02\x02\u0107\u0106\x03\x02\x02\x02\u01085\x03\x02\x02\x02\u0109' +
		'\u010E\x05@!\x02\u010A\u010B\x07\x05\x02\x02\u010B\u010D\x05@!\x02\u010C' +
		'\u010A\x03\x02\x02\x02\u010D\u0110\x03\x02\x02\x02\u010E\u010C\x03\x02' +
		'\x02\x02\u010E\u010F\x03\x02\x02\x02\u010F7\x03\x02\x02\x02\u0110\u010E' +
		'\x03\x02\x02\x02\u0111\u0112\x05:\x1E\x02\u0112\u0117\x05,\x17\x02\u0113' +
		'\u0114\x07\x05\x02\x02\u0114\u0116\x05,\x17\x02\u0115\u0113\x03\x02\x02' +
		'\x02\u0116\u0119\x03\x02\x02\x02\u0117\u0115\x03\x02\x02\x02\u0117\u0118' +
		'\x03\x02\x02\x02\u0118\u011A\x03\x02\x02\x02\u0119\u0117\x03\x02\x02\x02' +
		'\u011A\u011B\x05<\x1F\x02\u011B9\x03\x02\x02\x02\u011C\u011D\x07\x03\x02' +
		'\x02\u011D;\x03\x02\x02\x02\u011E\u011F\x07\x04\x02\x02\u011F=\x03\x02' +
		'\x02\x02\u0120\u0121\x05@!\x02\u0121?\x03\x02\x02\x02\u0122\u0125\x05' +
		'(\x15\x02\u0123\u0125\x05*\x16\x02\u0124\u0122\x03\x02\x02\x02\u0124\u0123' +
		'\x03\x02\x02\x02\u0125A\x03\x02\x02\x02\u0126\u012A\x05F$\x02\u0127\u012A' +
		'\x05H%\x02\u0128\u012A\x05J&\x02\u0129\u0126\x03\x02\x02\x02\u0129\u0127' +
		'\x03\x02\x02\x02\u0129\u0128\x03\x02\x02\x02\u012A\u012B\x03\x02\x02\x02' +
		'\u012B\u012C\x05N(\x02\u012CC\x03\x02\x02\x02\u012D\u0132\x05F$\x02\u012E' +
		"\u0132\x05H%\x02\u012F\u0132\x05J&\x02\u0130\u0132\x05L'\x02\u0131\u012D" +
		'\x03\x02\x02\x02\u0131\u012E\x03\x02\x02\x02\u0131\u012F\x03\x02\x02\x02' +
		'\u0131\u0130\x03\x02\x02\x02\u0132\u0133\x03\x02\x02\x02\u0133\u0134\x05' +
		'N(\x02\u0134E\x03\x02\x02\x02\u0135\u0136\t\b\x02\x02\u0136G\x03\x02\x02' +
		'\x02\u0137\u0138\x07\x1E\x02\x02\u0138I\x03\x02\x02\x02\u0139\u013A\x07' +
		' \x02\x02\u013AK\x03\x02\x02\x02\u013B\u013C\t\t\x02\x02\u013CM\x03\x02' +
		'\x02\x02\u013D\u013E\x05,\x17\x02\u013EO\x03\x02\x02\x02\u013F\u0140\x07' +
		'\x1F\x02\x02\u0140\u0141\x07 \x02\x02\u0141\u0146\x05R*\x02\u0142\u0143' +
		'\x07\x05\x02\x02\u0143\u0145\x05R*\x02\u0144\u0142\x03\x02\x02\x02\u0145' +
		'\u0148\x03\x02\x02\x02\u0146\u0144\x03\x02\x02\x02\u0146\u0147\x03\x02' +
		'\x02\x02\u0147Q\x03\x02\x02\x02\u0148\u0146\x03\x02\x02\x02\u0149\u014B' +
		'\x05"\x12\x02\u014A\u014C\t\n\x02\x02\u014B\u014A\x03\x02\x02\x02\u014B' +
		'\u014C\x03\x02\x02\x02\u014CS\x03\x02\x02\x02$UXckr\x7F\x85\x8A\x8F\x98' +
		'\x9D\xA3\xA8\xAF\xB2\xBD\xC2\xC7\xCE\xD5\xDA\xDD\xE6\xF6\xFC\u0101\u0107' +
		'\u010E\u0117\u0124\u0129\u0131\u0146\u014B';
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!JQLParser.__ATN) {
			JQLParser.__ATN = new ATNDeserializer().deserialize(
				Utils.toCharArray(JQLParser._serializedATN),
			);
		}

		return JQLParser.__ATN;
	}
}

export class JqlQueryContext extends ParserRuleContext {
	public EOF(): TerminalNode {
		return this.getToken(JQLParser.EOF, 0);
	}
	public jqlWhere(): JqlWhereContext | undefined {
		return this.tryGetRuleContext(0, JqlWhereContext);
	}
	public jqlOrderBy(): JqlOrderByContext | undefined {
		return this.tryGetRuleContext(0, JqlOrderByContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlQuery;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlQuery) {
			listener.enterJqlQuery(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlQuery) {
			listener.exitJqlQuery(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlQuery) {
			return visitor.visitJqlQuery(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlWhereContext extends ParserRuleContext {
	public jqlOrClause(): JqlOrClauseContext {
		return this.getRuleContext(0, JqlOrClauseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlWhere;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWhere) {
			listener.enterJqlWhere(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWhere) {
			listener.exitJqlWhere(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWhere) {
			return visitor.visitJqlWhere(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlOrClauseContext extends ParserRuleContext {
	public jqlAndClause(): JqlAndClauseContext[];
	public jqlAndClause(i: number): JqlAndClauseContext;
	public jqlAndClause(i?: number): JqlAndClauseContext | JqlAndClauseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlAndClauseContext);
		} else {
			return this.getRuleContext(i, JqlAndClauseContext);
		}
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JQLParser.OR);
		} else {
			return this.getToken(JQLParser.OR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlOrClause;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlOrClause) {
			listener.enterJqlOrClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlOrClause) {
			listener.exitJqlOrClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlOrClause) {
			return visitor.visitJqlOrClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlAndClauseContext extends ParserRuleContext {
	public jqlNotClause(): JqlNotClauseContext[];
	public jqlNotClause(i: number): JqlNotClauseContext;
	public jqlNotClause(i?: number): JqlNotClauseContext | JqlNotClauseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlNotClauseContext);
		} else {
			return this.getRuleContext(i, JqlNotClauseContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JQLParser.AND);
		} else {
			return this.getToken(JQLParser.AND, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlAndClause;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlAndClause) {
			listener.enterJqlAndClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlAndClause) {
			listener.exitJqlAndClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlAndClause) {
			return visitor.visitJqlAndClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlNotClauseContext extends ParserRuleContext {
	public jqlNotClause(): JqlNotClauseContext | undefined {
		return this.tryGetRuleContext(0, JqlNotClauseContext);
	}
	public NOT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT, 0);
	}
	public BANG(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.BANG, 0);
	}
	public jqlSubClause(): JqlSubClauseContext | undefined {
		return this.tryGetRuleContext(0, JqlSubClauseContext);
	}
	public jqlTerminalClause(): JqlTerminalClauseContext | undefined {
		return this.tryGetRuleContext(0, JqlTerminalClauseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlNotClause;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlNotClause) {
			listener.enterJqlNotClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlNotClause) {
			listener.exitJqlNotClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlNotClause) {
			return visitor.visitJqlNotClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlSubClauseContext extends ParserRuleContext {
	public LPAREN(): TerminalNode {
		return this.getToken(JQLParser.LPAREN, 0);
	}
	public jqlOrClause(): JqlOrClauseContext {
		return this.getRuleContext(0, JqlOrClauseContext);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(JQLParser.RPAREN, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlSubClause;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlSubClause) {
			listener.enterJqlSubClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlSubClause) {
			listener.exitJqlSubClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlSubClause) {
			return visitor.visitJqlSubClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlTerminalClauseContext extends ParserRuleContext {
	public jqlField(): JqlFieldContext {
		return this.getRuleContext(0, JqlFieldContext);
	}
	public jqlTerminalClauseRhs(): JqlTerminalClauseRhsContext {
		return this.getRuleContext(0, JqlTerminalClauseRhsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlTerminalClause;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlTerminalClause) {
			listener.enterJqlTerminalClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlTerminalClause) {
			listener.exitJqlTerminalClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlTerminalClause) {
			return visitor.visitJqlTerminalClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlTerminalClauseRhsContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlTerminalClauseRhs;
	}
	public copyFrom(ctx: JqlTerminalClauseRhsContext): void {
		super.copyFrom(ctx);
	}
}
export class JqlEqualsClauseContext extends JqlTerminalClauseRhsContext {
	public jqlEqualsOperator(): JqlEqualsOperatorContext {
		return this.getRuleContext(0, JqlEqualsOperatorContext);
	}
	public jqlEmpty(): JqlEmptyContext | undefined {
		return this.tryGetRuleContext(0, JqlEmptyContext);
	}
	public jqlValue(): JqlValueContext | undefined {
		return this.tryGetRuleContext(0, JqlValueContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlEqualsClause) {
			listener.enterJqlEqualsClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlEqualsClause) {
			listener.exitJqlEqualsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlEqualsClause) {
			return visitor.visitJqlEqualsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlLikeClauseContext extends JqlTerminalClauseRhsContext {
	public jqlLikeOperator(): JqlLikeOperatorContext {
		return this.getRuleContext(0, JqlLikeOperatorContext);
	}
	public jqlEmpty(): JqlEmptyContext | undefined {
		return this.tryGetRuleContext(0, JqlEmptyContext);
	}
	public jqlValue(): JqlValueContext | undefined {
		return this.tryGetRuleContext(0, JqlValueContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlLikeClause) {
			listener.enterJqlLikeClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlLikeClause) {
			listener.exitJqlLikeClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlLikeClause) {
			return visitor.visitJqlLikeClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlComparisonClauseContext extends JqlTerminalClauseRhsContext {
	public jqlComparisonOperator(): JqlComparisonOperatorContext {
		return this.getRuleContext(0, JqlComparisonOperatorContext);
	}
	public jqlValue(): JqlValueContext | undefined {
		return this.tryGetRuleContext(0, JqlValueContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlComparisonClause) {
			listener.enterJqlComparisonClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlComparisonClause) {
			listener.exitJqlComparisonClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlComparisonClause) {
			return visitor.visitJqlComparisonClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlInClauseContext extends JqlTerminalClauseRhsContext {
	public jqlInOperator(): JqlInOperatorContext {
		return this.getRuleContext(0, JqlInOperatorContext);
	}
	public jqlList(): JqlListContext | undefined {
		return this.tryGetRuleContext(0, JqlListContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlInClause) {
			listener.enterJqlInClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlInClause) {
			listener.exitJqlInClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlInClause) {
			return visitor.visitJqlInClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlIsClauseContext extends JqlTerminalClauseRhsContext {
	public jqlIsOperator(): JqlIsOperatorContext {
		return this.getRuleContext(0, JqlIsOperatorContext);
	}
	public jqlEmpty(): JqlEmptyContext {
		return this.getRuleContext(0, JqlEmptyContext);
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlIsClause) {
			listener.enterJqlIsClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlIsClause) {
			listener.exitJqlIsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlIsClause) {
			return visitor.visitJqlIsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlWasClauseContext extends JqlTerminalClauseRhsContext {
	public jqlWasOperator(): JqlWasOperatorContext {
		return this.getRuleContext(0, JqlWasOperatorContext);
	}
	public jqlEmpty(): JqlEmptyContext | undefined {
		return this.tryGetRuleContext(0, JqlEmptyContext);
	}
	public jqlValue(): JqlValueContext | undefined {
		return this.tryGetRuleContext(0, JqlValueContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	public jqlWasPredicate(): JqlWasPredicateContext[];
	public jqlWasPredicate(i: number): JqlWasPredicateContext;
	public jqlWasPredicate(i?: number): JqlWasPredicateContext | JqlWasPredicateContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlWasPredicateContext);
		} else {
			return this.getRuleContext(i, JqlWasPredicateContext);
		}
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWasClause) {
			listener.enterJqlWasClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWasClause) {
			listener.exitJqlWasClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWasClause) {
			return visitor.visitJqlWasClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlWasInClauseContext extends JqlTerminalClauseRhsContext {
	public jqlWasInOperator(): JqlWasInOperatorContext {
		return this.getRuleContext(0, JqlWasInOperatorContext);
	}
	public jqlList(): JqlListContext | undefined {
		return this.tryGetRuleContext(0, JqlListContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	public jqlWasPredicate(): JqlWasPredicateContext[];
	public jqlWasPredicate(i: number): JqlWasPredicateContext;
	public jqlWasPredicate(i?: number): JqlWasPredicateContext | JqlWasPredicateContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlWasPredicateContext);
		} else {
			return this.getRuleContext(i, JqlWasPredicateContext);
		}
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWasInClause) {
			listener.enterJqlWasInClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWasInClause) {
			listener.exitJqlWasInClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWasInClause) {
			return visitor.visitJqlWasInClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlChangedClauseContext extends JqlTerminalClauseRhsContext {
	public jqlChangedOperator(): JqlChangedOperatorContext {
		return this.getRuleContext(0, JqlChangedOperatorContext);
	}
	public jqlChangedPredicate(): JqlChangedPredicateContext[];
	public jqlChangedPredicate(i: number): JqlChangedPredicateContext;
	public jqlChangedPredicate(
		i?: number,
	): JqlChangedPredicateContext | JqlChangedPredicateContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlChangedPredicateContext);
		} else {
			return this.getRuleContext(i, JqlChangedPredicateContext);
		}
	}
	constructor(ctx: JqlTerminalClauseRhsContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlChangedClause) {
			listener.enterJqlChangedClause(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlChangedClause) {
			listener.exitJqlChangedClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlChangedClause) {
			return visitor.visitJqlChangedClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlEqualsOperatorContext extends ParserRuleContext {
	public EQUALS(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.EQUALS, 0);
	}
	public NOT_EQUALS(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT_EQUALS, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlEqualsOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlEqualsOperator) {
			listener.enterJqlEqualsOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlEqualsOperator) {
			listener.exitJqlEqualsOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlEqualsOperator) {
			return visitor.visitJqlEqualsOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlLikeOperatorContext extends ParserRuleContext {
	public LIKE(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.LIKE, 0);
	}
	public NOT_LIKE(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT_LIKE, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlLikeOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlLikeOperator) {
			listener.enterJqlLikeOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlLikeOperator) {
			listener.exitJqlLikeOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlLikeOperator) {
			return visitor.visitJqlLikeOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlComparisonOperatorContext extends ParserRuleContext {
	public LT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.LT, 0);
	}
	public GT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.GT, 0);
	}
	public LTEQ(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.LTEQ, 0);
	}
	public GTEQ(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.GTEQ, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlComparisonOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlComparisonOperator) {
			listener.enterJqlComparisonOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlComparisonOperator) {
			listener.exitJqlComparisonOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlComparisonOperator) {
			return visitor.visitJqlComparisonOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlInOperatorContext extends ParserRuleContext {
	public IN(): TerminalNode {
		return this.getToken(JQLParser.IN, 0);
	}
	public NOT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlInOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlInOperator) {
			listener.enterJqlInOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlInOperator) {
			listener.exitJqlInOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlInOperator) {
			return visitor.visitJqlInOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlIsOperatorContext extends ParserRuleContext {
	public IS(): TerminalNode {
		return this.getToken(JQLParser.IS, 0);
	}
	public NOT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlIsOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlIsOperator) {
			listener.enterJqlIsOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlIsOperator) {
			listener.exitJqlIsOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlIsOperator) {
			return visitor.visitJqlIsOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlWasOperatorContext extends ParserRuleContext {
	public WAS(): TerminalNode {
		return this.getToken(JQLParser.WAS, 0);
	}
	public NOT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlWasOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWasOperator) {
			listener.enterJqlWasOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWasOperator) {
			listener.exitJqlWasOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWasOperator) {
			return visitor.visitJqlWasOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlWasInOperatorContext extends ParserRuleContext {
	public WAS(): TerminalNode {
		return this.getToken(JQLParser.WAS, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(JQLParser.IN, 0);
	}
	public NOT(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NOT, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlWasInOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWasInOperator) {
			listener.enterJqlWasInOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWasInOperator) {
			listener.exitJqlWasInOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWasInOperator) {
			return visitor.visitJqlWasInOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlChangedOperatorContext extends ParserRuleContext {
	public CHANGED(): TerminalNode {
		return this.getToken(JQLParser.CHANGED, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlChangedOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlChangedOperator) {
			listener.enterJqlChangedOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlChangedOperator) {
			listener.exitJqlChangedOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlChangedOperator) {
			return visitor.visitJqlChangedOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlFieldContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlField;
	}
	public copyFrom(ctx: JqlFieldContext): void {
		super.copyFrom(ctx);
	}
}
export class JqlNumberFieldContext extends JqlFieldContext {
	public jqlNumber(): JqlNumberContext {
		return this.getRuleContext(0, JqlNumberContext);
	}
	constructor(ctx: JqlFieldContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlNumberField) {
			listener.enterJqlNumberField(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlNumberField) {
			listener.exitJqlNumberField(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlNumberField) {
			return visitor.visitJqlNumberField(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JqlNonNumberFieldContext extends JqlFieldContext {
	public jqlString(): JqlStringContext | undefined {
		return this.tryGetRuleContext(0, JqlStringContext);
	}
	public jqlCustomField(): JqlCustomFieldContext | undefined {
		return this.tryGetRuleContext(0, JqlCustomFieldContext);
	}
	public jqlFieldProperty(): JqlFieldPropertyContext[];
	public jqlFieldProperty(i: number): JqlFieldPropertyContext;
	public jqlFieldProperty(i?: number): JqlFieldPropertyContext | JqlFieldPropertyContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlFieldPropertyContext);
		} else {
			return this.getRuleContext(i, JqlFieldPropertyContext);
		}
	}
	constructor(ctx: JqlFieldContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlNonNumberField) {
			listener.enterJqlNonNumberField(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlNonNumberField) {
			listener.exitJqlNonNumberField(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlNonNumberField) {
			return visitor.visitJqlNonNumberField(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlFieldPropertyContext extends ParserRuleContext {
	public LBRACKET(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.LBRACKET, 0);
	}
	public RBRACKET(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.RBRACKET, 0);
	}
	public jqlPropertyArgument(): JqlPropertyArgumentContext[];
	public jqlPropertyArgument(i: number): JqlPropertyArgumentContext;
	public jqlPropertyArgument(
		i?: number,
	): JqlPropertyArgumentContext | JqlPropertyArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlPropertyArgumentContext);
		} else {
			return this.getRuleContext(i, JqlPropertyArgumentContext);
		}
	}
	public jqlArgument(): JqlArgumentContext | undefined {
		return this.tryGetRuleContext(0, JqlArgumentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlFieldProperty;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlFieldProperty) {
			listener.enterJqlFieldProperty(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlFieldProperty) {
			listener.exitJqlFieldProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlFieldProperty) {
			return visitor.visitJqlFieldProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlCustomFieldContext extends ParserRuleContext {
	public CUSTOMFIELD(): TerminalNode {
		return this.getToken(JQLParser.CUSTOMFIELD, 0);
	}
	public LBRACKET(): TerminalNode {
		return this.getToken(JQLParser.LBRACKET, 0);
	}
	public POSNUMBER(): TerminalNode {
		return this.getToken(JQLParser.POSNUMBER, 0);
	}
	public RBRACKET(): TerminalNode {
		return this.getToken(JQLParser.RBRACKET, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlCustomField;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlCustomField) {
			listener.enterJqlCustomField(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlCustomField) {
			listener.exitJqlCustomField(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlCustomField) {
			return visitor.visitJqlCustomField(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlStringContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.STRING, 0);
	}
	public QUOTE_STRING(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.QUOTE_STRING, 0);
	}
	public SQUOTE_STRING(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.SQUOTE_STRING, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlString;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlString) {
			listener.enterJqlString(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlString) {
			listener.exitJqlString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlString) {
			return visitor.visitJqlString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlNumberContext extends ParserRuleContext {
	public _jqlNum: Token;
	public POSNUMBER(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.POSNUMBER, 0);
	}
	public NEGNUMBER(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.NEGNUMBER, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlNumber;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlNumber) {
			listener.enterJqlNumber(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlNumber) {
			listener.exitJqlNumber(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlNumber) {
			return visitor.visitJqlNumber(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlOperandContext extends ParserRuleContext {
	public jqlEmpty(): JqlEmptyContext | undefined {
		return this.tryGetRuleContext(0, JqlEmptyContext);
	}
	public jqlValue(): JqlValueContext | undefined {
		return this.tryGetRuleContext(0, JqlValueContext);
	}
	public jqlFunction(): JqlFunctionContext | undefined {
		return this.tryGetRuleContext(0, JqlFunctionContext);
	}
	public jqlList(): JqlListContext | undefined {
		return this.tryGetRuleContext(0, JqlListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlOperand;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlOperand) {
			listener.enterJqlOperand(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlOperand) {
			listener.exitJqlOperand(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlOperand) {
			return visitor.visitJqlOperand(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlEmptyContext extends ParserRuleContext {
	public EMPTY(): TerminalNode {
		return this.getToken(JQLParser.EMPTY, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlEmpty;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlEmpty) {
			listener.enterJqlEmpty(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlEmpty) {
			listener.exitJqlEmpty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlEmpty) {
			return visitor.visitJqlEmpty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlValueContext extends ParserRuleContext {
	public jqlString(): JqlStringContext | undefined {
		return this.tryGetRuleContext(0, JqlStringContext);
	}
	public jqlNumber(): JqlNumberContext | undefined {
		return this.tryGetRuleContext(0, JqlNumberContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlValue;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlValue) {
			listener.enterJqlValue(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlValue) {
			listener.exitJqlValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlValue) {
			return visitor.visitJqlValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlFunctionContext extends ParserRuleContext {
	public jqlFunctionName(): JqlFunctionNameContext {
		return this.getRuleContext(0, JqlFunctionNameContext);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(JQLParser.LPAREN, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(JQLParser.RPAREN, 0);
	}
	public jqlArgumentList(): JqlArgumentListContext | undefined {
		return this.tryGetRuleContext(0, JqlArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlFunction;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlFunction) {
			listener.enterJqlFunction(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlFunction) {
			listener.exitJqlFunction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlFunction) {
			return visitor.visitJqlFunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlFunctionNameContext extends ParserRuleContext {
	public jqlString(): JqlStringContext | undefined {
		return this.tryGetRuleContext(0, JqlStringContext);
	}
	public jqlNumber(): JqlNumberContext | undefined {
		return this.tryGetRuleContext(0, JqlNumberContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlFunctionName;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlFunctionName) {
			listener.enterJqlFunctionName(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlFunctionName) {
			listener.exitJqlFunctionName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlFunctionName) {
			return visitor.visitJqlFunctionName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlArgumentListContext extends ParserRuleContext {
	public jqlArgument(): JqlArgumentContext[];
	public jqlArgument(i: number): JqlArgumentContext;
	public jqlArgument(i?: number): JqlArgumentContext | JqlArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlArgumentContext);
		} else {
			return this.getRuleContext(i, JqlArgumentContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JQLParser.COMMA);
		} else {
			return this.getToken(JQLParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlArgumentList;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlArgumentList) {
			listener.enterJqlArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlArgumentList) {
			listener.exitJqlArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlArgumentList) {
			return visitor.visitJqlArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlListContext extends ParserRuleContext {
	public jqlListStart(): JqlListStartContext {
		return this.getRuleContext(0, JqlListStartContext);
	}
	public jqlOperand(): JqlOperandContext[];
	public jqlOperand(i: number): JqlOperandContext;
	public jqlOperand(i?: number): JqlOperandContext | JqlOperandContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlOperandContext);
		} else {
			return this.getRuleContext(i, JqlOperandContext);
		}
	}
	public jqlListEnd(): JqlListEndContext {
		return this.getRuleContext(0, JqlListEndContext);
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JQLParser.COMMA);
		} else {
			return this.getToken(JQLParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlList;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlList) {
			listener.enterJqlList(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlList) {
			listener.exitJqlList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlList) {
			return visitor.visitJqlList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlListStartContext extends ParserRuleContext {
	public LPAREN(): TerminalNode {
		return this.getToken(JQLParser.LPAREN, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlListStart;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlListStart) {
			listener.enterJqlListStart(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlListStart) {
			listener.exitJqlListStart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlListStart) {
			return visitor.visitJqlListStart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlListEndContext extends ParserRuleContext {
	public RPAREN(): TerminalNode {
		return this.getToken(JQLParser.RPAREN, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlListEnd;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlListEnd) {
			listener.enterJqlListEnd(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlListEnd) {
			listener.exitJqlListEnd(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlListEnd) {
			return visitor.visitJqlListEnd(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlPropertyArgumentContext extends ParserRuleContext {
	public jqlArgument(): JqlArgumentContext {
		return this.getRuleContext(0, JqlArgumentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlPropertyArgument;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlPropertyArgument) {
			listener.enterJqlPropertyArgument(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlPropertyArgument) {
			listener.exitJqlPropertyArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlPropertyArgument) {
			return visitor.visitJqlPropertyArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlArgumentContext extends ParserRuleContext {
	public jqlString(): JqlStringContext | undefined {
		return this.tryGetRuleContext(0, JqlStringContext);
	}
	public jqlNumber(): JqlNumberContext | undefined {
		return this.tryGetRuleContext(0, JqlNumberContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlArgument;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlArgument) {
			listener.enterJqlArgument(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlArgument) {
			listener.exitJqlArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlArgument) {
			return visitor.visitJqlArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlWasPredicateContext extends ParserRuleContext {
	public jqlPredicateOperand(): JqlPredicateOperandContext {
		return this.getRuleContext(0, JqlPredicateOperandContext);
	}
	public jqlDatePredicateOperator(): JqlDatePredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlDatePredicateOperatorContext);
	}
	public jqlDateRangePredicateOperator(): JqlDateRangePredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlDateRangePredicateOperatorContext);
	}
	public jqlUserPredicateOperator(): JqlUserPredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlUserPredicateOperatorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlWasPredicate;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlWasPredicate) {
			listener.enterJqlWasPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlWasPredicate) {
			listener.exitJqlWasPredicate(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlWasPredicate) {
			return visitor.visitJqlWasPredicate(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlChangedPredicateContext extends ParserRuleContext {
	public jqlPredicateOperand(): JqlPredicateOperandContext {
		return this.getRuleContext(0, JqlPredicateOperandContext);
	}
	public jqlDatePredicateOperator(): JqlDatePredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlDatePredicateOperatorContext);
	}
	public jqlDateRangePredicateOperator(): JqlDateRangePredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlDateRangePredicateOperatorContext);
	}
	public jqlUserPredicateOperator(): JqlUserPredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlUserPredicateOperatorContext);
	}
	public jqlValuePredicateOperator(): JqlValuePredicateOperatorContext | undefined {
		return this.tryGetRuleContext(0, JqlValuePredicateOperatorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlChangedPredicate;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlChangedPredicate) {
			listener.enterJqlChangedPredicate(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlChangedPredicate) {
			listener.exitJqlChangedPredicate(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlChangedPredicate) {
			return visitor.visitJqlChangedPredicate(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlDatePredicateOperatorContext extends ParserRuleContext {
	public AFTER(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.AFTER, 0);
	}
	public BEFORE(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.BEFORE, 0);
	}
	public ON(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.ON, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlDatePredicateOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlDatePredicateOperator) {
			listener.enterJqlDatePredicateOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlDatePredicateOperator) {
			listener.exitJqlDatePredicateOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlDatePredicateOperator) {
			return visitor.visitJqlDatePredicateOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlDateRangePredicateOperatorContext extends ParserRuleContext {
	public DURING(): TerminalNode {
		return this.getToken(JQLParser.DURING, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlDateRangePredicateOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlDateRangePredicateOperator) {
			listener.enterJqlDateRangePredicateOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlDateRangePredicateOperator) {
			listener.exitJqlDateRangePredicateOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlDateRangePredicateOperator) {
			return visitor.visitJqlDateRangePredicateOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlUserPredicateOperatorContext extends ParserRuleContext {
	public BY(): TerminalNode {
		return this.getToken(JQLParser.BY, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlUserPredicateOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlUserPredicateOperator) {
			listener.enterJqlUserPredicateOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlUserPredicateOperator) {
			listener.exitJqlUserPredicateOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlUserPredicateOperator) {
			return visitor.visitJqlUserPredicateOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlValuePredicateOperatorContext extends ParserRuleContext {
	public FROM(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.FROM, 0);
	}
	public TO(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.TO, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlValuePredicateOperator;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlValuePredicateOperator) {
			listener.enterJqlValuePredicateOperator(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlValuePredicateOperator) {
			listener.exitJqlValuePredicateOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlValuePredicateOperator) {
			return visitor.visitJqlValuePredicateOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlPredicateOperandContext extends ParserRuleContext {
	public jqlOperand(): JqlOperandContext {
		return this.getRuleContext(0, JqlOperandContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlPredicateOperand;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlPredicateOperand) {
			listener.enterJqlPredicateOperand(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlPredicateOperand) {
			listener.exitJqlPredicateOperand(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlPredicateOperand) {
			return visitor.visitJqlPredicateOperand(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlOrderByContext extends ParserRuleContext {
	public ORDER(): TerminalNode {
		return this.getToken(JQLParser.ORDER, 0);
	}
	public BY(): TerminalNode {
		return this.getToken(JQLParser.BY, 0);
	}
	public jqlSearchSort(): JqlSearchSortContext[];
	public jqlSearchSort(i: number): JqlSearchSortContext;
	public jqlSearchSort(i?: number): JqlSearchSortContext | JqlSearchSortContext[] {
		if (i === undefined) {
			return this.getRuleContexts(JqlSearchSortContext);
		} else {
			return this.getRuleContext(i, JqlSearchSortContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(JQLParser.COMMA);
		} else {
			return this.getToken(JQLParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlOrderBy;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlOrderBy) {
			listener.enterJqlOrderBy(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlOrderBy) {
			listener.exitJqlOrderBy(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlOrderBy) {
			return visitor.visitJqlOrderBy(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

export class JqlSearchSortContext extends ParserRuleContext {
	public jqlField(): JqlFieldContext {
		return this.getRuleContext(0, JqlFieldContext);
	}
	public DESC(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.DESC, 0);
	}
	public ASC(): TerminalNode | undefined {
		return this.tryGetToken(JQLParser.ASC, 0);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number {
		return JQLParser.RULE_jqlSearchSort;
	}
	// @Override
	public enterRule(listener: JQLParserListener): void {
		if (listener.enterJqlSearchSort) {
			listener.enterJqlSearchSort(this);
		}
	}
	// @Override
	public exitRule(listener: JQLParserListener): void {
		if (listener.exitJqlSearchSort) {
			listener.exitJqlSearchSort(this);
		}
	}
	// @Override
	public accept<Result>(visitor: JQLParserVisitor<Result>): Result {
		if (visitor.visitJqlSearchSort) {
			return visitor.visitJqlSearchSort(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
