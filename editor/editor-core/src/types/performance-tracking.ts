export type TransactionTracking = {
  // Wether transactionTracking should be enabled
  // default: false
  enabled: boolean;

  // The nth transaction after which a `dispatchTransaction` event is sent.
  // default: 100
  samplingRate?: number;

  // Transactions that need longer to dispatch than this generate a `dispatchTransaction` event
  // unit: ms
  // default: 300
  slowThreshold?: number;

  // Transactions that need longer to dispatch than AND have outlier plugins
  // generate a `dispatchTransaction` event
  // unit: ms
  // default: 30
  outlierThreshold?: number;

  // The factor by which statistically significant outliers in plugin execution times are computed
  // where t = p75 + (p75 - p25) * outlierFactor
  // minor outliers: 1.5
  // majour outliers: 3.0
  // default: 3
  outlierFactor?: number;
};

export type UITracking = {
  // default: false
  enabled: boolean;

  // The nth re-render of WithPluginState after which an analytics event is sent.
  // default: 100
  samplingRate?: number;

  // WithPluginState render that exceeds the threshold generate analytics event
  // unit: ms
  // default: 4ms
  slowThreshold?: number;
};

export type NodeViewTracking = {
  // default: false
  enabled: boolean;

  // The nth re-render of WithPluginState after which an analytics event is sent.
  // default: 100
  samplingRate?: number;

  // WithPluginState render that exceeds the threshold generate analytics event
  // unit: ms
  // default: 7ms
  slowThreshold?: number;
};
