export const alignment: {
	props: {
		attrs: {
			props: {
				align: {
					type: string;
					values: string[];
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				align: {
					type: 'enum',
					values: ['center', 'end'],
				},
			},
		},
		type: {
			type: 'enum',
			values: ['alignment'],
		},
	},
};

export const annotation: {
	props: {
		attrs: {
			props: {
				annotationType: {
					type: string;
					values: string[];
				};
				id: {
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				annotationType: {
					type: 'enum',
					values: ['inlineComment'],
				},
				id: {
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['annotation'],
		},
	},
};

export const backgroundColor: {
	props: {
		attrs: {
			props: {
				color: {
					pattern: string;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				color: {
					pattern: '^#[0-9a-fA-F]{6}$',
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['backgroundColor'],
		},
	},
};

export const block_content: string[] = [
	'blockCard',
	'paragraph_with_no_marks',
	'paragraph_with_alignment',
	'paragraph_with_indentation',
	'mediaSingle_caption',
	'mediaSingle_full',
	'codeBlock',
	'codeBlock_with_extended_attributes',
	'taskList',
	'bulletList',
	'orderedList',
	'heading_with_no_marks',
	'heading_with_alignment',
	'heading_with_indentation',
	'mediaGroup',
	'decisionList',
	'rule',
	'panel',
	'blockquote',
	'extension_with_marks',
	'embedCard',
	'table',
	'expand',
	'bodiedExtension_with_marks',
];

export const blockCard: {
	props: {
		attrs: (
			| {
					props: {
						datasource: {
							props: {
								id: {
									type: string;
								};
								parameters: {
									type: string;
								};
								views: {
									items: {
										props: {
											properties: {
												optional: boolean;
												type: string;
											};
											type: {
												type: string;
											};
										};
									}[];
									minItems: number;
									type: string;
								};
							};
						};
						layout: {
							optional: boolean;
							type: string;
							values: string[];
						};
						localId: {
							optional: boolean;
							type: string;
						};
						url: {
							optional: boolean;
							type: string;
							validatorFn: string;
						};
						width: {
							optional: boolean;
							type: string;
						};
						data?: undefined;
					};
			  }
			| {
					props: {
						localId: {
							optional: boolean;
							type: string;
						};
						url: {
							type: string;
							validatorFn: string;
							optional?: undefined;
						};
						datasource?: undefined;
						layout?: undefined;
						width?: undefined;
						data?: undefined;
					};
			  }
			| {
					props: {
						data: {
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						datasource?: undefined;
						layout?: undefined;
						url?: undefined;
						width?: undefined;
					};
			  }
		)[];
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: [
			{
				props: {
					datasource: {
						props: {
							id: {
								type: 'string',
							},
							parameters: {
								type: 'object',
							},
							views: {
								items: [
									{
										props: {
											properties: {
												optional: true,
												type: 'object',
											},
											type: {
												type: 'string',
											},
										},
									},
								],
								minItems: 1,
								type: 'array',
							},
						},
					},
					layout: {
						optional: true,
						type: 'enum',
						values: [
							'wide',
							'full-width',
							'center',
							'wrap-right',
							'wrap-left',
							'align-end',
							'align-start',
						],
					},
					localId: {
						optional: true,
						type: 'string',
					},
					url: {
						optional: true,
						type: 'string',
						validatorFn: 'safeUrl',
					},
					width: {
						optional: true,
						type: 'number',
					},
				},
			},
			{
				props: {
					localId: {
						optional: true,
						type: 'string',
					},
					url: {
						type: 'string',
						validatorFn: 'safeUrl',
					},
				},
			},
			{
				props: {
					data: {
						type: 'object',
					},
					localId: {
						optional: true,
						type: 'string',
					},
				},
			},
		],
		type: {
			type: 'enum',
			values: ['blockCard'],
		},
	},
	required: ['attrs'],
};

export const blockquote: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph_with_no_marks',
					'orderedList',
					'bulletList',
					'codeBlock',
					'mediaSingle_caption',
					'mediaSingle_full',
					'mediaGroup',
					'extension_with_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['blockquote'],
		},
	},
};

export const blockRootOnly: string[] = ['multiBodiedExtension'];

export const blockTaskItem: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
				state: {
					type: string;
					values: string[];
				};
			};
		};
		content: {
			isTupleLike: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
				state: {
					type: 'enum',
					values: ['TODO', 'DONE'],
				},
			},
		},
		content: {
			isTupleLike: true,
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_font_size',
					'extension_with_marks',
				],
				[
					'paragraph_with_no_marks',
					'paragraph_with_font_size',
					'extension_with_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['blockTaskItem'],
		},
	},
};

export const bodiedExtension: {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: number;
					type: string;
				};
				extensionType: {
					minLength: number;
					type: string;
				};
				layout: {
					optional: boolean;
					type: string;
					values: string[];
				};
				localId: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				parameters: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[];
			minItems: number;
			type: string;
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: 1,
					type: 'string',
				},
				extensionType: {
					minLength: 1,
					type: 'string',
				},
				layout: {
					optional: true,
					type: 'enum',
					values: ['wide', 'full-width', 'default'],
				},
				localId: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				parameters: {
					optional: true,
					type: 'object',
				},
				text: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: ['non_nestable_block_content'],
			minItems: 1,
			type: 'array',
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['bodiedExtension'],
		},
	},
};

export const bodiedExtension_with_marks: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'bodiedExtension',
	{
		props: {
			marks: {
				items: [['dataConsumer', 'fragment']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const bodiedSyncBlock: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
				resourceId: {
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
				resourceId: {
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph',
					'paragraph_with_alignment',
					'paragraph_with_indentation',
					'paragraph_with_no_marks',
					'blockCard',
					'blockquote',
					'bulletList',
					'codeBlock',
					'decisionList',
					'embedCard',
					'expand',
					'heading',
					'heading_with_alignment',
					'heading_with_indentation',
					'heading_with_no_marks',
					'layoutSection',
					'layoutSection_with_single_column',
					'layoutSection_full',
					'mediaGroup',
					'mediaSingle',
					'mediaSingle_caption',
					'mediaSingle_full',
					'mediaSingle_width_type',
					'orderedList',
					'panel',
					'rule',
					'table',
					'taskList',
				],
			],
			minItems: 1,
			type: 'array',
		},
		marks: {
			items: ['breakout'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['bodiedSyncBlock'],
		},
	},
};

export const border: {
	props: {
		attrs: {
			props: {
				color: {
					pattern: string;
					type: string;
				};
				size: {
					maximum: number;
					minimum: number;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				color: {
					pattern: '^#[0-9a-fA-F]{8}$|^#[0-9a-fA-F]{6}$',
					type: 'string',
				},
				size: {
					maximum: 3,
					minimum: 1,
					type: 'number',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['border'],
		},
	},
};

export const breakout: {
	props: {
		attrs: {
			props: {
				mode: {
					type: string;
					values: string[];
				};
				width: {
					optional: boolean;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				mode: {
					type: 'enum',
					values: ['wide', 'full-width'],
				},
				width: {
					optional: true,
					type: 'number',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['breakout'],
		},
	},
};

export const bulletList: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			items: ['listItem'],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['bulletList'],
		},
	},
};

export const caption: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[][];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: [
				[
					'hardBreak',
					'mention',
					'emoji',
					'date',
					'placeholder',
					'inlineCard',
					'status',
					'text_formatted',
					'text_code_inline',
				],
			],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['caption'],
		},
	},
};

export const code: {
	props: {
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		type: {
			type: 'enum',
			values: ['code'],
		},
	},
};

export const codeBlock: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				language: {
					optional: boolean;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				uniqueId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				language: {
					optional: true,
					type: 'string',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				uniqueId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: ['text_with_no_marks'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['codeBlock'],
		},
	},
};

export const codeBlock_root_only: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'codeBlock',
	{
		props: {
			marks: {
				items: ['breakout'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const codeBlock_root_only_with_extended_attributes: (
	| string
	| {
			props: {
				attrs: {
					optional: boolean;
					props: {
						hideLineNumbers: {
							optional: boolean;
							type: string;
						};
						language: {
							optional: boolean;
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						uniqueId: {
							optional: boolean;
							type: string;
						};
						wrap: {
							optional: boolean;
							type: string;
						};
					};
				};
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'codeBlock',
	{
		props: {
			attrs: {
				optional: true,
				props: {
					hideLineNumbers: {
						optional: true,
						type: 'boolean',
					},
					language: {
						optional: true,
						type: 'string',
					},
					localId: {
						optional: true,
						type: 'string',
					},
					uniqueId: {
						optional: true,
						type: 'string',
					},
					wrap: {
						optional: true,
						type: 'boolean',
					},
				},
			},
			marks: {
				items: ['breakout'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const codeBlock_with_extended_attributes: (
	| string
	| {
			props: {
				attrs: {
					optional: boolean;
					props: {
						hideLineNumbers: {
							optional: boolean;
							type: string;
						};
						language: {
							optional: boolean;
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						uniqueId: {
							optional: boolean;
							type: string;
						};
						wrap: {
							optional: boolean;
							type: string;
						};
					};
				};
			};
	  }
)[] = [
	'codeBlock',
	{
		props: {
			attrs: {
				optional: true,
				props: {
					hideLineNumbers: {
						optional: true,
						type: 'boolean',
					},
					language: {
						optional: true,
						type: 'string',
					},
					localId: {
						optional: true,
						type: 'string',
					},
					uniqueId: {
						optional: true,
						type: 'string',
					},
					wrap: {
						optional: true,
						type: 'boolean',
					},
				},
			},
		},
	},
];

export const confluenceInlineComment: {
	props: {
		attrs: {
			props: {
				reference: {
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				reference: {
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['confluenceInlineComment'],
		},
	},
};

export const dataConsumer: {
	props: {
		attrs: {
			props: {
				sources: {
					items: {
						type: string;
					}[];
					minItems: number;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				sources: {
					items: [
						{
							type: 'string',
						},
					],
					minItems: 1,
					type: 'array',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['dataConsumer'],
		},
	},
};

export const date: {
	props: {
		attrs: {
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				timestamp: {
					minLength: number;
					type: string;
				};
			};
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				timestamp: {
					minLength: 1,
					type: 'string',
				},
			},
		},
		marks: {
			items: ['annotation'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['date'],
		},
	},
};

export const decisionItem: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
				state: {
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
				state: {
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: ['inline_content'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['decisionItem'],
		},
	},
};

export const decisionList: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: ['decisionItem'],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['decisionList'],
		},
	},
};

export const doc: {
	props: {
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
		version: {
			type: string;
			values: number[];
		};
	};
} = {
	props: {
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'blockCard',
					'paragraph_with_no_marks',
					'paragraph_with_alignment',
					'paragraph_with_indentation',
					'mediaSingle_caption',
					'mediaSingle_full',
					'codeBlock',
					'codeBlock_with_extended_attributes',
					'taskList',
					'bulletList',
					'orderedList',
					'heading_with_no_marks',
					'heading_with_alignment',
					'heading_with_indentation',
					'mediaGroup',
					'decisionList',
					'rule',
					'panel',
					'blockquote',
					'extension_with_marks',
					'embedCard',
					'table',
					'expand',
					'bodiedExtension_with_marks',
					'codeBlock_root_only',
					'codeBlock_root_only_with_extended_attributes',
					'layoutSection_with_single_column',
					'layoutSection_full',
					'multiBodiedExtension',
					'expand_root_only',
					'syncBlock',
					'bodiedSyncBlock',
				],
			],
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['doc'],
		},
		version: {
			type: 'enum',
			values: [1],
		},
	},
};

export const em: {
	props: {
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		type: {
			type: 'enum',
			values: ['em'],
		},
	},
};

export const embedCard: {
	props: {
		attrs: {
			props: {
				layout: {
					type: string;
					values: string[];
				};
				localId: {
					optional: boolean;
					type: string;
				};
				originalHeight: {
					optional: boolean;
					type: string;
				};
				originalWidth: {
					optional: boolean;
					type: string;
				};
				url: {
					type: string;
					validatorFn: string;
				};
				width: {
					maximum: number;
					minimum: number;
					optional: boolean;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				layout: {
					type: 'enum',
					values: [
						'wide',
						'full-width',
						'center',
						'wrap-right',
						'wrap-left',
						'align-end',
						'align-start',
					],
				},
				localId: {
					optional: true,
					type: 'string',
				},
				originalHeight: {
					optional: true,
					type: 'number',
				},
				originalWidth: {
					optional: true,
					type: 'number',
				},
				url: {
					type: 'string',
					validatorFn: 'safeUrl',
				},
				width: {
					maximum: 100,
					minimum: 0,
					optional: true,
					type: 'number',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['embedCard'],
		},
	},
};

export const emoji: {
	props: {
		attrs: {
			props: {
				id: {
					optional: boolean;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				shortName: {
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
			};
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				id: {
					optional: true,
					type: 'string',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				shortName: {
					type: 'string',
				},
				text: {
					optional: true,
					type: 'string',
				},
			},
		},
		marks: {
			items: ['annotation'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['emoji'],
		},
	},
};

export const expand: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				title: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				title: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_font_size',
					'panel',
					'blockquote',
					'orderedList',
					'bulletList',
					'rule',
					'heading_with_no_marks',
					'codeBlock',
					'codeBlock_with_extended_attributes',
					'mediaGroup',
					'mediaSingle_caption',
					'mediaSingle_full',
					'decisionList',
					'taskList',
					'table',
					'blockCard',
					'embedCard',
					'extension_with_marks',
					'nestedExpand_with_no_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['expand'],
		},
	},
};

export const expand_root_only: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'expand',
	{
		props: {
			marks: {
				items: ['breakout'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const extension: {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: number;
					type: string;
				};
				extensionType: {
					minLength: number;
					type: string;
				};
				layout: {
					optional: boolean;
					type: string;
					values: string[];
				};
				localId: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				parameters: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
			};
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: 1,
					type: 'string',
				},
				extensionType: {
					minLength: 1,
					type: 'string',
				},
				layout: {
					optional: true,
					type: 'enum',
					values: ['wide', 'full-width', 'default'],
				},
				localId: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				parameters: {
					optional: true,
					type: 'object',
				},
				text: {
					optional: true,
					type: 'string',
				},
			},
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['extension'],
		},
	},
};

export const extension_with_marks: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'extension',
	{
		props: {
			marks: {
				items: [['dataConsumer', 'fragment']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const extensionFrame: {
	props: {
		content: {
			items: string[][];
			minItems: number;
			type: string;
		};
		marks: {
			items: string[][];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		content: {
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_font_size',
					'panel',
					'blockquote',
					'orderedList',
					'bulletList',
					'rule',
					'heading_with_no_marks',
					'codeBlock',
					'mediaGroup',
					'mediaSingle_full',
					'mediaSingle_caption',
					'decisionList',
					'taskList',
					'table',
					'extension_with_marks',
					'bodiedExtension_with_marks',
					'blockCard',
					'embedCard',
				],
			],
			minItems: 1,
			type: 'array',
		},
		marks: {
			items: [['dataConsumer', 'fragment']],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['extensionFrame'],
		},
	},
};

export const fontSize: {
	props: {
		attrs: {
			props: {
				fontSize: {
					type: string;
					values: string[];
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				fontSize: {
					type: 'enum',
					values: ['small'],
				},
			},
		},
		type: {
			type: 'enum',
			values: ['fontSize'],
		},
	},
};

export const fragment: {
	props: {
		attrs: {
			props: {
				localId: {
					minLength: number;
					type: string;
				};
				name: {
					optional: boolean;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					minLength: 1,
					type: 'string',
				},
				name: {
					optional: true,
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['fragment'],
		},
	},
};

export const hardBreak: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
					values: string[];
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				text: {
					optional: true,
					type: 'enum',
					values: ['\n'],
				},
			},
		},
		type: {
			type: 'enum',
			values: ['hardBreak'],
		},
	},
};

export const heading: {
	props: {
		attrs: {
			props: {
				level: {
					maximum: number;
					minimum: number;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[];
			optional: boolean;
			type: string;
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				level: {
					maximum: 6,
					minimum: 1,
					type: 'number',
				},
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: ['inline_content'],
			optional: true,
			type: 'array',
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['heading'],
		},
	},
};

export const heading_with_alignment: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'heading',
	{
		props: {
			marks: {
				items: ['alignment'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const heading_with_indentation: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'heading',
	{
		props: {
			marks: {
				items: ['indentation'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const heading_with_no_marks: (
	| string
	| {
			props: {
				marks: {
					items: never[];
					maxItems: number;
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'heading',
	{
		props: {
			marks: {
				items: [],
				maxItems: 0,
				optional: true,
				type: 'array',
			},
		},
	},
];

export const indentation: {
	props: {
		attrs: {
			props: {
				level: {
					maximum: number;
					minimum: number;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				level: {
					maximum: 6,
					minimum: 1,
					type: 'number',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['indentation'],
		},
	},
};

export const inline_content: string[] = [
	'text_formatted',
	'text_code_inline',
	'date',
	'emoji',
	'hardBreak',
	'inlineCard',
	'mention',
	'placeholder',
	'status',
	'inlineExtension_with_marks',
	'mediaInline',
];

export const inlineCard: {
	props: {
		attrs: (
			| {
					props: {
						localId: {
							optional: boolean;
							type: string;
						};
						url: {
							type: string;
							validatorFn: string;
						};
						data?: undefined;
					};
			  }
			| {
					props: {
						data: {
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						url?: undefined;
					};
			  }
		)[];
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: [
			{
				props: {
					localId: {
						optional: true,
						type: 'string',
					},
					url: {
						type: 'string',
						validatorFn: 'safeUrl',
					},
				},
			},
			{
				props: {
					data: {
						type: 'object',
					},
					localId: {
						optional: true,
						type: 'string',
					},
				},
			},
		],
		marks: {
			items: ['annotation'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['inlineCard'],
		},
	},
	required: ['attrs'],
};

export const inlineExtension: {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: number;
					type: string;
				};
				extensionType: {
					minLength: number;
					type: string;
				};
				localId: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				parameters: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
			};
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: 1,
					type: 'string',
				},
				extensionType: {
					minLength: 1,
					type: 'string',
				},
				localId: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				parameters: {
					optional: true,
					type: 'object',
				},
				text: {
					optional: true,
					type: 'string',
				},
			},
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['inlineExtension'],
		},
	},
};

export const inlineExtension_with_marks: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'inlineExtension',
	{
		props: {
			marks: {
				items: [['dataConsumer', 'fragment']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const layoutColumn: {
	props: {
		attrs: {
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				width: {
					maximum: number;
					minimum: number;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				width: {
					maximum: 100,
					minimum: 0,
					type: 'number',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: ['block_content'],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['layoutColumn'],
		},
	},
};

export const layoutSection: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[];
			maxItems: number;
			minItems: number;
			type: string;
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: ['layoutColumn'],
			maxItems: 3,
			minItems: 1,
			type: 'array',
		},
		marks: {
			items: ['breakout'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['layoutSection'],
		},
	},
};

export const layoutSection_full: (
	| string
	| {
			props: {
				content: {
					allowUnsupportedBlock: boolean;
					items: string[];
					maxItems: number;
					minItems: number;
					type: string;
				};
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'layoutSection',
	{
		props: {
			content: {
				allowUnsupportedBlock: true,
				items: ['layoutColumn'],
				maxItems: 3,
				minItems: 2,
				type: 'array',
			},
			marks: {
				items: ['breakout'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const layoutSection_with_single_column: (
	| string
	| {
			props: {
				attrs: {
					optional: boolean;
					props: {
						columnRuleStyle: {
							optional: boolean;
							type: string;
							values: string[];
						};
						localId: {
							optional: boolean;
							type: string;
						};
					};
				};
				content: {
					allowUnsupportedBlock: boolean;
					items: string[];
					maxItems: number;
					minItems: number;
					type: string;
				};
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'layoutSection',
	{
		props: {
			attrs: {
				optional: true,
				props: {
					columnRuleStyle: {
						optional: true,
						type: 'enum',
						values: ['solid'],
					},
					localId: {
						optional: true,
						type: 'string',
					},
				},
			},
			content: {
				allowUnsupportedBlock: true,
				items: ['layoutColumn'],
				maxItems: 5,
				minItems: 1,
				type: 'array',
			},
			marks: {
				items: ['breakout'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const link: {
	props: {
		attrs: {
			props: {
				collection: {
					optional: boolean;
					type: string;
				};
				href: {
					type: string;
					validatorFn: string;
				};
				id: {
					optional: boolean;
					type: string;
				};
				occurrenceKey: {
					optional: boolean;
					type: string;
				};
				title: {
					optional: boolean;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				collection: {
					optional: true,
					type: 'string',
				},
				href: {
					type: 'string',
					validatorFn: 'safeUrl',
				},
				id: {
					optional: true,
					type: 'string',
				},
				occurrenceKey: {
					optional: true,
					type: 'string',
				},
				title: {
					optional: true,
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['link'],
		},
	},
};

export const listItem: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph_with_font_size',
					'paragraph_with_no_marks',
					'bulletList',
					'orderedList',
					'taskList',
					'mediaSingle_caption',
					'mediaSingle_full',
					'codeBlock',
					'extension_with_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['listItem'],
		},
	},
};

export const media: {
	props: {
		attrs: (
			| {
					props: {
						alt: {
							optional: boolean;
							type: string;
						};
						collection: {
							type: string;
						};
						height: {
							optional: boolean;
							type: string;
						};
						id: {
							minLength: number;
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						occurrenceKey: {
							minLength: number;
							optional: boolean;
							type: string;
						};
						type: {
							type: string;
							values: string[];
						};
						width: {
							optional: boolean;
							type: string;
						};
						url?: undefined;
					};
			  }
			| {
					props: {
						alt: {
							optional: boolean;
							type: string;
						};
						height: {
							optional: boolean;
							type: string;
						};
						localId: {
							optional: boolean;
							type: string;
						};
						type: {
							type: string;
							values: string[];
						};
						url: {
							type: string;
						};
						width: {
							optional: boolean;
							type: string;
						};
						collection?: undefined;
						id?: undefined;
						occurrenceKey?: undefined;
					};
			  }
		)[];
		marks: {
			items: string[][];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: [
			{
				props: {
					alt: {
						optional: true,
						type: 'string',
					},
					collection: {
						type: 'string',
					},
					height: {
						optional: true,
						type: 'number',
					},
					id: {
						minLength: 1,
						type: 'string',
					},
					localId: {
						optional: true,
						type: 'string',
					},
					occurrenceKey: {
						minLength: 1,
						optional: true,
						type: 'string',
					},
					type: {
						type: 'enum',
						values: ['link', 'file'],
					},
					width: {
						optional: true,
						type: 'number',
					},
				},
			},
			{
				props: {
					alt: {
						optional: true,
						type: 'string',
					},
					height: {
						optional: true,
						type: 'number',
					},
					localId: {
						optional: true,
						type: 'string',
					},
					type: {
						type: 'enum',
						values: ['external'],
					},
					url: {
						type: 'string',
					},
					width: {
						optional: true,
						type: 'number',
					},
				},
			},
		],
		marks: {
			items: [['dataConsumer', 'link', 'annotation', 'border']],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['media'],
		},
	},
	required: ['attrs'],
};

export const mediaGroup: {
	props: {
		content: {
			allowUnsupportedBlock: boolean;
			items: string[];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		content: {
			allowUnsupportedBlock: true,
			items: ['media'],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['mediaGroup'],
		},
	},
};

export const mediaInline: {
	props: {
		attrs: {
			props: {
				alt: {
					optional: boolean;
					type: string;
				};
				collection: {
					type: string;
				};
				data: {
					optional: boolean;
					type: string;
				};
				height: {
					optional: boolean;
					type: string;
				};
				id: {
					minLength: number;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				occurrenceKey: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				type: {
					optional: boolean;
					type: string;
					values: string[];
				};
				url: {
					optional: boolean;
					type: string;
				};
				width: {
					optional: boolean;
					type: string;
				};
			};
		};
		marks: {
			items: string[][];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				alt: {
					optional: true,
					type: 'string',
				},
				collection: {
					type: 'string',
				},
				data: {
					optional: true,
					type: 'object',
				},
				height: {
					optional: true,
					type: 'number',
				},
				id: {
					minLength: 1,
					type: 'string',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				occurrenceKey: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				type: {
					optional: true,
					type: 'enum',
					values: ['link', 'file', 'image'],
				},
				url: {
					optional: true,
					type: 'string',
				},
				width: {
					optional: true,
					type: 'number',
				},
			},
		},
		marks: {
			items: [['dataConsumer', 'link', 'annotation', 'border']],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['mediaInline'],
		},
	},
};

export const mediaSingle: {
	props: {
		attrs: (
			| {
					props: {
						layout: {
							type: string;
							values: string[];
						};
						localId: {
							optional: boolean;
							type: string;
						};
						width: {
							maximum: number;
							minimum: number;
							optional: boolean;
							type: string;
						};
						widthType: {
							optional: boolean;
							type: string;
							values: string[];
						};
					};
			  }
			| {
					props: {
						layout: {
							type: string;
							values: string[];
						};
						localId: {
							optional: boolean;
							type: string;
						};
						width: {
							minimum: number;
							type: string;
							maximum?: undefined;
							optional?: undefined;
						};
						widthType: {
							type: string;
							values: string[];
							optional?: undefined;
						};
					};
			  }
		)[];
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: [
			{
				props: {
					layout: {
						type: 'enum',
						values: [
							'wide',
							'full-width',
							'center',
							'wrap-right',
							'wrap-left',
							'align-end',
							'align-start',
						],
					},
					localId: {
						optional: true,
						type: 'string',
					},
					width: {
						maximum: 100,
						minimum: 0,
						optional: true,
						type: 'number',
					},
					widthType: {
						optional: true,
						type: 'enum',
						values: ['percentage'],
					},
				},
			},
			{
				props: {
					layout: {
						type: 'enum',
						values: [
							'wide',
							'full-width',
							'center',
							'wrap-right',
							'wrap-left',
							'align-end',
							'align-start',
						],
					},
					localId: {
						optional: true,
						type: 'string',
					},
					width: {
						minimum: 0,
						type: 'number',
					},
					widthType: {
						type: 'enum',
						values: ['pixel'],
					},
				},
			},
		],
		marks: {
			items: ['link'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['mediaSingle'],
		},
	},
};

export const mediaSingle_caption: (
	| string
	| {
			props: {
				content: {
					allowUnsupportedBlock: boolean;
					isTupleLike: boolean;
					items: string[];
					maxItems: number;
					minItems: number;
					type: string;
				};
			};
	  }
)[] = [
	'mediaSingle',
	{
		props: {
			content: {
				allowUnsupportedBlock: true,
				isTupleLike: true,
				items: ['media', 'caption'],
				maxItems: 2,
				minItems: 1,
				type: 'array',
			},
		},
	},
];

export const mediaSingle_full: (
	| string
	| {
			props: {
				content: {
					allowUnsupportedBlock: boolean;
					items: string[];
					maxItems: number;
					minItems: number;
					type: string;
				};
			};
	  }
)[] = [
	'mediaSingle',
	{
		props: {
			content: {
				allowUnsupportedBlock: true,
				items: ['media'],
				maxItems: 1,
				minItems: 1,
				type: 'array',
			},
		},
	},
];

export const mediaSingle_width_type: (
	| string
	| {
			props: {
				content: {
					allowUnsupportedBlock: boolean;
					items: string[];
					maxItems: number;
					minItems: number;
					type: string;
				};
			};
	  }
)[] = [
	'mediaSingle',
	{
		props: {
			content: {
				allowUnsupportedBlock: true,
				items: ['media'],
				maxItems: 1,
				minItems: 1,
				type: 'array',
			},
		},
	},
];

export const mention: {
	props: {
		attrs: {
			props: {
				accessLevel: {
					optional: boolean;
					type: string;
				};
				id: {
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
				userType: {
					optional: boolean;
					type: string;
					values: string[];
				};
			};
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				accessLevel: {
					optional: true,
					type: 'string',
				},
				id: {
					type: 'string',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				text: {
					optional: true,
					type: 'string',
				},
				userType: {
					optional: true,
					type: 'enum',
					values: ['DEFAULT', 'SPECIAL', 'APP'],
				},
			},
		},
		marks: {
			items: ['annotation'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['mention'],
		},
	},
};

export const multiBodiedExtension: {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: number;
					type: string;
				};
				extensionType: {
					minLength: number;
					type: string;
				};
				layout: {
					optional: boolean;
					type: string;
					values: string[];
				};
				localId: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				parameters: {
					optional: boolean;
					type: string;
				};
				text: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[];
			type: string;
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				extensionKey: {
					minLength: 1,
					type: 'string',
				},
				extensionType: {
					minLength: 1,
					type: 'string',
				},
				layout: {
					optional: true,
					type: 'enum',
					values: ['default', 'wide', 'full-width'],
				},
				localId: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				parameters: {
					optional: true,
					type: 'object',
				},
				text: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			items: ['extensionFrame'],
			type: 'array',
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['multiBodiedExtension'],
		},
	},
};

export const nestedExpand: {
	props: {
		attrs: {
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				title: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: string;
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: {
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				title: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: 'nestedExpand_content',
		type: {
			type: 'enum',
			values: ['nestedExpand'],
		},
	},
	required: ['content'],
};

export const nestedExpand_content: {
	allowUnsupportedBlock: boolean;
	items: string[][];
	minItems: number;
	type: string;
} = {
	allowUnsupportedBlock: true,
	items: [
		[
			'paragraph_with_no_marks',
			'paragraph_with_font_size',
			'heading_with_no_marks',
			'mediaSingle_caption',
			'mediaSingle_full',
			'mediaGroup',
			'codeBlock',
			'bulletList',
			'orderedList',
			'taskList',
			'decisionList',
			'rule',
			'panel',
			'blockquote',
			'extension_with_marks',
		],
	],
	minItems: 1,
	type: 'array',
};

export const nestedExpand_with_no_marks: (
	| string
	| {
			props: {
				marks: {
					items: never[];
					maxItems: number;
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'nestedExpand',
	{
		props: {
			marks: {
				items: [],
				maxItems: 0,
				optional: true,
				type: 'array',
			},
		},
	},
];

export const non_nestable_block_content: string[] = [
	'paragraph_with_no_marks',
	'paragraph_with_font_size',
	'panel',
	'blockquote',
	'orderedList',
	'bulletList',
	'rule',
	'heading_with_no_marks',
	'codeBlock',
	'codeBlock_with_extended_attributes',
	'mediaGroup',
	'mediaSingle_caption',
	'mediaSingle_full',
	'decisionList',
	'taskList',
	'table',
	'blockCard',
	'embedCard',
	'extension_with_marks',
];

export const orderedList: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				order: {
					minimum: number;
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				order: {
					minimum: 0,
					optional: true,
					type: 'number',
				},
			},
		},
		content: {
			items: ['listItem'],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['orderedList'],
		},
	},
};

export const panel: {
	props: {
		attrs: {
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				panelColor: {
					optional: boolean;
					type: string;
				};
				panelIcon: {
					optional: boolean;
					type: string;
				};
				panelIconId: {
					optional: boolean;
					type: string;
				};
				panelIconText: {
					optional: boolean;
					type: string;
				};
				panelType: {
					type: string;
					values: string[];
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				panelColor: {
					optional: true,
					type: 'string',
				},
				panelIcon: {
					optional: true,
					type: 'string',
				},
				panelIconId: {
					optional: true,
					type: 'string',
				},
				panelIconText: {
					optional: true,
					type: 'string',
				},
				panelType: {
					type: 'enum',
					values: [
						'info',
						'note',
						'tip',
						'warning',
						'error',
						'success',
						'custom',
					],
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_font_size',
					'heading_with_no_marks',
					'bulletList',
					'orderedList',
					'blockCard',
					'mediaGroup',
					'mediaSingle_caption',
					'mediaSingle_full',
					'codeBlock',
					'taskList',
					'rule',
					'decisionList',
					'extension_with_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['panel'],
		},
	},
};

export const paragraph: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[];
			optional: boolean;
			type: string;
		};
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: ['inline_content'],
			optional: true,
			type: 'array',
		},
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['paragraph'],
		},
	},
};

export const paragraph_with_alignment: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'paragraph',
	{
		props: {
			marks: {
				items: [['fontSize', 'alignment']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const paragraph_with_font_size: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'paragraph',
	{
		props: {
			marks: {
				items: ['fontSize'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const paragraph_with_indentation: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'paragraph',
	{
		props: {
			marks: {
				items: [['fontSize', 'indentation']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const paragraph_with_no_marks: (
	| string
	| {
			props: {
				marks: {
					items: never[];
					maxItems: number;
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'paragraph',
	{
		props: {
			marks: {
				items: [],
				maxItems: 0,
				optional: true,
				type: 'array',
			},
		},
	},
];

export const placeholder: {
	props: {
		attrs: {
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
				text: {
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
				text: {
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['placeholder'],
		},
	},
};

export const rule: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['rule'],
		},
	},
};

export const status: {
	props: {
		attrs: {
			props: {
				color: {
					type: string;
					values: string[];
				};
				localId: {
					optional: boolean;
					type: string;
				};
				style: {
					optional: boolean;
					type: string;
				};
				text: {
					minLength: number;
					type: string;
				};
			};
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				color: {
					type: 'enum',
					values: ['neutral', 'purple', 'blue', 'red', 'yellow', 'green'],
				},
				localId: {
					optional: true,
					type: 'string',
				},
				style: {
					optional: true,
					type: 'string',
				},
				text: {
					minLength: 1,
					type: 'string',
				},
			},
		},
		marks: {
			items: ['annotation'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['status'],
		},
	},
};

export const strike: {
	props: {
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		type: {
			type: 'enum',
			values: ['strike'],
		},
	},
};

export const strong: {
	props: {
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		type: {
			type: 'enum',
			values: ['strong'],
		},
	},
};

export const subsup: {
	props: {
		attrs: {
			props: {
				type: {
					type: string;
					values: string[];
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				type: {
					type: 'enum',
					values: ['sub', 'sup'],
				},
			},
		},
		type: {
			type: 'enum',
			values: ['subsup'],
		},
	},
};

export const syncBlock: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
				resourceId: {
					type: string;
				};
			};
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
				resourceId: {
					type: 'string',
				},
			},
		},
		marks: {
			items: ['breakout'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['syncBlock'],
		},
	},
};

export const table: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				displayMode: {
					optional: boolean;
					type: string;
					values: string[];
				};
				isNumberColumnEnabled: {
					optional: boolean;
					type: string;
				};
				layout: {
					optional: boolean;
					type: string;
					values: string[];
				};
				localId: {
					minLength: number;
					optional: boolean;
					type: string;
				};
				width: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[];
			minItems: number;
			type: string;
		};
		marks: {
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				displayMode: {
					optional: true,
					type: 'enum',
					values: ['default', 'fixed'],
				},
				isNumberColumnEnabled: {
					optional: true,
					type: 'boolean',
				},
				layout: {
					optional: true,
					type: 'enum',
					values: [
						'wide',
						'full-width',
						'center',
						'align-end',
						'align-start',
						'default',
					],
				},
				localId: {
					minLength: 1,
					optional: true,
					type: 'string',
				},
				width: {
					optional: true,
					type: 'number',
				},
			},
		},
		content: {
			items: ['tableRow'],
			minItems: 1,
			type: 'array',
		},
		marks: {
			items: ['fragment'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['table'],
		},
	},
};

export const tableCell: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				background: {
					optional: boolean;
					type: string;
				};
				colspan: {
					optional: boolean;
					type: string;
				};
				colwidth: {
					items: {
						type: string;
					}[];
					optional: boolean;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				rowspan: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				background: {
					optional: true,
					type: 'string',
				},
				colspan: {
					optional: true,
					type: 'number',
				},
				colwidth: {
					items: [
						{
							type: 'number',
						},
					],
					optional: true,
					type: 'array',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				rowspan: {
					optional: true,
					type: 'number',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_alignment',
					'panel',
					'blockquote',
					'orderedList',
					'bulletList',
					'rule',
					'heading_with_no_marks',
					'heading_with_alignment',
					'heading_with_indentation',
					'codeBlock',
					'codeBlock_with_extended_attributes',
					'mediaSingle_caption',
					'mediaSingle_full',
					'mediaGroup',
					'decisionList',
					'taskList',
					'blockCard',
					'embedCard',
					'extension_with_marks',
					'nestedExpand_with_no_marks',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['tableCell'],
		},
	},
	required: ['content'],
};

export const tableHeader: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				background: {
					optional: boolean;
					type: string;
				};
				colspan: {
					optional: boolean;
					type: string;
				};
				colwidth: {
					items: {
						type: string;
					}[];
					optional: boolean;
					type: string;
				};
				localId: {
					optional: boolean;
					type: string;
				};
				rowspan: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
	required: string[];
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				background: {
					optional: true,
					type: 'string',
				},
				colspan: {
					optional: true,
					type: 'number',
				},
				colwidth: {
					items: [
						{
							type: 'number',
						},
					],
					optional: true,
					type: 'array',
				},
				localId: {
					optional: true,
					type: 'string',
				},
				rowspan: {
					optional: true,
					type: 'number',
				},
			},
		},
		content: {
			items: [
				[
					'paragraph_with_no_marks',
					'paragraph_with_alignment',
					'panel',
					'blockquote',
					'orderedList',
					'bulletList',
					'rule',
					'heading_with_no_marks',
					'heading_with_alignment',
					'heading_with_indentation',
					'codeBlock',
					'codeBlock_with_extended_attributes',
					'mediaSingle_caption',
					'mediaSingle_full',
					'mediaGroup',
					'decisionList',
					'taskList',
					'blockCard',
					'embedCard',
					'extension_with_marks',
					'nestedExpand_with_no_marks',
					'nestedExpand',
				],
			],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['tableHeader'],
		},
	},
	required: ['content'],
};

export const tableRow: {
	props: {
		attrs: {
			optional: boolean;
			props: {
				localId: {
					optional: boolean;
					type: string;
				};
			};
		};
		content: {
			items: string[][];
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			optional: true,
			props: {
				localId: {
					optional: true,
					type: 'string',
				},
			},
		},
		content: {
			items: [['tableCell', 'tableHeader']],
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['tableRow'],
		},
	},
};

export const taskItem: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
				state: {
					type: string;
					values: string[];
				};
			};
		};
		content: {
			allowUnsupportedInline: boolean;
			items: string[];
			optional: boolean;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
				state: {
					type: 'enum',
					values: ['TODO', 'DONE'],
				},
			},
		},
		content: {
			allowUnsupportedInline: true,
			items: ['inline_content'],
			optional: true,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['taskItem'],
		},
	},
};

export const taskList: {
	props: {
		attrs: {
			props: {
				localId: {
					type: string;
				};
			};
		};
		content: {
			allowUnsupportedBlock: boolean;
			items: string[][];
			minItems: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				localId: {
					type: 'string',
				},
			},
		},
		content: {
			allowUnsupportedBlock: true,
			items: [['taskItem', 'taskList', 'blockTaskItem']],
			minItems: 1,
			type: 'array',
		},
		type: {
			type: 'enum',
			values: ['taskList'],
		},
	},
};

export const text: {
	props: {
		marks: {
			items: never[];
			optional: boolean;
			type: string;
		};
		text: {
			minLength: number;
			type: string;
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		marks: {
			items: [],
			optional: true,
			type: 'array',
		},
		text: {
			minLength: 1,
			type: 'string',
		},
		type: {
			type: 'enum',
			values: ['text'],
		},
	},
};

export const text_code_inline: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'text',
	{
		props: {
			marks: {
				items: [['code', 'link', 'annotation']],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const text_formatted: (
	| string
	| {
			props: {
				marks: {
					items: string[][];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'text',
	{
		props: {
			marks: {
				items: [
					[
						'link',
						'em',
						'strong',
						'strike',
						'subsup',
						'underline',
						'textColor',
						'annotation',
						'backgroundColor',
					],
				],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const text_link_inline: (
	| string
	| {
			props: {
				marks: {
					items: string[];
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'text',
	{
		props: {
			marks: {
				items: ['link'],
				optional: true,
				type: 'array',
			},
		},
	},
];

export const text_with_no_marks: (
	| string
	| {
			props: {
				marks: {
					items: never[];
					maxItems: number;
					optional: boolean;
					type: string;
				};
			};
	  }
)[] = [
	'text',
	{
		props: {
			marks: {
				items: [],
				maxItems: 0,
				optional: true,
				type: 'array',
			},
		},
	},
];

export const textColor: {
	props: {
		attrs: {
			props: {
				color: {
					pattern: string;
					type: string;
				};
			};
		};
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		attrs: {
			props: {
				color: {
					pattern: '^#[0-9a-fA-F]{6}$',
					type: 'string',
				},
			},
		},
		type: {
			type: 'enum',
			values: ['textColor'],
		},
	},
};

export const underline: {
	props: {
		type: {
			type: string;
			values: string[];
		};
	};
} = {
	props: {
		type: {
			type: 'enum',
			values: ['underline'],
		},
	},
};
