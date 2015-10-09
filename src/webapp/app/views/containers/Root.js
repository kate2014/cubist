import React from 'react';

if (process.env.BROWSER) {
  require('webapp/app/styles/containers/Root.scss');
}

const CLASS_NAME = 'cb-root';

class Root extends React.Component {

  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    const {children} = this.props;

    return (
      <div className={CLASS_NAME}>
        {children}
      </div>
    );
  }
}

export default Root;