import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');
scene.fog = new THREE.Fog( 0xcccccc, 1, 40 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 10, 20); 

const planeSize = 40;
const loader = new THREE.TextureLoader();
const texture = loader.load('./checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
const planeMat = new THREE.MeshPhongMaterial( { map: texture, side: THREE.DoubleSide } );
const mesh = new THREE.Mesh( planeGeo, planeMat );
mesh.rotation.x = Math.PI * -.5;
scene.add( mesh );

const cubeSize = 4;
const geometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
const material = new THREE.MeshPhongMaterial( {map: loadColorTexture('./superman.png') } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(10,5,-5);
scene.add( cube );
 
function loadColorTexture(path){
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}


const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.AmbientLight( color, intensity );
scene.add( light );


class ColorGUIHelper {
    constructor(object,prop) {
        this.object = object;
        this.prop = prop;
    }
    get value(){
        return '#' + this.object[this.prop].getHexString();
    }
    set value(hexString){
        this.object[this.prop].set(hexString);
    }
}
const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 5, 0.01);

let sword;
const loaderobj = new OBJLoader();
loaderobj.load('./MasterSwordZelda.obj', function (object) {
    sword = object;
    sword.position.set(0, 5, 0);
    sword.scale.set(0.5, 0.5, 0.5);
    sword.rotation.x = Math.PI / 2;
    scene.add(sword);
});


function animate( time ) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;
  if (sword){
    sword.rotation.y = time / 1000;
  }
  renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
