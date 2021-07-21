import { EventEmitter } from "eventemitter3";

export interface RemainTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    count: number;
}

enum CountdownStatus {
    running,
    paused,
    stoped
}

export enum CountdownEvent {
    START = 'start',
    STOP = 'stop',
    RUNNING = 'running'
}

export function toFixed(num: number): string {
    return `0${num}`.slice(-2)
}

/**
 * 这种定义不太懂
 */
interface CountdownEventMap {
    [CountdownEvent.START]: [];
    [CountdownEvent.STOP]: [];
    [CountdownEvent.RUNNING]: [RemainTime, number];
}

export default class Countdown extends EventEmitter<CountdownEventMap> {
    private static COUNT_IN_MILLIS = 10;
    private static SECONDS_IN_MILLIS = 100 * Countdown.COUNT_IN_MILLIS
    private static MINUTES_IN_MILLIS = 60 * Countdown.SECONDS_IN_MILLIS
    private static HOURS_IN_MILLIS = 60 * Countdown.MINUTES_IN_MILLIS
    private static DAYS_IN_MILLIS = 24 * Countdown.HOURS_IN_MILLIS

    private endTimes: number;
    private step: number;
    private status: CountdownStatus;
    /**
     * 构造函数
     * @param endTimes 结束事件毫秒数
     */
    constructor(endTimes: number, step: number) {
        super()
        this.endTimes = endTimes
        this.step = step
        this.status = CountdownStatus.paused
        this.start()
    }

    public start() {
        this.emit(CountdownEvent.START)
        this.status = CountdownStatus.running
        this.countdown()
    }

    public pause() {
        this.status = CountdownStatus.paused
    }

    private stop() {
        this.emit(CountdownEvent.STOP)
        this.status = CountdownStatus.stoped
    }

    private countdown() {
        if(this.status != CountdownStatus.running) {
            return
        }
        const remaintime = Math.max(this.endTimes - Date.now(), 0)
        this.emit(CountdownEvent.RUNNING, this.parseRemainTime(remaintime), remaintime)

        if(remaintime != 0) {
            setTimeout(this.countdown.bind(this), this.step)
        }else{
            this.stop()
        }
    }

    private parseRemainTime(endTimes: number) {
        const days = Math.floor(endTimes / Countdown.DAYS_IN_MILLIS)
        endTimes = endTimes % Countdown.DAYS_IN_MILLIS

        const hours = Math.floor(endTimes / Countdown.HOURS_IN_MILLIS)
        endTimes = endTimes % Countdown.HOURS_IN_MILLIS

        const minutes = Math.floor(endTimes / Countdown.MINUTES_IN_MILLIS)
        endTimes = endTimes % Countdown.MINUTES_IN_MILLIS

        const seconds = Math.floor(endTimes / Countdown.SECONDS_IN_MILLIS)
        endTimes = endTimes % Countdown.SECONDS_IN_MILLIS

        const count = Math.floor(endTimes / Countdown.COUNT_IN_MILLIS)
        endTimes = endTimes % Countdown.COUNT_IN_MILLIS

        return {
            days,
            hours,
            minutes,
            seconds,
            count
        }
    }
    
}