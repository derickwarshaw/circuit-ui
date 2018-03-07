import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';

import { standard } from '../../themes';
import { textMega, disableVisually } from '../../styles/style-helpers';

const invalidStyles = ({ theme, invalid }) =>
  invalid &&
  css`
    label: input--error;
    &:not(:focus) {
      border-color: ${theme.colors.r300};

      &::placeholder {
        color: ${theme.colors.r300};
      }
    }
  `;

const optionalStyles = ({ theme, optional }) =>
  optional &&
  css`
    label: input--optional;
    background-color: ${theme.colors.n100};
    border-style: dashed;
    box-shadow: none;
  `;

const disabledStyles = ({ disabled }) =>
  disabled &&
  css`
    label: input--disabled;
    ${disableVisually()};
  `;

const inlineStyles = ({ theme, inline }) =>
  inline &&
  css`
    label: input--inline;
    display: inline-block;
    margin-right: ${theme.spacings.mega};
  `;

const textAlignLeftStyles = ({ theme, textAlign }) =>
  textAlign === 'left' &&
  css`
    text-align: left;
  `;

const textAlignRightStyles = ({ theme, textAlign }) =>
  textAlign === 'right' &&
  css`
    text-align: right;
  `;

const baseStyles = ({ theme }) => css`
  label: input;
  background-color: ${theme.colors.white};
  border-width: 1px;
  border-style: solid;
  border-color: ${theme.colors.n300};
  border-radius: ${theme.borderRadius.mega};
  box-shadow: inset 0 1px 2px 0 rgba(102, 113, 123, 0.12);
  color: ${theme.colors.n900};
  padding: ${theme.spacings.byte} ${theme.spacings.kilo};
  margin-bottom: ${theme.spacings.mega};
  display: block;
  ${textMega({ theme })};

  &:focus,
  &:active {
    border: 1px solid ${theme.colors.b500};
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.n500};
  }
`;

// TODO: Add dynamic invalid aria attribute.
/**
 * Input component for forms.
 */
const Input = styled('input')`
  ${baseStyles};
  ${disabledStyles};
  ${optionalStyles};
  ${invalidStyles};
  ${inlineStyles};
  ${textAlignLeftStyles};
  ${textAlignRightStyles};
`;

Input.propTypes = {
  /**
   * Triggers error styles on the component.
   */
  invalid: PropTypes.bool,
  /**
   * Triggers optional styles on the component.
   */
  optional: PropTypes.bool,
  /**
   * Triggers disabled styles on the component. This is also forwarded as
   * attribute to the <input> element.
   */
  disabled: PropTypes.bool,
  /**
   * Autocomplete attribute to be passed down to the <input> element.
   */
  autoComplete: PropTypes.string,

  textAlign: PropTypes.oneOf(['left', 'right'])
};

Input.defaultProps = {
  invalid: false,
  optional: false,
  disabled: false,
  autoComplete: 'none',
  textAlign: 'left'
};

/**
 * @component
 */
export default withTheme(Input);
