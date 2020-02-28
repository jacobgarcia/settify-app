import styled, {css} from 'styled-components';
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
  height: 40px;
  ${props => BUTTON_STYLES[props.kind] || BUTTON_STYLES.primary}
`;

/*
border: none;
font-family: ${theme.FAMILY_SANS_SERIF};
font-weight: bold;
line-height: 32px;
text-align: center;
width: auto;
font-size: 16px;
font-weight: ${theme.FONT_WEIGHT_MEDIUM};
min-height: 36px;
min-width: 120px;

 */
export default StyledButtonView;
