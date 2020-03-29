import PropTypes from 'prop-types';
import styled from 'styled-components';
import { animationTime } from '../../shared-variables';

const transition = `height ${animationTime}, opacity ${animationTime}`;

const RevealInner = styled.div`
  flex-shrink: 0;
  height: ${props => (props.isOpen ? props.openHeight : 0)}px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: ${props => (props.shouldAnimate ? transition : 'none')};
`;

RevealInner.displayName = 'RevealInner';

RevealInner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  openHeight: PropTypes.number.isRequired,
};

export default RevealInner;
