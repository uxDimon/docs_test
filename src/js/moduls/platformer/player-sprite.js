import Matter from "matter-js";

export default class PlayerSprite {
	constructor(options) {
		this.x = options.x ? options.x : 0;
		this.y = options.y ? options.y : 0;
		this.width = options.width ? options.width : 50;
		this.height = options.height ? options.height : 50;
		//https://brm.io/matter-js/docs/classes/Body.html#properties

		// this.playr = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height);
		this.playr = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, { inertia: Infinity });

		this._created();
	}

	_created() {
		this.playr.size = {
			width: this.width,
			height: this.height,
		};
	}

	// Возвращает создание тело
	getPlaer() {
		return this.playr;
	}
}
