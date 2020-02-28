import React from 'react';
import {Button as RNButton, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import theme from 'styles/theme.style.js';
import StyledButtonView from './styled';

const Button = props => {
  const {
    onClick,
    disabled,
    rounded,
    uppercase,
    loading,
    className,
    kind,
    text,
    children,
    type,
    id,
    ...rest
  } = props;

  return (
    <StyledButtonView>
      <RNButton
        id={id}
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled || loading}
        kind={kind}
        rounded={rounded}
        {...rest}
        style={styles.button}
      />
    </StyledButtonView>
  );
};

const styles = StyleSheet.create({
  button: {
    fontFamily: theme.FAMILY_SANS_SERIF,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
    width: 'auto',
    fontSize: 16,
    minHeight: 36,
    minWidth: 120,
  },
});

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  loading: PropTypes.bool,
  uppercase: PropTypes.bool,
  id: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  className: PropTypes.string,
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
  className: '',
  kind: 'primary',
  type: 'button',
};

export default Button;
