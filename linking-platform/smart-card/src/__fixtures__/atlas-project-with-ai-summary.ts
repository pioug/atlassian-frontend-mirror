import mockAtlasProject from './atlas-project';

const mockAtlasProjectWithAISummary: any = JSON.parse(JSON.stringify(mockAtlasProject));
mockAtlasProjectWithAISummary.meta.supportedFeature = ['AISummary'];

export default mockAtlasProjectWithAISummary;
