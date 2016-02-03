import THREE from 'three';
import _ from 'lodash';

import OrbitControls from './OrbitControls';

// let TWEEN;
// if (process.env.BROWSER) {
//   TWEEN = require('tween.js');
// }

class ModelScene {
  // Renderer of the Scene
  renderer = undefined;
  // The Scene
  scene = undefined;
  // The Main Camera in the scene
  camera = undefined;
  // The main front light
  frontLight = undefined;
  // Background scene and camera
  backgroundScene = undefined;
  backgroundCamera = undefined;
  // The Model
  model = undefined;
  // Stores currently displayed objects (meshes/models)
  displayObjects = [];
  // Orbit Controls
  controls = undefined;
  // Current Rendering State
  renderingState = {
    wireframe: false,
    shadingMode: 0,
    shading: THREE.SmoothShading
  };
  // Camera State
  cameraState = {
    autoRotate: false,
    resetView: false,
    playbackWalkthrough: false
  };

  target = {
    x: 100,
    y: 450,
    z: 500
  };

  source = {
    x: 0,
    y: 450,
    z: 500
  };

  /*
  cameraCoordinate = {
    pos_x: 0,
    pos_y: 0,
    pos_z: 0
  };
  */

  /**
   * Constructor function of the scene
   * @param  {DOMElement} sceneCanvas [the dom element for the canvas containing the scene]
   * @param  {Object} dimensions  [dimensions data of the canvas]
   */
  constructor(sceneCanvas, dimensions) {
    this._init(sceneCanvas, dimensions);
  }

  _init(sceneCanvas, dimensions) {
    this._initRenderer(sceneCanvas, dimensions);
    this._initScene();
    this._initCamera(dimensions);
    this._initBackground();
    this._initLight();
    this._initControls(dimensions);

    this._animate();
  }

  _initRenderer(sceneCanvas, dimensions) {
    this.renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, antialias: true });
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x212121, 0); // Alpha value set to 0 for transparancy
    this.renderer.autoClear = false;
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initCamera(dimensions) {
    this.camera = new THREE.PerspectiveCamera(45, dimensions.aspectRatio, 0.1, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(0, 450, 450);
    this.camera.lookAt(this.scene.position);
  }

  _initBackground() {
    // Load background texture
    const texture = THREE.ImageUtils.loadTexture('/models/doge.jpeg');
    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 0),
      new THREE.MeshBasicMaterial({
        map: texture
      }));
    // Turn off any depth checking
    backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;
    // Create the background scene
    this.backgroundScene = new THREE.Scene();
    this.backgroundCamera = new THREE.Camera();
    this.backgroundScene.add(this.backgroundCamera);
    this.backgroundScene.add(backgroundMesh);
  }

  _initLight() {
    // Main front light
    this.frontLight = new THREE.PointLight(0xdddddd);
    this.frontLight.castShadow = true;
    this.camera.add(this.frontLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x444444);
    this.scene.add(ambientLight);
  }

  _initControls(dimensions) {
    this.controls = new OrbitControls(this.camera, dimensions);
  }

  /**
   * Frame updater function
   */
  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.controls.update();
    this._render();
  }

  /**
   * Render function which will be called for every fame
   */
  _render() {
    this.renderer.clear();
    // Render background first so that the model appears in front
    this.renderer.render(this.backgroundScene, this.backgroundCamera);
    this.renderer.render(this.scene, this.camera);
  }

  // Playback for Walkthrough
  _playbackWalkthrough() {
    const destX = 0;
    const destY = 500;

    if (this.cameraState.playbackWalkthrough) {
      this.camera.position.x += (destX - this.camera.position.x) * 0.05;
      this.camera.position.y += (- destY - this.camera.position.y) * 0.05;

      this.camera.lookAt(this.scene.position);

      this.renderer.render(this.scene, this.camera);

      this.cameraState.playbackWalkthrough = false;
    }
  }

  /**
   * Update the objects (meshes/models) displayed in the scene
   */
  updateSceneObjects() {
    this.removeSceneObjects();
    this.displayObjects = this._getDisplayObjects();
    for (let i = 0; i < this.displayObjects.length; i++) {
      this.displayObjects[i].scale.set(40, 40, 40);
      this.displayObjects[i].position.y = -20;
      this.scene.add(this.displayObjects[i]);
    }
  }

  /**
   * Update the model variable of this class
   * @param  {Object} model [the new model to be displayed]
   */
  updateModel(model) {
    this.model = model;
    this.updateObjectVertexNormals();
    this.updateSceneObjects();
  }

  /**
   * Update the rendering state of the model
   * @param  {Object} state [the new state which will be merged with the existing state]
   */
  updateRenderingState(state) {
    Object.assign(this.renderingState, state);
    this.updateSceneObjects();
  }

  updateCameraState(state) {
    Object.assign(this.cameraState, state);
    this.controls.resetView = this.cameraState.resetView;
    this.controls.autoRotate = this.cameraState.autoRotate;
    this.cameraState.resetView = false;
    this.controls.playbackWalkthrough = this.cameraState.playbackWalkthrough;
  }

  /**
   * Remove objects (models/meshes) currently displayed in the scene
   */
  removeSceneObjects() {
    for (let i = 0; i < this.displayObjects.length; i++) {
      this.scene.remove(this.displayObjects[i]);
    }
  }

  /**
    * Run through all meshes in the model object and have threejs calculate their vertex normals
  */
  updateObjectVertexNormals() {
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        child.geometry.normalsNeedUpdate = true;
      }
    });
  }
  /**
   * Get the objects to display based on this.model and rendering state
   */
  _getDisplayObjects() {
    const objects = [];
    const { wireframe, shadingMode } = this.renderingState;
    // Default Shading Mode
    if (shadingMode === 0 || 1) {
      objects.push(this.model);
    }
    // Shadeless Mode - turn lights off in shadeless mode
    if (shadingMode === 1) {
      this.frontLight.visible = false;
    } else {
      this.frontLight.visible = true;
    }
    // Smooth Shading mode
    if (shadingMode === 2) {
      this.model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0xc0c0c0,
            shading: THREE.SmoothShading,
            wireframe: false,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }
    // Flat Shading mode
    if (shadingMode === 3) {
      this.model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0xc0c0c0,
            shading: THREE.FlatShading,
            wireframe: false,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }

    if (wireframe) {
      this.model.traverse(child => {
        if (child instanceof THREE.Mesh) {
          const newMesh = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
            color: 0x00e0c0,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
          }));
          objects.push(newMesh);
        }
      });
    }
    return objects;
  }

  /**
   * Handler function for the scene when the scene dimensions are modified
   * @param  {Object} dimensions [data of the scene dimensions]
   */
  onResize(dimensions) {
    this.camera.aspect = dimensions.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.controls.setDimensions(dimensions.width, dimensions.height);
  }

  onMouseDown(event, callback) {
    this.controls.onMouseDown(event);
    callback(this.getCameraOrbit());
  }

  onMouseMove(event, callback) {
    this.controls.onMouseMove(event);
    callback(this.getCameraOrbit());
  }

  onMouseUp(event, callback) {
    this.controls.onMouseUp(event);
    callback(this.getCameraOrbit());
  }

  onWheel(event, callback) {
    this.controls.onMouseWheel(event);
    callback(this.getCameraOrbit());
  }

  getCameraOrbit() {
    const coordinateFields = ['x', 'y', 'z'];
    const lookAt = new THREE.Vector3(0, 0, -1);
    lookAt.applyMatrix4(this.camera.matrixWorld);
    return {
      position: _.pick(this.camera.position, coordinateFields),
      up: _.pick(this.camera.up, coordinateFields),
      lookAt: _.pick(this.camera.lookAt, coordinateFields)
    };
  }

  /**
   * Dispose all entities in scene
   */
  dispose() {

  }
}

export default ModelScene;
