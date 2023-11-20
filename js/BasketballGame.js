import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export function CreateCar(){
    const carModel = new THREE.Group();
    carModel.name = "carModel";
    carModel.opacity = 0;
    
    const loader = new GLTFLoader();
    loader.load(
        './resources/models/car.glb',
        function ( gltf ) {
            const car = gltf.scene;
            car.name = "car";
            car.scale.set(10, 10, 10);
            car.position.set(0, 20, 0);
            car.rotation.set(0, Math.PI, 0);
            carModel.add(car);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    return carModel;
}

export function CreateRoad(){
    const roadModel = new THREE.Group();
    roadModel.name = "roadModel";
    roadModel.opacity = 0;

    const loader = new GLTFLoader();
    loader.load(
        './resources/models/road.glb',
        function ( gltf ) {
            const road = gltf.scene;
            road.name = "road";
            road.scale.set(20, 20, 20);
            road.position.set(0, 0, 0);
            road.rotation.set(0, 0, 0);
            roadModel.add(road);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    return roadModel;
}

export function CreateBillboard(){
    const billboardModel = new THREE.Group();
    billboardModel.name = "billboardModel";
    billboardModel.opacity = 0;

    const loader = new GLTFLoader();
    loader.load(
        './resources/models/billboard.glb',
        function ( gltf ) {
            const billboard = gltf.scene;
            billboard.name = "billboard";
            billboard.scale.set(0.2, 0.2, 0.2);
            billboard.position.set(150, 0, 0);
            billboard.rotation.set(0, Math.PI / 2, 0);
            billboardModel.add(billboard);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    return billboardModel;
}

export function CreateGameProps(gamePropIndexes){
    const gamePropsGroup = new THREE.Group();
    gamePropsGroup.name = "gameProps";
    gamePropsGroup.opacity = 0;

    const car = CreateCar();
    gamePropsGroup.add(car);

    const road = CreateRoad();
    gamePropsGroup.add(road);

    const billboard = CreateBillboard();
    gamePropsGroup.add(billboard);

    gamePropsGroup.children.forEach((prop, index) => {
        gamePropIndexes[prop.name] = index;    
    });

    return gamePropsGroup;
}

export function StartGame(scene,gameProps){
    scene.add(gameProps);
}