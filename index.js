const element = document.querySelector("#test");
const itemClass = "tinko";
const modal = document.querySelector("#modal");

const defaultBoardCount = 9;
let num = defaultBoardCount;

const input = document.querySelector("input");
const button = document.querySelector("button");

input.addEventListener("change", updateValue);
window.addEventListener("DOMContentLoaded", (e) => {
	const okj = document.getElementById("input");
	okj.value = num;
	createDom(num);
	modal.classList.remove("hidden");
});

const createDom = (count) => {
	/**
	 * 中心の数を求める
	 * 処理するたびに2を足す
	 * 中心の数いじょうになったら2を引く
	 */

	for (let index = 0; index < count * count; index++) {
		element.insertAdjacentHTML("beforeend", `<div class='${itemClass}'></div>`);
	}

	const target = document.querySelectorAll(`.${itemClass}`);

	let x = 1;
	let y = 1;
	let block = 1;

	for (let index = 0; index <= num; index++) {
		if (index < Math.floor(num / 2)) {
			for (let index = 0; index < x; index++) {
				target[Math.floor(num / 2) * block + index].style.background = "black";
			}
			x += 2;
			y += 1;
			block += 2;
		} else if (index === Math.floor(num / 2)) {
			for (let index = 0; index < x; index++) {
				target[Math.floor(num / 2) * block + index].style.background = "black";
			}

			y += 1;
			block += 2;
		} else {
			for (let index = 0; index < x; index++) {
				console.log(Math.floor(num / 2) * block + index - x);
				target[Math.floor(num / 2) * block + index - x + 1].style.background =
					"black";
			}
			x -= 2;
			y += 1;
			block += 2;
		}
	}

	target.forEach((element) => {
		element.style.width = `calc(100% / ${count})`;
		element.style.height = `calc(100% / ${count})`;
	});
};

const createBorderContent = () => {
	if (num % 2 === 0) {
		return modal.classList.add("error");
	}

	operationDom("reset");
	operationDom("create", num);
	modal.classList.remove("error");
	modal.classList.add("hidden");
};

const operationDom = (operation = "create", count) => {
	if (operation === "reset") element.innerHTML = "";
	else createDom(count);
};

function updateValue(e) {
	num = Number(e.target.value);
}

button.addEventListener("click", createBorderContent);
//リロードしたらモーダルを表示
//モーダルに入力値を入れてマス目が
