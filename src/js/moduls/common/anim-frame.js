import Matter from "matter-js";
import StaticFrame from "./static-frame.js";

export default class AnimFrame extends StaticFrame {
	constructor(sprite, body, frameName, optoons = false) {
		super(sprite, body, frameName, optoons);

		this.frameGroop = sprite.frameGroop;
		this.play = optoons.play === false ? false : true;
		this.frameGroopList = typeof frameName === "string" ? this.frameGroop[frameName] : frameName;
		this.reloadCounter = optoons.reloadFrame ? optoons.reloadFrame : 30;
		this.animCycles = optoons.animCycles ? optoons.animCycles : Infinity;
		this.endCyclesLastFrame = Boolean(optoons.endCyclesLastFrame);

		this.deltaCounter = 0;
		this.frameCounter = 0;
		this.animCyclesCounter = 0;

		this._changeFrameName();

		this._newCreated();
	}

	_created() {
		return false;
	}

	_newCreated() {
		this._createdFrame();
		this._addFrame();
	}

	_changeFrameName() {
		this.frameName = this.frameGroopList[this.frameCounter];
		this.frame = this.sprite.json.frames[this.frameName];
	}

	_addFrame() {
		Matter.Events.on(this.engine, "beforeUpdate", () => {
			if (this.play) {
				this.animPlay();
			}
		});
	}

	animPlay() {
		this.deltaCounter < this.reloadCounter ? ++this.deltaCounter : (this.deltaCounter = 1);

		if (this.deltaCounter === this.reloadCounter && this.animCyclesCounter < this.animCycles) {
			if (this.frameCounter < this.frameGroopList.length - 1) {
				++this.frameCounter;
			} else {
				this.frameCounter = this.endCyclesLastFrame ? this.frameGroopList.length - 1 : 0;
				++this.animCyclesCounter;
			}
			this._changeFrameName();
		}

		this._renderFrame();
	}
}
