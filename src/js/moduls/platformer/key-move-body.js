import Matter from "matter-js";

export default class KeyMoveBody {
	constructor(body, engine, options = false) {
		this.eventKey = {
			up: false,
			down: false,
			right: false,
			left: false,
		};

		this.body = body;
		this.bodyId = body.id;
		this.engine = engine;

		this.key = {
			up: options.keyUp ? options.keyUp : "ArrowUp",
			down: options.keyDown ? options.keyDown : "ArrowDown",
			right: options.keyRight ? options.keyRight : "ArrowRight",
			left: options.keyLeft ? options.keyLeft : "ArrowLeft",
		};
		this.velocity = options.velocity ? options.velocity : 10;
		this.jumpHeight = options.jumpHeight ? options.jumpHeight : 10;
		this.jump = options.jump === undefined ? true : options.jump;
		this.jumpCount = null;
		this.jumpCountTotal = null;
		this.stateInJump = false;

		this.callback = {
			keydown: {
				right: this._createdCallback(options.callback?.keydown?.right),
				left: this._createdCallback(options.callback?.keydown?.left),
				up: this._createdCallback(options.callback?.keydown?.up),
				down: this._createdCallback(options.callback?.keydown?.down),
			},
			keyup: {
				right: this._createdCallback(options.callback?.keyup?.right),
				left: this._createdCallback(options.callback?.keyup?.left),
				up: this._createdCallback(options.callback?.keyup?.up),
				down: this._createdCallback(options.callback?.keyup?.down),
			},
			keyhold: {
				// right
				preventRight: 0,
				beforeRight: this._createdCallback(options.callback?.keyhold?.beforeRight),
				right: this._createdCallback(options.callback?.keyhold?.right),
				afterRight: this._createdCallback(options.callback?.keyhold?.afterRight),
				// left
				preventLeft: 0,
				beforeLeft: this._createdCallback(options.callback?.keyhold?.beforeLeft),
				left: this._createdCallback(options.callback?.keyhold?.left),
				afterLeft: this._createdCallback(options.callback?.keyhold?.afterLeft),
				// down
				preventDown: 0,
				beforeDown: this._createdCallback(options.callback?.keyhold?.beforeDown),
				down: this._createdCallback(options.callback?.keyhold?.down),
				afterDown: this._createdCallback(options.callback?.keyhold?.afterDown),
			},
			state: {
				idle: this._createdCallback(options.callback?.state?.idle),
				inSpase: this._createdCallback(options.callback?.state?.inSpase),
				inJump: this._createdCallback(options.callback?.state?.inJump),
			},
			customUpdate: this._createdCallback(options.callback?.customUpdate),
			customCollision: this._createdCallback(options.callback?.customCollision),
		};

		this._created(options);
	}

	_created(options) {
		this._createdJump(options);

		this._oneСlickKeyEvent();
		if (this.callback.customUpdate() === undefined) {
			this._customUpdate();
		} else {
			this._holdKeyEvent();
		}
		this._collisionEvents();
	}

	_createdCallback(path) {
		return path ? path : () => false;
	}

	_createdJump(options) {
		if (this.jump) {
			this.jumpCount = options.jumpCountInAir ? options.jumpCountInAir + 1 : 1;
		} else {
			this.jumpCount = 0;
		}
		this.jumpCountTotal = this.jumpCount;
	}

	_oneСlickKeyEvent() {
		// События при нажатии кнопки
		document.addEventListener("keydown", (event) => {
			if (event.code === this.key.right && !this.eventKey.right) {
				this.eventKey.right = true;
				this.callback.keydown.right();
			}
			if (event.code === this.key.left && !this.eventKey.left) {
				this.eventKey.left = true;
				this.callback.keydown.left();
			}

			if (event.code === this.key.up && !this.eventKey.up) {
				this.eventKey.up = true;
				if (this.jumpCount >= 1) {
					Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -this.jumpHeight });
					this.stateInJump = true;
					--this.jumpCount;
				}
				this.callback.keydown.up();
			}

			if (event.code === this.key.down && !this.eventKey.down) {
				this.eventKey.down = true;
				this.callback.keydown.down();
			}
		});

		// События при отпускании кнопки
		document.addEventListener("keyup", (event) => {
			if (event.code === this.key.up) {
				this.eventKey.up = false;
				this.callback.keyup.up();
			}
			if (event.code === this.key.down) {
				this.eventKey.down = false;
				this.callback.keyup.down();
			}
			if (event.code === this.key.right) {
				this.eventKey.right = false;
				this.callback.keyup.right();
			}
			if (event.code === this.key.left) {
				this.eventKey.left = false;
				this.callback.keyup.left();
			}
		});
	}

	_holdKeyEvent() {
		// События при удержании кнопок
		Matter.Events.on(this.engine, "beforeUpdate", () => {
			if (this.callback.keyhold.preventRight === 1) {
				this.callback.keyhold.preventRight = 2;
			} else if (this.callback.keyhold.preventLeft === 1) {
				this.callback.keyhold.preventLeft = 2;
			} else if (this.callback.keyhold.preventUp === 1) {
				this.callback.keyhold.preventUp = 2;
			} else if (this.callback.keyhold.preventDown === 1) {
				this.callback.keyhold.preventDown = 2;
			}

			if (this.stateInJump) {
				// Jump
				if (this.eventKey.right) {
					// right
					this.setVelocityRight();
				} else if (this.eventKey.left) {
					// left
					this.setVelocityLeft();
				}

				// callback
				this.callback.state.inJump();
				if (this.body.velocity.y >= 0.5) this.stateInJump = false;
			} else if (this.body.velocity.y >= 0.5) {
				// spase
				if (this.eventKey.right) {
					// right
					this.setVelocityRight();
				} else if (this.eventKey.left) {
					// left
					this.setVelocityLeft();
				}
				// callback
				this.callback.state.inSpase();
			} else if (this.eventKey.right) {
				// right
				this.setVelocityRight();

				// callback
				if (this.callback.keyhold.preventRight === 0) {
					this.callback.keyhold.beforeRight();
				}
				this.callback.keyhold.right();
				this.callback.keyhold.preventRight = 1;
			} else if (this.eventKey.left) {
				// left
				this.setVelocityLeft();

				// callback
				if (this.callback.keyhold.preventLeft === 0) {
					this.callback.keyhold.beforeLeft();
				}
				this.callback.keyhold.left();
				this.callback.keyhold.preventLeft = 1;
			} else if (this.eventKey.down) {
				// down
				// callback
				if (this.callback.keyhold.preventDown === 0) {
					this.callback.keyhold.beforeDown();
				}
				this.callback.keyhold.down();
				this.callback.keyhold.preventDown = 1;
			} else {
				// idle
				// callback
				this.callback.state.idle();
			}

			if (this.callback.keyhold.preventRight === 2) {
				this.callback.keyhold.afterRight();
				this.callback.keyhold.preventRight = 0;
			} else if (this.callback.keyhold.preventLeft === 2) {
				this.callback.keyhold.afterLeft();
				this.callback.keyhold.preventLeft = 0;
			} else if (this.callback.keyhold.preventUp === 2) {
				this.callback.keyhold.afterUp();
				this.callback.keyhold.preventUp = 0;
			} else if (this.callback.keyhold.preventDown === 2) {
				this.callback.keyhold.afterDown();
				this.callback.keyhold.preventDown = 0;
			}
		});
	}

	_customUpdate() {
		Matter.Events.on(this.engine, "beforeUpdate", () => {
			this.callback.customUpdate();
		});
	}

	_collisionEvents() {
		// События вызывается при любой коллизии
		Matter.Events.on(this.engine, "collisionStart", (event) => {
			// Сбрасывает счетчик прыжков при касании тела с землей
			for (const collision of event.pairs) {
				this.callback.customCollision(collision);

				const contactFloor = Boolean(collision.contacts[this.bodyId + "_2"]) || Boolean(collision.contacts[this.bodyId + "_3"]);
				if (contactFloor) {
					this.jumpCount = this.jumpCountTotal;
					this.stateInJump = false;
					return false;
				}
			}
		});
	}

	setVelocityRight() {
		Matter.Body.setVelocity(this.body, { x: this.velocity, y: this.body.velocity.y });
	}
	setVelocityLeft() {
		Matter.Body.setVelocity(this.body, { x: -this.velocity, y: this.body.velocity.y });
	}
}
