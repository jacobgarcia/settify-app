import React from 'react';
import PropTypes from 'prop-types';

import {Button as RNButton} from 'native-base';
import {StyledButtonView, ButtonText} from './styled';

const Button = props => {
  const {
    onClick,
    disabled,
    rounded,
    loading,
    kind,
    text,
    type,
    id,
    onPress,
    styles,
  } = props;

  return (
    <StyledButtonView>
      <RNButton
        id={id}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        kind={kind}
        rounded={rounded}
        transparent
        style={styles}
        onPress={onPress}>
        <ButtonText>{text}</ButtonText>
      </RNButton>
    </StyledButtonView>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  loading: PropTypes.bool,
  uppercase: PropTypes.bool,
  id: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  kind: PropTypes.oneOf([
    'primary',
    'secondary',
    'complementary',
    'destructive',
    'warning',
  ]),
};

Button.defaultProps = {
  onClick: () => {},
  children: '',
  disabled: false,
  rounded: false,
  loading: false,
  uppercase: false,
  id: '',
  text: '',
  kind: 'primary',
  type: 'button',
};

export default Button;
