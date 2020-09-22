export type TTITracking = {
  /**
   * @description Wether ttiTracking should be enabled
   * @default: false
   */
  enabled: boolean;

  /**
   * @description Time between long tasks that tti measurement considers long enough to treat page as interactive in ms
   * @default: 1000
   */
  ttiIdleThreshold?: number;

  /**
   * @description Time in [seconds] after which to stop tti measurements, used to prevent issues when page never becomes responsive, e.g. infinite loops in rendering / etc...
   * @default: 60
   */
  ttiCancelTimeout?: number;
};

export type TransactionTracking = {
  /**
   * @description Wether transactionTracking should be enabled. When this is false no measurements are taken and no events are sent.
   * @default false
   **/
  enabled: boolean;

  /**
   * @description The nth transaction after which a `dispatchTransaction` event is sent. Depends on enabled being true.
   * @default 100
   **/
  samplingRate?: number;

  /**
   * @description Transactions that need longer to dispatch than [slowThreshold]ms generate a `dispatchTransaction` event. Depends on enabled being true.
   * @default 300
   **/
  slowThreshold?: number;

  /**
   * @description Transactions that need longer to dispatch than [outlierThreshold]ms AND have outlier plugins generate a `dispatchTransaction` event. Depends on enabled being true.
   * @default 30
   **/
  outlierThreshold?: number;

  /**
   * @description The factor by which statistically significant outliers in plugin execution times are computed where t = p75 + (p75 - p25) * outlierFactor.
   * @default 3
   **/
  outlierFactor?: number;
};

export type UITracking = {
  /**
   * @description Wether tracking of WithPluginState should be enabled. When this is false no measurements are taken and no events are sent.
   * @default false
   **/
  enabled: boolean;

  /**
   * @description The nth re-render of WithPluginState after which an analytics event is sent. Depends on enabled being true.
   * @default 100
   **/
  samplingRate?: number;

  /**
   * @description WithPluginState render that exceeds [slowThreshold]ms generate analytics event. Depends on enabled being true.
   * @default 4
   **/
  slowThreshold?: number;
};

export type NodeViewTracking = {
  /**
   * @description Control wether NodeView performance is tracked. When this is false no measurements are taken and no events are sent.
   * @default false
   */
  enabled: boolean;

  /**
   * @description The nth re-render of NodeView after which an analytics event is sent. Depends on enabled being true.
   * @default false
   */
  samplingRate?: 100;

  /**
   * @description NodeView render that exceeds the threshold generate analytics event. Depends on enabled being true.
   * @default 7
   */
  slowThreshold?: number;
};

export interface InputTracking {
  /**
   * @description Control wether samples of typing performance are taken. When this is false no measurements are taken and no events are sent.
   * @default false
   */
  enabled: boolean;

  /**
   * @description Control wether samples of typing performance are taken. Depends on enabled being true.
   * @default false
   */
  countNodes?: boolean;

  /**
   * @description Control for which nth transaction a typing performance sample is taken. Depends on enabled being true.
   * @default 100
   */
  samplingRate?: number;

  /**
   * @description input events that exceed [slowThreshold]ms generate analytics event. Depends on enabled being true.
   * @default 100
   */
  slowThreshold?: number;

  /**
   * @description input events that exceed [freezeThreshold]ms generate analytics event. Depends on enabled being true.
   * @default 100
   */
  freezeThreshold?: number;
}

export type PerformanceTracking = {
  /**
   * @description Control wether time to interactive is tracked
   */
  ttiTracking?: TTITracking;

  /**
   * @description Control wether transactions are tracked
   */
  inputTracking?: InputTracking;

  /**
   * @description Control wether transactions are tracked
   */
  transactionTracking?: TransactionTracking;

  /**
   * @description Control wether editor ui is tracked
   */
  uiTracking?: UITracking;

  /**
   * @description Control wether nodeviews are tracked
   */
  nodeViewTracking?: NodeViewTracking;
};
