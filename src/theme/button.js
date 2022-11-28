import React, { PureComponent } from "react";
import { Button as ButtonReal } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import debounce from "lodash.debounce";

class Button extends PureComponent {
  constructor(props) {
    super(props);

  }

  debouncedOnPress = () => {
    this.props.onPress && this.props.onPress();
  }

  onPress = debounce(this.debouncedOnPress, (this.props.delay ? this.props.delay : 1000), { leading: true, trailing: false });

  render() {
    return (
      <ButtonReal {...this.props} onPress={this.onPress}>
        {this.props.children}
      </ButtonReal>
    );
  }
}

ButtonReal.defaultProps = {
  style: {}
};
export default Button;
