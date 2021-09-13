import Matter from "matter-js";

export default class StaticFrame {
	constructor(sprite, body, frameName, optoons = false) {
		this.sprite = sprite;
		this.frameName = frameName;
		this.optoons = optoons;
		this.engine = sprite.engine;
		this.render = sprite.render;
		this.img = sprite.img;
		this.body = body;

		this.rotateFrame = optoons.rotateFrame;
		this.scale = optoons.scale ? optoons.scale : 1;
		this.scaleX = optoons.scaleX ? optoons.scaleX : 1;
		this.scaleY = optoons.scaleY ? optoons.scaleY : 1;
		this.rotate = (body) => {
			return body.angle;
		};
		this.play = optoons.visible === undefined ? true : optoons.visible;
		this.frame;
		this.width;
		this.height;
		this.offsetX;
		this.offsetY;

		this._created();
	}

	_created() {
		this._createdFrame();
		this._addFrame();
	}

	_createdFrame() {
		this.frame = this.sprite.json.frames[this.frameName];
		this.width = this.frame.w * this.scale;
		this.height = this.frame.h * this.scale;
		this.offsetX = (this.frame.w / 2 - (this.optoons.offsetX ? this.optoons.offsetX : 0)) * this.scale;
		this.offsetY = (this.frame.h / 2 - (this.optoons.offsetY ? this.optoons.offsetY : 0)) * this.scale;

		if (this.rotateFrame === false) {
			this.rotate = () => {
				return 0;
			};
		}

		this.body.render.fillStyle = "transparent";
	}

	_renderFrame() {
		const dx = this.body.position.x - this.offsetX,
			dy = this.body.position.y - this.offsetY;

		this.render.context.setTransform(this.scaleX, 0, 0, this.scaleY, dx + this.width / 2, dy + this.height / 2);
		this.render.context.rotate(this.rotate(this.body));
		this.render.context.drawImage(this.img, this.frame.x, this.frame.y, this.frame.w, this.frame.h, -this.width / 2, -this.height / 2, this.width, this.height);
	}

	_addFrame() {
		Matter.Events.on(this.engine, "beforeUpdate", () => {
			if (this.play) {
				this._renderFrame();
			}
		});
	}

	show() {
		this._renderFrame();
	}
}
