import React, { PureComponent } from "react";
import { ListItem as ListItemReal } from '@ui-kitten/components';
import { PropTypes } from 'prop-types';
import debounce from "lodash.debounce";

class ListItem extends PureComponent {
  constructor(props) {
    super(props);

  }

  debouncedOnPress = () => {
    this.props.onPress && this.props.onPress();
  }

  onPress = debounce(this.debouncedOnPress, (this.props.delay ? this.props.delay : 2000), { leading: true, trailing: false });

  render() {
    return (
      <ListItemReal {...this.props} onPress={this.onPress}>
        {this.props.children}
      </ListItemReal>
    );
  }
}

ListItemReal.defaultProps = {
  style: {}
};
export default ListItem;
