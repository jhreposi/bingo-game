
export class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(registedObserver => registedObserver !== observer);
    }

    notifyObservers(data) {
        // 함수로 넣었을 때
        // this.observers.forEach(observer => observer(data));
        this.observers.forEach(observer => observer.update(data));
    }
}
export class Observeable {
    callNumber;
    constructor() {
        this.callNumber;
    }
    update(data) {
        this.callNumber = data;
    }
}

/**
 *  옵저버 패턴은 단반향소통이다
 *  여기서는 콜한 값만 구독한 사람한테 주면된다
 *  만약 매니저 기록자 플레이어 등 많아질때 값을 주기만하고 각자 뭘할지는 상관안해도된다
 *
 *  주제를 반복되는 행위?를 가지고 잡으면된다
 *  callable 을 구현한 caller
 *
 *  observe를 구현한 player??
 *
 *  state 패턴?
 */

