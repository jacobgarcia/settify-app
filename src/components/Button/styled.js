import styled, {css} from 'styled-components';
import {Text} from 'native-base';
import theme from 'styles/theme.style.js';
const PRIMARY_STYLE = css`
  background-color: ${theme.COLOR_PRIMARY};
  color: ${theme.COLOR_LIGHT_GREY_100};
`;

const SECONDARY_STYLE = css`
  background-color: var(--color-light-grey-100);
  border: 1px solid var(--color-neutral--dark);
  color: var(--color-neutral--dark);
`;

const COMPLEMENTARY_STYLE = css`
  background-color: var(--color-neutral);
  color: var(--color-light-grey-100);
`;

const WARNING_STYLE = css`
  background-color: var(--color-alert);
  color: var(--color-light-grey-100);
`;

const DESTRUCTIVE_STYLE = css`
  background-color: var(--color-destructive);
  color: var(--color-light-grey-100);
`;

const BUTTON_STYLES = {
  primary: PRIMARY_STYLE,
  secondary: SECONDARY_STYLE,
  complementary: COMPLEMENTARY_STYLE,
  destructive: DESTRUCTIVE_STYLE,
  warning: WARNING_STYLE,
};

const StyledButtonView = styled.View`
  border-radius: 32px;
  padding: 0px 8px;
  margin: 8px;
  height: 45px;
  ${props => BUTTON_STYLES[props.kind] || BUTTON_STYLES.primary};
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: 600;
`;

export {StyledButtonView, ButtonText};
