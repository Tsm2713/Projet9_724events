/* eslint react/require-default-props: 0 */
import PropTypes from "prop-types";
import "./style.scss";

export const BUTTON_TYPES = {
  DEFAULT: 1,
  SUBMIT: 2,
};

const Button = ({
  title = "",
  onClick = () => null,
  type = BUTTON_TYPES.DEFAULT,
  disabled = false,
  children = null,
}) => {
  switch (type) {
    case BUTTON_TYPES.SUBMIT:
      return (
        <input
          disabled={disabled}
          className="Button"
          type="submit"
          data-testid="button-test-id"
          value={children}
          onClick={onClick}
          title={title}
        />
      );
    case BUTTON_TYPES.DEFAULT:
    default:
      return (
        <button
          type="button"
          disabled={disabled}
          className="Button"
          data-testid="button-test-id"
          onClick={onClick}
          title={title}
        >
          {children}
        </button>
      );
  }
};

Button.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.number,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
