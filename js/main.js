//********************************************************************************************************************
//  Brand Racing
//  Author: Alex Kahn
//  ______     __   __   ______     __   __     ______   ______     ______     __    __     ______     ______
// /\  ___\   /\ \ / /  /\  ___\   /\ "-.\ \   /\__  _\ /\  ___\   /\  __ \   /\ "-./  \   /\  ___\   /\  ___\
// \ \  __\   \ \ \'/   \ \  __\   \ \ \-.  \  \/_/\ \/ \ \ \__ \  \ \  __ \  \ \ \-./\ \  \ \  __\   \ \___  \
//  \ \_____\  \ \__|    \ \_____\  \ \_\\"\_\    \ \_\  \ \_____\  \ \_\ \_\  \ \_\ \ \_\  \ \_____\  \/\_____\
//   \/_____/   \/_/      \/_____/   \/_/ \/_/     \/_/   \/_____/   \/_/\/_/   \/_/  \/_/   \/_____/   \/_____/
//  Description: A game where you race you car along brand logos.
//  Resources: sources.txt
//  Copyright © 2023 EventGames. All rights reserved.
//********************************************************************************************************************

//********************************************************************************************************************
//  Imports
//********************************************************************************************************************

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
//import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

import { TransitionProps } from "./Animations.js";
import { CreateGameProps, StartGame } from "./RacingGame.js";

//********************************************************************************************************************
//  Global Variables
//********************************************************************************************************************

//--------------------------------------------------------------------------------------------
//  Three.js Setup Variables
//--------------------------------------------------------------------------------------------
let renderer, scene, /*gui,*/ camera, aspect, orbitalControls;

//--------------------------------------------------------------------------------------------
//  User Interaction Variables
//--------------------------------------------------------------------------------------------
let mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//
var isMobile = false; //initiate as false
// device detection
if (
	/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
		navigator.userAgent,
	) ||
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
		navigator.userAgent.substr(0, 4),
	)
) {
	isMobile = true;
}

//--------------------------------------------------------------------------------------------
//  Game State Variables
//--------------------------------------------------------------------------------------------
let resourcesLoaded = false;

//--------------------------------------------------------------------------------------------
//  Navigation and Page State Variables
//--------------------------------------------------------------------------------------------
let pages = [
	"game",
];

let currentPageIndex = 0;
let currentPage = "";
let transitionProps = [null, null];
let gameProps
let gamePropIndexes = {};


//--------------------------------------------------------------------------------------------
//  Performance Monitoring Variables
//--------------------------------------------------------------------------------------------
const stats = new Stats();
const clock = new THREE.Clock({ autoStart: false });

//--------------------------------------------------------------------------------------------
//  Resource Management and Loading Variables
//--------------------------------------------------------------------------------------------
const loadingManager = new THREE.LoadingManager();
const rgbeLoader = new RGBELoader(loadingManager);
//const textureLoader = new THREE.TextureLoader(loadingManager);
const svgLoader = new SVGLoader(loadingManager);

//--------------------------------------------------------------------------------------------
//  HTML Element Variables
//--------------------------------------------------------------------------------------------
const progressBar = document.getElementById("progressBar");
const loadingScreen = document.getElementById("loadingScreen");

//--------------------------------------------------------------------------------------------
//  User Data and API Response Variables
//--------------------------------------------------------------------------------------------
const api = {
	client: "",
};
const userData = {
	userId: null,
	firstName: "",
	lastName: "",
	email: "",
	company: "",
	jobTitle: "",
	areaCode: "",
	middleDigits: "",
	lastDigits: "",
	acceptedTerms: false,
	score: 0,
	userId: null,
};

//********************************************************************************************************************
//  Main (starts the render loop)
//********************************************************************************************************************

init();
animate();

//********************************************************************************************************************
// Initialization Functions
//********************************************************************************************************************

/**
 * Initializes the 3D environment, setting up the renderer, scene, camera, controls,
 * and event listeners. Loads necessary resources and starts the home page.
 */
function init() {
	// loading manager
	loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
		document.getElementById(
			"loadingStatus",
		).textContent = `Loading ${itemsLoaded} of ${itemsTotal} resources. Current URL: ${url}`;
		progressBar.value = 0;
	};

	loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
		document.getElementById(
			"loadingStatus",
		).textContent = `Loading progress for ${url}`;
		const percentComplete = (itemsLoaded / itemsTotal) * 100;
		progressBar.value = percentComplete === Infinity ? 100 : percentComplete;
	};

	loadingManager.onLoad = function () {
		document.getElementById("loadingScreen").style.opacity = "0";
		document.getElementById("loadingStatus").textContent = "Loading completed";
		loadingScreen.style.display = "none";
		resourcesLoaded = true;
	};

	loadingManager.onError = function (url) {
		console.error(`Error loading resource: ${url}`);
		document.getElementById(
			"loadingStatus",
		).textContent = `Error loading resource: ${url}`;
	};

	// mobile keyboard
	let hiddenInput = document.createElement("input");
	hiddenInput.id = "hiddenInput";
	hiddenInput.style.position = "absolute";

	hiddenInput.style.opacity = 0;
	document.body.appendChild(hiddenInput);

	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// scene
	scene = new THREE.Scene();

	// sky
	rgbeLoader.load(
		"./resources/skies/eco-enterprise-sky.hdr",
		function (texture) {
			texture.mapping = THREE.EquirectangularReflectionMapping;

			scene.background = texture;
			scene.environment = texture;
		},
		function (xhr) {
			document.getElementById("loadingStatus").textContent = `Loading sky`;
		},
	);

	// camera
	aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
	camera.position.set(0, 0, 1000);

	// orbital controls
	orbitalControls = new OrbitControls(camera, renderer.domElement);
	orbitalControls.enablePan = false;
	orbitalControls.enableRotate = false;
	orbitalControls.enableZoom = false;
	orbitalControls.enableDamping = false;
	//orbitalControls.autoRotate = true;
	orbitalControls.autoRotateSpeed = 0.5;

	// light

	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);

	// gui
	//createGUI();

	// game

	gameProps = CreateGameProps(gamePropIndexes);

	// event listeners
	window.addEventListener("resize", onWindowResize);
	window.addEventListener("mousedown", mouseDown, false);
	window.addEventListener("touchstart", touchDown, false);
	window.addEventListener("mousemove", mouseMove, false);
	window.addEventListener("keydown", onDocumentKeyDown, false);
	window.addEventListener("keyup", onDocumentKeyUp, false);

	// stats
	document.body.appendChild(stats.dom);

	// start
	currentPage = "game";
	StartGame(scene, gameProps);
}

/*
function createGUI() {
	gui = new GUI();
}
*/

//********************************************************************************************************************
//  Event Functions
//********************************************************************************************************************

/**
 * Handles the window resize event by updating the camera's aspect ratio and renderer's size to match the new window dimensions.
 * Additionally, it updates the orbital controls.
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);

	orbitalControls.update();
}

/**
 * Handles the mouse move event and updates the cursor style and interactions based on the current page.
 *
 * @param {MouseEvent} event - The mouse move event object.
 */
function mouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	switch (currentPage) {
		case "transition":
			HandleTransitionHover();
			break;

		case "game":
			break;
		
		default:
			console.error("ERROR: currentPage is not set correctly");
			break;
	}
}
/**
 * Handles the mouse down event, performing different actions based on the current page and the clicked objects.
 *
 * @param {MouseEvent} event - The mouse down event object.
 */
function mouseDown(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	console.log("Click on " + currentPage);

	switch (currentPage) {
		case "transition":
			HandleTransitionClick();
			break;
		
		case "game":
			break;
		default:
			console.log("ERROR: currentPage is not set correctly");
			break;
	}
}

function touchDown(event) {
	event.preventDefault();
	mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	console.log("Touch on " + currentPage);

	switch (currentPage) {
		case "transition":
			HandleTransitionClick();
			break;
		
		case "game":
			
			break;
		default:
			console.log("ERROR: currentPage is not set correctly");
			break;
	}
}

//********************************************************************************************************************
//  Key Press Functions
//********************************************************************************************************************

/**
 * Handles the keydown event on the document, performing various actions based on the pressed key and the current page.
 *
 * @param {KeyboardEvent} event - The keydown event object.
 */
function onDocumentKeyDown(event) {
	const key = event.key;

	// TODO: remove this
	if (key === "`") {
		console.dir(scene.children[1]);
		orbitalControls.enableRotate = !orbitalControls.enableRotate;
		orbitalControls.enableZoom = !orbitalControls.enableZoom;
	}

	switch (currentPage) {
		default:
			console.log("ERROR: currentPage is not set correctly");
			break;
	}
}

/**
 * Handles the keyup event on the document.
 *
 * @param {KeyboardEvent} event - The keyup event object.
 */
function onDocumentKeyUp(event) {
	event.preventDefault();
}

//********************************************************************************************************************
// Animation Functions
//********************************************************************************************************************

/**
 * Main animation loop for the application. This function is responsible for continuously rendering the scene,
 * updating game logic, and managing various components. It's called recursively using `requestAnimationFrame`.
 *
 * Ensure that the required resources are loaded before executing game logic and animations.
 */
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	stats.update();

	if (!resourcesLoaded) {
		return;
	}

	orbitalControls.update();

	if (transitionProps[0] !== null && transitionProps[1] !== null) {
		currentPage = TransitionProps(
			scene,
			clock,
			transitionProps,
			0.02,
			pages,
			currentPageIndex,
			gamePropIndexes,
		);
	}

	switch (currentPage) {
	
		case "game":
			break;
		
		default:
			break;
	}

}
