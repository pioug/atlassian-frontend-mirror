import React, { Component } from 'react';

import { FeedbackForm } from '../src';

class DisplayFeedback extends Component {
	close = () => {
		// close feedback collector
		console.log('close feedback collector');
	};

	submitForm = async (data: Object) => {
		// submit your form manually here
		console.log('Submitting feedback form', data);
	};

	render() {
		return <FeedbackForm locale={'en'} onClose={this.close} onSubmit={this.submitForm} />;
	}
}

export default () => <DisplayFeedback />;
