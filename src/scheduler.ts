const timeout = time =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export class Scheduler {
  private waitTask: any[];
  private currentTasks: Set<() => Promise<any>>;

  constructor() {
    this.waitTask = [];
    this.currentTasks = new Set();
  }

  add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.currentTasks.size >= 2) {
      return new Promise((resolve) => {
        const taskFn = () => {
          resolve(this.doTask(fn));
        };
        this.waitTask.push(taskFn);
      });
    } else {
      return this.doTask(fn);
    }
  }

  private doTask(fn) {
    this.currentTasks.add(fn);
    return fn().finally(() => {
      this.currentTasks.delete(fn);
      if (this.waitTask.length > 0 && this.currentTasks.size < 2) {
        const taskFn = this.waitTask.shift();
        taskFn();
      }
    });
  }
}

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(4000, "1");
addTask(3500, "2");
addTask(4000, "3");
addTask(3000, "4");
addTask(3000, "5");
addTask(3000, "6");
// 3.5; //2
// 4; // 1
// 7; // 4
// 7.5; // 3
// 5
// 6
