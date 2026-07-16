import PropTypes from 'prop-types';

export const ContextTypes: {
	getParentAnalyticsData: PropTypes.Requireable<(...args: any[]) => any>;
	onAnalyticsEvent: PropTypes.Requireable<(...args: any[]) => any>;
} = {
	onAnalyticsEvent: PropTypes.func,
	getParentAnalyticsData: PropTypes.func,
};
