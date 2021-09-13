export default class AddSpriti {
	constructor(engine, render, imgSrc, jsonSrc) {
		this.engine = engine;
		this.render = render;
		this.imgSrc = imgSrc;
		this.json = jsonSrc;

		this.frameGroop = {};

		this.img = new Image();

		this._created();

		return {
			img: this.img,
			json: this.json,
			frameGroop: this.frameGroop,
			engine: this.engine,
			render: this.render,
		};
	}

	_created() {
		this._frameNameGroopList();

		this.img.src = this.imgSrc;
	}

	_frameNameGroopList() {
		// Нельзя вреде как нормально в .json создать группы так что...
		// Создает группы и заполняет массивы с именами
		for (const key in this.json.frames) {
			if (Object.hasOwnProperty.call(this.json.frames, key)) {
				const groopName = key.match(/[\s\S]*?(?=\/)/);
				if (groopName) {
					if (this.frameGroop[groopName] === undefined) {
						this.frameGroop[groopName] = [key];
					} else {
						this.frameGroop[groopName].push(key);
					}
				}
			}
		}

		// Сортирует массивы чтобы была правильная очередность кадров
		for (const key in this.frameGroop) {
			if (Object.hasOwnProperty.call(this.frameGroop, key)) {
				this.frameGroop[key].sort((a, b) => {
					if (a > b) return 1;
					if (a == b) return 0;
					if (a < b) return -1;
				});
			}
		}
	}
}
