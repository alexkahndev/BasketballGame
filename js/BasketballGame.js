import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function CreateBasketballCourt(){
    const basketballCourtModel = new THREE.Group();
    basketballCourtModel.name = "basketballCourtModel";
    basketballCourtModel.opacity = 0;

    const loader = new GLTFLoader();
    loader.load(
        './resources/models/basketball-court.glb',
        function ( gltf ) {
            const basketballCourt = gltf.scene;
            basketballCourt.name = "basketballCourt";
            basketballCourt.scale.set(100, 100, 100);
            basketballCourt.position.set(0, 0, 0);
            basketballCourt.rotation.set(0, Math.PI / 2, 0);
            basketballCourtModel.add(basketballCourt);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    return basketballCourtModel;
}

export function CreateBasketball(){
    const basketballModel = new THREE.Group();
    basketballModel.name = "basketballModel";
    basketballModel.opacity = 0;

    const loader = new GLTFLoader();
    loader.load(
        './resources/models/basketball.glb',
        function ( gltf ) {
            const basketball = gltf.scene;
            basketball.name = "basketball";
            basketball.scale.set(0.025, 0.025, 0.025);
            basketball.position.set(0, 100, 0);
            basketball.rotation.set(0, Math.PI / 2, 0);
            basketballModel.add(basketball);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    return basketballModel;
}

export function CreateGameProps(gamePropIndexes){
    const gamePropsGroup = new THREE.Group();
    gamePropsGroup.name = "gameProps";
    gamePropsGroup.opacity = 0;

    const basketballCourt = CreateBasketballCourt();    
    gamePropsGroup.add(basketballCourt);

    const basketball = CreateBasketball();
    gamePropsGroup.add(basketball);

    gamePropsGroup.children.forEach((prop, index) => {
        gamePropIndexes[prop.name] = index;    
    });

    return gamePropsGroup;
}

export function StartGame(scene,gameProps){
    scene.add(gameProps);
}