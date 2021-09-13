// TODO:
// Добавить колбеки в KeyMoveBody

import "../css/main.scss";

import Matter from "matter-js";

import PlayerSprite from "./moduls/platformer/player-sprite.js";
import KeyMoveBody from "./moduls/platformer/key-move-body.js";
import AddSpriti from "./moduls/common/add-sprit.js";
import StaticFrame from "./moduls/common/static-frame.js";
import AnimFrame from "./moduls/common/anim-frame.js";

var Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Body = Matter.Body,
	Events = Matter.Events,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Composite = Matter.Composite,
	Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
	world = engine.world;

let canvas = document.querySelector("#app");

// create renderer
var render = Render.create({
	element: canvas,
	engine: engine,
	// context: context,
	options: {
		width: 800,
		height: 600,
		pixelRatio: 1,

		wireframes: false,

		showAxes: true,
		showCollisions: true,
		showConvexHulls: true,
		showPerformance: true,

		showPositions: true,
		showVelocity: true,
	},
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
const bodyA = Bodies.rectangle(200, 200, 50, 50, { isStatic: true, render: { fillStyle: "#060a19" } }),
	bodyB = Bodies.rectangle(200, 200, 90, 50),
	bodyC = Bodies.rectangle(300, 200, 50, 50),
	bodyD = Bodies.rectangle(400, 200, 50, 50),
	bodyE = Bodies.rectangle(550, 200, 50, 50),
	bodyEe = Bodies.rectangle(550, 200, 50, 50),
	bodyF = Bodies.rectangle(700, 200, 50, 50);

const plaer = new PlayerSprite({
	x: 200,
	y: 68,
	width: 24,
	height: 68,
}).getPlaer();

Composite.add(world, [bodyA, bodyB, bodyC, bodyD, bodyE, bodyEe, bodyF, plaer]);

Composite.add(world, [
	// walls
	Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
	Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
	Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
	Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

new KeyMoveBody(plaer, engine, {
	velocity: 4,
	jumpHeight: 12,
	jump: true,
	callback: {
		keydown: {
			left: () => {
				playrAnimRun.scaleX = -1;
				playrAnimIdle.scaleX = -1;
				playrAnimSpase.scaleX = -1;
				playrAnimJump.scaleX = -1;
				bodyDown.scaleX = -1;
			},
			right: () => {
				playrAnimRun.scaleX = 1;
				playrAnimIdle.scaleX = 1;
				playrAnimSpase.scaleX = 1;
				playrAnimJump.scaleX = 1;
				bodyDown.scaleX = 1;
			},
		},
		keyhold: {
			right: () => {
				playrAnimRun.animPlay();
			},
			left: () => {
				playrAnimRun.animPlay();
			},
			down: () => {
				bodyDown.show();
			},
		},
		state: {
			idle: () => {
				playrAnimIdle.animPlay();
			},
			inSpase: () => {
				playrAnimSpase.animPlay();
			},
			inJump: () => {
				playrAnimJump.animPlay();
			},
		},
		// customUpdate: () => {
		// 	console.log("customUpdate");
		// },
		// customCollision: (event) => {
		// 	console.log(event);
		// },
	},
});

import imgSrc from "../img/platformer/player.png";
import jsonSrc from "../img/platformer/player.json";

const spritePlayr = new AddSpriti(engine, render, imgSrc, jsonSrc);

const bodyEst = new StaticFrame(spritePlayr, bodyE, "test/1", {
	scale: 1,
});

const bodyDown = new StaticFrame(spritePlayr, plaer, "crouch", {
	visible: false,
});

const playrAnimRun = new AnimFrame(spritePlayr, plaer, "run", {
	scale: 1,
	reloadFrame: 7,
	play: false,
});

const playrAnimJump = new AnimFrame(spritePlayr, plaer, "jump", {
	reloadFrame: 6,
	play: false,
});

const playrAnimSpase = new AnimFrame(spritePlayr, plaer, "spase", {
	reloadFrame: 14,
	play: false,
});

const playrAnimIdle = new AnimFrame(spritePlayr, plaer, "idle", {
	reloadFrame: 7,
	play: false,
});

console.log(playrAnimJump);

// add mouse control
var mouse = Mouse.create(render.canvas),
	mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false,
			},
		},
	});

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
	min: { x: 0, y: 0 },
	max: { x: 800, y: 600 },
});
