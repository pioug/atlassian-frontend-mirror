const context = 'Document';
const googleDefinitionId = 'google';
const trelloDefinitionId = 'trello';
const dropboxDefinitionId = 'dropbox';

const serviceAuth = {
	key: 'default',
	displayName: 'Google',
	url: 'https://outbound-auth-flow.ap-southeast-2.dev.atl-paas.net/start?containerId=f4d9cdf9-9977-4c40-a4d2-968a4986ade0&serviceKey=default',
};

const generator = {
	name: 'Google Drive',
	icon: {
		url: 'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico',
	},
};

const genResolvedBody = (definitionId: string, name: string) => ({
	meta: {
		visibility: 'restricted',
		access: 'granted',
		auth: [serviceAuth],
		definitionId,
	},
	data: {
		'@type': ['Document'],
		'@context': context,
		generator,
		name,
		updated: '2018-07-19T03:34:07.930Z',
		updatedBy: {
			'@type': 'Person',
			name: 'Artur Bodera',
		},
	},
});

const genUnauthorisedBody = (definitionId: string) => ({
	meta: {
		visibility: 'restricted',
		access: 'unauthorized',
		auth: [serviceAuth],
		definitionId,
	},
	data: {
		'@context': context,
		generator,
	},
});

const gebForbiddenBody = (definitionId: string) => ({
	meta: {
		visibility: 'restricted',
		access: 'forbidden',
		auth: [serviceAuth],
		definitionId,
	},
	data: {
		'@context': context,
		generator,
	},
});

const responses: {
	'google.com': {
		'google.com/doc/1': (
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| undefined
		)[];
		'google.com/doc/2': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| undefined
		)[];
		'google.com/doc/3': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| undefined
		)[];
		'google.com/spreadshet/1': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| undefined
		)[];
		'google.com/spreadshet/2': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| undefined
		)[];
	};
	'trello.com': {
		'trello.com/task/a': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
		)[];
	};
	'dropbox.com': {
		'dropbox.com/file/a': (
			| {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
					};
			  }
			| ((resourceUrl: string) => {
					meta: {
						visibility: string;
						access: string;
						auth: {
							key: string;
							displayName: string;
							url: string;
						}[];
						definitionId: string;
					};
					data: {
						'@type': string[];
						'@context': string;
						generator: {
							name: string;
							icon: {
								url: string;
							};
						};
						name: string;
						updated: string;
						updatedBy: {
							'@type': string;
							name: string;
						};
					};
			  })
			| undefined
		)[];
	};
} = {
	'google.com': {
		'google.com/doc/1': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(googleDefinitionId, resourceUrl),
			gebForbiddenBody(googleDefinitionId),
			undefined,
			genUnauthorisedBody(googleDefinitionId),
			undefined,
		],
		'google.com/doc/2': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(googleDefinitionId, resourceUrl),
			gebForbiddenBody(googleDefinitionId),
			undefined,
			genUnauthorisedBody(googleDefinitionId),
			undefined,
		],
		'google.com/doc/3': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(googleDefinitionId, resourceUrl),
			undefined,
			gebForbiddenBody(googleDefinitionId),
			gebForbiddenBody(googleDefinitionId),
			genUnauthorisedBody(googleDefinitionId),
			undefined,
			undefined,
		],
		'google.com/spreadshet/1': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(googleDefinitionId, resourceUrl),
			gebForbiddenBody(googleDefinitionId),
			undefined,
			genUnauthorisedBody(googleDefinitionId),
			undefined,
		],
		'google.com/spreadshet/2': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(googleDefinitionId, resourceUrl),
			gebForbiddenBody(googleDefinitionId),
			undefined,
			genUnauthorisedBody(googleDefinitionId),
			undefined,
		],
	},
	'trello.com': {
		'trello.com/task/a': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(trelloDefinitionId, resourceUrl),
			gebForbiddenBody(trelloDefinitionId),
			genUnauthorisedBody(trelloDefinitionId),
		],
	},
	'dropbox.com': {
		'dropbox.com/file/a': [
			(
				resourceUrl: string,
			): {
				meta: {
					visibility: string;
					access: string;
					auth: {
						key: string;
						displayName: string;
						url: string;
					}[];
					definitionId: string;
				};
				data: {
					'@type': string[];
					'@context': string;
					generator: {
						name: string;
						icon: {
							url: string;
						};
					};
					name: string;
					updated: string;
					updatedBy: {
						'@type': string;
						name: string;
					};
				};
			} => genResolvedBody(dropboxDefinitionId, resourceUrl),
			gebForbiddenBody(dropboxDefinitionId),
			gebForbiddenBody(dropboxDefinitionId),
			undefined,
			genUnauthorisedBody(dropboxDefinitionId),
			undefined,
		],
	},
};

export { responses };
