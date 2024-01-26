import { generateRandomQuote } from "./quotes.js";

let quote = ""; // 当前输入的quote
let words = []; // 将quote拆分成一个一个的word
let currentShouldTypingWordIdx = 0; // 当前应该输入的work在words中的下标
let startTime; // 记录打字开始的时间
let endTime;

// 获取要操作的dom元素
const controlButton = document.querySelector("#control-button");
const quoteElem = document.querySelector("#quote");
const messageElem = document.querySelector("#message");
const typeElem = document.querySelector("#type-value");

// 开始游戏
controlButton.addEventListener("click", (event) => {
  const actor = event.target.dataset.actor;
  if (actor === "start") {
    startGame();
  } else if (actor === "reset") {
    resetGame();
  }
});

function resetGame() {
  quoteElem.innerHTML = "";
  messageElem.innerHTML = "";

  controlButton.innerHTML = "Start Game";
  controlButton.setAttribute("data-actor", "start");
  typeElem.value = "";
  typeElem.removeEventListener("input", handleInput);
}
function startGame() {
  startTime = Date.now();
  quote = generateRandomQuote();
  words = quote.split(" ");
  currentShouldTypingWordIdx = 0;

  quoteElem.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
  quoteElem
    .querySelector(`span:nth-child(${currentShouldTypingWordIdx + 1})`)
    .classList.add("message-right");

  messageElem.innerHTML = `right`;
  messageElem.classList.add("message-right");

  controlButton.setAttribute("data-actor", "reset");
  controlButton.innerHTML = "Reset Game";

  typeElem.focus();
  typeElem.addEventListener("input", handleInput);
}

// 监听输入
function handleInput(event) {
  const shouldTypingValue = words[currentShouldTypingWordIdx],
    typingValue = event.target.value;

  if (
    shouldTypingValue === typingValue &&
    currentShouldTypingWordIdx === words.length - 1
  ) {
    // 输入结束
    endGame();
    return;
  }

  if (typingValue.endsWith(" ") && typingValue.trim() === shouldTypingValue) {
    // 当前单词输入正确且全部输入
    // 切换到下一个单词
    updateUI({
      success: true,
      complete: true,
    });
    return;
  }

  if (shouldTypingValue.startsWith(typingValue)) {
    // 当前输入正确且部分输入
    updateUI({
      success: true,
      complete: false,
    });
    return;
  }

  // 当前输入错误
  updateUI({
    success: false,
  });
}

function endGame() {
  typeElem.value = "";
  endTime = Date.now();
  //   console.log(startTime, endTime);
  const totalTime = Math.floor((endTime - startTime) / 1000);
  messageElem.innerHTML = `Successful! Total time is ${totalTime}s`;
}
/*
    {
        success:,
        complete: ,
    }
*/

function setMessage(s) {
  messageElem.innerHTML = s;
  messageElem.classList.remove(`message-${s === "right" ? "wrong" : "right"}`);
  messageElem.classList.add(`message-${s}`);
}
function updateUI({ success, complete }) {
  if (!success) {
    setMessage("wrong");
    return;
  }

  setMessage("right");

  if (complete) {
    currentShouldTypingWordIdx += 1;
    quoteElem
      .querySelector(`span:nth-child(${currentShouldTypingWordIdx})`)
      .classList.remove("message-right");
    quoteElem
      .querySelector(`span:nth-child(${currentShouldTypingWordIdx + 1})`)
      .classList.add("message-right");

    typeElem.value = "";
  }
}
