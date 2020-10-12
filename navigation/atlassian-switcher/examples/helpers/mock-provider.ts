import asDataProvider from '../../src/common/providers/as-data-provider';

interface MockDataStructure {
  data: string;
}

const SOME_STATIC_DATA: MockDataStructure = {
  data: 'yay!',
};

export default asDataProvider('mock', () => Promise.resolve(SOME_STATIC_DATA));
