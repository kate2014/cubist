import React from 'react';
import { connect } from 'react-redux';

import { ModelCanvas } from '../render';
import { RenderActions } from 'webapp/actions';

const CLASS_NAME = 'cb-model-viewer';

/**
 * Main Model Viewer to interact with model
 */
class ModelViewer extends React.Component {
  static propTypes = {
    wireframe: React.PropTypes.bool,
    shadingMode: React.PropTypes.number,
    autoRotate: React.PropTypes.bool,
    modelData: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired
  }

  _onToggleWireframeButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleWireframe());
  }

  _onToggleShadingButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleShading());
  }

  _onToggleAutoRotateButtonClick = () => {
    const { dispatch } = this.props;
    dispatch(RenderActions.toggleAutoRotate());
  }

  render() {
    return (
      <div className={ CLASS_NAME }>
        <ModelCanvas { ...this.props } />
        <button type="button"
          className="btn btn-success"
          onClick={ this._onToggleWireframeButtonClick }>
          Toggle Wireframe
        </button>
        <button type="button"
          className="btn btn-success"
          onClick={ this._onToggleShadingButtonClick }>
          Toggle Shading
        </button>
        <button type="button"
          className="btn btn-success"
          onClick={ this._onToggleAutoRotateButtonClick }>
          Toggle Auto-Rotate
        </button>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    wireframe: state.RenderStore.get('wireframe'),
    shadingMode: state.RenderStore.get('shadingMode'),
    autoRotate: state.RenderStore.get('autoRotate')
  };
})(ModelViewer);
