/* eslint-disable @atlaskit/editor/no-re-export */
export {
	getLastPredictionDebug,
	getPredictorStatus,
	incrementSessionFreq,
	ingestDocumentPage,
	initL3Vocabulary,
	initVectors,
	initVocabulary,
	loadDefaultVocabulary,
	loadVectorsAsync,
	predict,
} from '../pm-plugins/text-predictor';
export type { TenantVocabulary, WeightedTerm } from '../pm-plugins/text-predictor';
