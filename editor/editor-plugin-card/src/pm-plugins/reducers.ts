import type {
	CardPluginAction,
	CardPluginState,
	HideDatasourceModal,
	HideLinkToolbar,
	Queue,
	Register,
	RegisterSmartCardEvents,
	RemoveDatasourceStash,
	Request,
	Resolve,
	SetCardLayout,
	SetCardLayoutAndDatasourceTableRef,
	SetDatasourceStash,
	SetDatasourceTableRef,
	SetProvider,
	ShowDatasourceModal,
	ShowLinkToolbar,
} from '../types';

const queue = (state: CardPluginState, action: Queue) => {
	return {
		...state,
		requests: state.requests.concat(action.requests),
	};
};

const resolve = (state: CardPluginState, action: Resolve) => {
	const requests = state.requests.reduce((requests, request) => {
		if (request.url !== action.url) {
			requests.push(request);
		}

		return requests;
	}, [] as Request[]);

	return {
		...state,
		requests,
	};
};

const register = (state: CardPluginState, action: Register) => {
	return {
		...state,
		cards: state.cards.filter((card) => card.pos !== action.info.pos).concat(action.info),
	};
};

const setProvider = (state: CardPluginState, action: SetProvider) => {
	return { ...state, provider: action.provider };
};

const setCardLayout = (state: CardPluginState, action: SetCardLayout) => {
	return { ...state, layout: action.layout };
};

const setDatasourceTableRef = (state: CardPluginState, action: SetDatasourceTableRef) => {
	return { ...state, datasourceTableRef: action.datasourceTableRef };
};

const setCardLayoutDatasourceTableRef = (
	state: CardPluginState,
	action: SetCardLayoutAndDatasourceTableRef,
) => {
	return {
		...state,
		datasourceTableRef: action.datasourceTableRef,
		layout: action.layout,
	};
};

const registerEvents = (state: CardPluginState, action: RegisterSmartCardEvents) => {
	return { ...state, smartLinkEvents: action.smartLinkEvents };
};

const setLinkToolbar = (state: CardPluginState, action: ShowLinkToolbar | HideLinkToolbar) => {
	return {
		...state,
		showLinkingToolbar: action.type === 'SHOW_LINK_TOOLBAR',
	};
};

const showDatasourceModal = (
	state: CardPluginState,
	action: ShowDatasourceModal | HideDatasourceModal,
) => {
	return {
		...state,
		showDatasourceModal: true,
		datasourceModalType: action.type === 'SHOW_DATASOURCE_MODAL' ? action.modalType : undefined,
	};
};

const hideDatasourceModal = (state: CardPluginState) => {
	return {
		...state,
		showDatasourceModal: false,
		datasourceModalType: undefined,
	};
};

const clearOverlayCandidate = (state: CardPluginState) => {
	return {
		...state,
		overlayCandidatePosition: undefined,
	};
};

const registerRemoveOverlayOnInsertedLink = (
	state: CardPluginState,
	action: { callback: () => void },
) => {
	return {
		...state,
		removeOverlay: action.callback,
	};
};

const setDatasourceStash = (
	state: CardPluginState,
	action: SetDatasourceStash,
): CardPluginState => {
	return {
		...state,
		datasourceStash: {
			...state.datasourceStash,
			[action.datasourceStash.url]: { views: action.datasourceStash.views },
		},
	};
};

const removeDatasourceStash = (
	state: CardPluginState,
	action: RemoveDatasourceStash,
): CardPluginState => {
	const { [action.url]: _, ...datasourceStash } = state.datasourceStash;
	return {
		...state,
		datasourceStash,
	};
};

export default (state: CardPluginState, action: CardPluginAction): CardPluginState => {
	switch (action.type) {
		case 'QUEUE':
			return queue(state, action);
		case 'SET_PROVIDER':
			return setProvider(state, action);
		case 'RESOLVE':
			return resolve(state, action);
		case 'REGISTER':
			return register(state, action);
		case 'REGISTER_EVENTS':
			return registerEvents(state, action);
		case 'SET_DATASOURCE_TABLE_REF':
			return setDatasourceTableRef(state, action);
		case 'SET_CARD_LAYOUT':
			return setCardLayout(state, action);
		case 'SET_CARD_LAYOUT_AND_DATASOURCE_TABLE_REF':
			return setCardLayoutDatasourceTableRef(state, action);
		case 'SHOW_LINK_TOOLBAR':
		case 'HIDE_LINK_TOOLBAR':
			return setLinkToolbar(state, action);
		case 'SHOW_DATASOURCE_MODAL':
			return showDatasourceModal(state, action);
		case 'HIDE_DATASOURCE_MODAL':
			return hideDatasourceModal(state);
		case 'CLEAR_OVERLAY_CANDIDATE':
			return clearOverlayCandidate(state);
		case 'REGISTER_REMOVE_OVERLAY_ON_INSERTED_LINK':
			return registerRemoveOverlayOnInsertedLink(state, action);
		case 'SET_DATASOURCE_STASH':
			return setDatasourceStash(state, action);
		case 'REMOVE_DATASOURCE_STASH':
			return removeDatasourceStash(state, action);
	}
};
