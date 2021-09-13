# Набор модулей для платформера

## KeyMoveBody

Управление телом с помощью клавиатуры. Можно указать скорость перемещения по `x` и прыжок, также менять клавиши. Значения по умолчанию в примере ниже.

```js
import KeyMoveBody from "./moduls/platformer/key-move-body.js";

new KeyMoveBody(body, engine, {
	keyUp: "ArrowUp",
	keyDown: "ArrowDown",
	keyRight: "ArrowRight",
	keyLeft: "ArrowLeft",
	velocity: 10,
	jump: true,
	jumpHeight: 10,
	jumpCountInAir: 0,
    callback:{
        keydown: {
            right: () => false,
            left: () => false,
            up: () => false,
            down: () => false,
        }
        keyup: {
            right: () => false,
            left: () => false,
            up: () => false,
            down: () => false,
        }
        keyhold: {
            // right
            beforeRight: () => false,
            right: () => false,
            afterRight: () => false,
            // left
            beforeLeft: () => false,
            left: () => false,
            afterLeft: () => false,
            // down
            beforeDown: () => false,
            down: () => false,
            afterDown: () => false,
		},
        customUpdate: () => false,
		customCollision: () => false,
    }
});
```

### Обязательные параметры:

| Параметр |                                        |
| -------: | :------------------------------------- |
|   `body` | Созданное тело которым нужно управлять |
| `engine` | Движок в котором находится тело        |

### Не обязательные параметры:

Передаются объектом _Object_

|         Параметр |    Тип    |                                                                                                                                           |
| ---------------: | :-------: | :---------------------------------------------------------------------------------------------------------------------------------------- |
|          `keyUp` | _String_  | Замена клавиши прыжка в формате `event.code`                                                                                              |
|       `keyDown`, | _String_  | Замена клавиши вниз в формате `event.code`                                                                                                |
|       `keyRight` | _String_  | Замена клавиши движения в право в формате `event.code`                                                                                    |
|        `keyLeft` | _String_  | Замена клавиши движения в лево в формате `event.code`                                                                                     |
|       `velocity` | _Number_  | Указывается скорость перемещения тела ⇄ по оси `x`                                                                                        |
|           `jump` | _Boolean_ | Включает/выключает прыжок                                                                                                                 |
|     `jumpHeight` | _Number_  | Указывается высота прыжка ↥                                                                                                               |
| `jumpCountInAir` | _Number_  | Указывается количество прыжков которое может сделать тело находясь в воздухе пока не коснулось земли. Если `jump` выключен то не работает |
|       `callback` | _Object_  | Объект с калбеками                                                                                                                        |

### Калбеки callback

#### `keydown` Нажатия на кнопку

Калбек срабатывает при нажатия на кнопку

|                 Параметр |    Тип     | Кнопка     |
| -----------------------: | :--------: | :--------- |
| `callback.keydown.right` | _Function_ | `keyRight` |
|  `callback.keydown.left` | _Function_ | `keyLeft`  |
|    `callback.keydown.up` | _Function_ | `keyUp`    |
|  `callback.keydown.down` | _Function_ | `keyDown`  |

#### `keyup` Отпускании кнопки

Калбек срабатывает при отпускании кнопки

|               Параметр |    Тип     | Кнопка     |
| ---------------------: | :--------: | :--------- |
| `callback.keyup.right` | _Function_ | `keyRight` |
|  `callback.keyup.left` | _Function_ | `keyLeft`  |
|    `callback.keyup.up` | _Function_ | `keyUp`    |
|  `callback.keyup.down` | _Function_ | `keyDown`  |

### Калбеки внутри функции `beforeUpdate`

Функция `beforeUpdate` срабатывает при каждом обновлении кадра. Калбеки внутри этой функции можно использовать для анимации или для отслеживания состояния.
[matter-js API beforeUpdate](https://brm.io/matter-js/docs/classes/Engine.html#event_beforeUpdate)

#### `before` Срабатывает единожды в начале удержания кнопки

|                       Параметр |    Тип     | Кнопка     |
| -----------------------------: | :--------: | :--------- |
| `callback.keyhold.beforeRight` | _Function_ | `keyRight` |
|  `callback.keyhold.beforeDown` | _Function_ | `keyDown`  |
|  `callback.keyhold.beforeLeft` | _Function_ | `keyLeft`  |

#### `keyhold` Срабатывает постоянно пока удерживается клавиша

|                 Параметр |    Тип     | Кнопка     |
| -----------------------: | :--------: | :--------- |
| `callback.keyhold.right` | _Function_ | `keyRight` |
|  `callback.keyhold.down` | _Function_ | `keyDown`  |
|  `callback.keyhold.left` | _Function_ | `keyLeft`  |

#### `after` Срабатывает единожды в конце удержания кнопки

|                      Параметр |    Тип     | Кнопка     |
| ----------------------------: | :--------: | :--------- |
| `callback.keyhold.afterRight` | _Function_ | `keyRight` |
|  `callback.keyhold.afterLeft` | _Function_ | `keyLeft`  |
|  `callback.keyhold.afterDown` | _Function_ | `keyDown`  |

### Пользовательский калбек `customUpdate`

Создает новую функцию `beforeUpdate` которая вызывается при каждом обновлении кадра. С её помощью можно создать собственные условия поведения тела.

> **При его вызове перестанет работать управление телом, так же не будут работать все передаваемые опции кроме калбеков [`callback.keydown`](#keydown-Нажатия-на-кнопку), [`callback.keyup`](#keyup-Отпускании-кнопки)**

|                Параметр |    Тип     |
| ----------------------: | :--------: |
| `callback.customUpdate` | _Function_ |

### Пользовательский калбек `customCollision`

Вызывается каждый раз когда происходит новая коллизия любых объектов. Можно передавать значения в функцию `event` в котором содержится статус коллизии.

```js
new KeyMoveBody(body, engine, {
	callback: {
		customCollision: (event) => {
			console.log(event);
		},
	},
});
```

|                   Параметр |    Тип     |
| -------------------------: | :--------: |
| `callback.customCollision` | _Function_ |

### Методы

`setVelocityRight()`/`setVelocityLeft()` Задает скорость движения вправо/влево, скорость указывается в необязательных параметрах velocity. Может быть полезен в калбек `customUpdate`

---
