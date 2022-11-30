const element = document.querySelector("#test");
const itemClass = "piece";

const defaultBoardCount = 8;
let num = defaultBoardCount;
let tern = "1";

const player_1 = [
	{
		row: "3",
		line: "3",
		player: "1",
	},
	{
		row: "4",
		line: "4",
		player: "1",
	},
];

const player_2 = [
	{
		row: "3",
		line: "4",
		player: "2",
	},
	{
		row: "4",
		line: "3",
		player: "2",
	},
];

const input = document.querySelector("input");
const button = document.querySelector("button");

window.addEventListener("DOMContentLoaded", (e) => {
	createDom(num);
});

const createDom = (count) => {
	//クリックする前
	for (let row = 0; row < count; row++) {
		for (let line = 0; line < count; line++) {
			element.insertAdjacentHTML(
				"beforeend",
				`<div data-row=${row} data-line=${line} data-player=0  class='${itemClass}'></div>`
			);
		}
	}

	const target = document.querySelectorAll(`.${itemClass}`);

	target.forEach((element) => {
		element.style.width = `calc(100% / ${count})`;
		element.style.height = `calc(100% / ${count})`;
	});

	//初期位置
	//黒
	initPiece(player_1);

	//白
	initPiece(player_2);

	//クリックした時
	for (let index = 0; index < target.length; index++) {
		target[index].addEventListener("click", (e) => {
			// クリックした後
			if (e.target.dataset.player !== "0") return;
			let margePice = [];
			const reversePiece = margePice.concat(
				checkReversPiece(e.target.dataset, "top"),
				checkReversPiece(e.target.dataset, "left"),
				checkReversPiece(e.target.dataset, "bottom"),
				checkReversPiece(e.target.dataset, "right"),
				checkReversPieceOblique(e.target.dataset, {
					row: "top",
					line: "right",
				}),
				checkReversPieceOblique(e.target.dataset, { row: "top", line: "left" }),
				checkReversPieceOblique(e.target.dataset, {
					row: "bottom",
					line: "right",
				}),
				checkReversPieceOblique(e.target.dataset, {
					row: "bottom",
					line: "left",
				})
			);

			if (reversePiece.length) {
				//変更確定
				reversePiece.push({
					row: e.target.dataset.row,
					line: e.target.dataset.line,
					player: e.target.dataset.player,
				});

				//レンダリング
				reversePiece.forEach((element) => {
					let setPiece = document.querySelector(
						`[data-row='${element.row}'][data-line='${element.line}']`
					);

					setPiece.insertAdjacentHTML(
						"beforeend",
						`<span class='circle'></span>`
					);
					setPiece.querySelector(".circle").style.background =
						tern === "1" ? "black" : "white";

					//データ格納
					tern === "1" ? player_1.push(element) : player_2.push(element);

					player_2.filter((e) => {
						console.log(e, element);
						return e.row !== element.row && e.line !== element.line;
					});

					setPiece.dataset.player = tern;
				});
				margePice = [];
				tern === "1" ? (tern = "2") : (tern = "1");
			}
		});
	}
};

const createBorderContent = () => {
	operationDom("reset");
	operationDom("create", num);
};

const operationDom = (operation = "create", count) => {
	if (operation === "reset") element.innerHTML = "";
	else createDom(count);
};

//パスボタン
button.addEventListener("click", () => {
	tern === "1" ? (tern = "2") : (tern = "1");
});

//初期ピース
const initPiece = (player) => {
	for (let index = 0; index < player.length; index++) {
		let initData = document.querySelector(
			`[data-row='${player[index].row}'][data-line='${player[index].line}']`
		);
		initData.insertAdjacentHTML("beforeend", `<span class='circle'></span>`);
		initData.querySelector(".circle").style.background =
			player[index].player === "1" ? "black" : "white";
		initData.dataset.player = player[index].player;
	}
};

//上下左右
const checkReversPiece = (target, direction) => {
	let setData = [];
	let checkPiece = false;

	const isDirection = (direction) => {
		return direction === "top" || direction === "left";
	};
	for (
		let index =
			direction === "left" || direction === "right"
				? Number(target.line)
				: Number(target.row);
		isDirection(direction) ? index >= 0 : index < num;
		isDirection(direction) ? index-- : index++
	) {
		let piece =
			direction === "left" || direction === "right"
				? document.querySelector(
						`[data-row='${target.row}'][data-line='${index}']`
				  )
				: document.querySelector(
						`[data-row='${index}'][data-line='${target.line}']`
				  );

		//チェック
		//置いた位置以外の確認
		if (target !== piece.dataset) {
			if (
				piece.dataset.player === "0" //置いた位置以降が空か
			) {
				return (setData = []);
			}

			if (
				piece.dataset.player !== tern //相手のコマか
			) {
				setData.push({
					row: piece.dataset.row,
					line: piece.dataset.line,
					player: tern,
				});
			}

			if (
				piece.dataset.player === tern //自分のコマか
			) {
				checkPiece = true;
				break;
			}
		}
	}

	!checkPiece && (setData = []);
	return setData;
};

//斜め
const checkReversPieceOblique = (target, direction) => {
	let setData = [];
	let checkPiece = false;
	let line = 0;

	for (
		let index = Number(target.row);
		direction.row === "top" ? index >= 0 : index < num;
		direction.row === "top" ? index-- : index++
	) {
		const setDirection = (direction) => {
			if (direction.row === "top" && direction.line === "right") {
				let checkLine =
					Number(target.line) + line < 7 ? Number(target.line) + line : 7;

				return document.querySelector(
					`[data-row='${index}'][data-line='${checkLine}']`
				);
			}

			if (direction.row === "top" && direction.line === "left") {
				let checkLine =
					Number(target.line) - line >= 0 ? Number(target.line) - line : 0;

				return document.querySelector(
					`[data-row='${index}'][data-line='${checkLine}']`
				);
			}

			if (direction.row === "bottom" && direction.line === "right") {
				let checkLine =
					Number(target.line) + line < 7 ? Number(target.line) + line : 7;

				return document.querySelector(
					`[data-row='${index}'][data-line='${checkLine}']`
				);
			}

			if (direction.row === "bottom" && direction.line === "left") {
				let checkLine =
					Number(target.line) - line >= 0 ? Number(target.line) - line : 0;

				return document.querySelector(
					`[data-row='${index}'][data-line='${checkLine}']`
				);
			}
		};
		let piece = setDirection(direction);

		//チェック
		//置いた位置以外の確認
		if (target !== piece.dataset) {
			if (
				piece.dataset.player === "0" //置いた位置以降が空か
			) {
				return (setData = []);
			}

			if (
				piece.dataset.player !== tern //相手のコマか
			) {
				setData.push({
					row: piece.dataset.row,
					line: piece.dataset.line,
					player: tern,
				});
			}

			if (
				piece.dataset.player === tern //自分のコマか
			) {
				checkPiece = true;
				break;
			}
		}
		line = line < num ? line + 1 : line;
	}

	!checkPiece && (setData = []);
	return setData;
};
