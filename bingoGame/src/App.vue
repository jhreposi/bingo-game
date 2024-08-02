<script setup>
import {reactive, ref} from "vue";
import {Observeable, Subject} from "./Observer.js"

class Bingo extends Subject{
  constructor() {
    super();
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  removeObserver(observer){
    this.observers = this.observers.filter(registedObserver => registedObserver !== observer);
  }
  notifyObservers(data) { //callNumber 공지하기
    this.observers.forEach(observer => observer.update(data));
  }
  callInput(callNumber) {
    this.notifyObservers(callNumber);
  }
}
class Palyer extends Observeable{
  card;
  name;
  serializeCard;
  constructor(card,i,serializeCard) {
    super();
    this.card = card;
    this.serializeCard = serializeCard;
    this.bingo = 0;
    this.name = "palyer"+(i+1);
    this.pan = Array.from(Array(3), () => Array(3).fill(false))
  }
  update(data) {
    this.callNumber = data;
    this.numberCheck();
  }
  numberCheck() {
    for (let i=0; i<this.card.length; i++) {
      for(let k=0; k<this.card[i].length; k++) {
        if (this.card[i][k] === this.callNumber) {
          this.pan[i][k] = true;
        }
      }
    }
    //1줄빙고 맞는 함수 구현
    this.winningCheck();
    if (this.bingo > 0) {
      winner.value = this.name;
    }
  }
  winningCheck() {
    //세로 빙고 확인
    for(let i=0,k=0; k<this.card.length; k++) {
      if (this.pan[i][k] && this.pan[i+1][k] && this.pan[i+2][k]) {
        this.bingo = this.bingo + 1;
      }
    }
    //가로 빙고 확인
    for(let i=0,k=0; i<this.card.length; i++) {
      if (this.pan[i][k] && this.pan[i][k+1] && this.pan[i][k+2]) {
        this.bingo++;
      }
    }
    //대각선 확인
    if (this.pan[0][0] && this.pan[1][1] && this.pan[2][2]) {
      this.bingo++;
    }
    if (this.pan[0][2] && this.pan[1][1] && this.pan[2][0]) {
      this.bingo++;
    }
  }

}
let number = ref(0);
let numberWrap = ref(0)
const playersCards = ref([]);
let player
let referee
let winner = ref("");
let selectedIndex = reactive([]);
const callNumberList = ref([]);
const startBtn = ref(false);
function gameStart() {
  number.value = numberWrap.value;
  playersCards.value = distributeCard();
  startBtn.value = true
}
const randomCards = () => {
  const set = new Set();

  while (set.size < 9) {
    set.add(Math.round(Math.random() * 15));
  }

  return [...set];
};
const distributeCard = () => {
  let playersCard = [];
  referee = new Bingo();

  for (let i=0; i<number.value; i++) {
    let serializeCard = randomCards();

    const cardTable = [];
    for (let i = 0; i < 3; i++) {
      // 각 행에 3개의 원소를 추가
      cardTable.push(serializeCard.slice(i * 3, i * 3 + 3));
    }
    console.log(i)
    player = new Palyer(cardTable,i,serializeCard);
    referee.addObserver(player);
    playersCard.push(cardTable);
    selectedIndex[i] = [];
  }

  return playersCard;
}

function cardConfirm(callNumber) {
  callNumberList.value.push(callNumber);

  referee.callInput(callNumber);
  player.numberCheck();
}
function reStart() {
  winner.value = "";
  callNumberList.value = [];
  gameStart();
}

/**
 * new Array[x][y]일 때
 * call을 하고 카드를 클릭 할 떄 마다
 * [x] [0] ,[x][1], [x][2] 가 다 true인지 확인 다 true면 빙고
 * [0][y] 도 똑같이
 * 대각선은 하드코딩하거나, 패턴찾기
 *
 * call을 하는것을 가상의 심판에게 알리고
 * 다른 플레이어는 그 값을 받아서 자기 카드를 확인처리한다
 */
</script>

<template>
  Bingo Game<br>
  한줄 먼저 맞추는 사람이 승리합니다<br>
  플레이 인원수를 설정해주세요 (최소 2인)


  <input type="number" v-model="numberWrap" min="2">
  <button @click="gameStart" :class="{nonDisplay:startBtn}">게임시작</button><br>
  <button @click="reStart">재시작</button><br>
  <p v-if="winner !== ''">winner : {{winner}}</p>
    <table v-for="(cards, playerIndex) in playersCards" :key="cards">
      player{{playerIndex+1}}
      <tr v-for="card in cards" :key="card">
        <td v-for="number in card" :key="number"
            :class="{red:callNumberList.includes(number)}"
            @click="cardConfirm(number)">{{number}}</td>
      </tr>
    </table>
</template>

<style scoped>
.red {
    background-color: orangered;
}
.nonDisplay {
  display: none;
}
header {
  line-height: 1.5;
}
table {
  display: flex;
  width: 33%;
  flex-wrap: wrap;
}
tr {
  width: 100%;
}
td {
  width: 100px;
  height: 100px;
  text-align: center;

}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
