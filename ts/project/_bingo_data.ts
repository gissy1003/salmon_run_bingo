import { bingoType, localStorageType } from '../types/_buki-bingo-lib';
import { storageManager } from '../common/_local_storage';

function detectLanguage(): string {
    const raw = window.navigator.languages?.[0] ?? window.navigator.language;
    return /^ja/i.test(raw) ? 'ja' : 'en';
}

export class BingoData {
    myBingo: bingoType[] = [];
    centerItem: string = 'kuma';
    bingoCols: number = 5;
    bingoRows: number = 5;

    weaponGrizzco: boolean = false;
    weaponMinor: boolean = false;
    weaponScope: boolean = false;
    weaponHero: boolean = false;

    bingoBackground: string = 'salmonrun';
    bingoEffect: boolean = true;
    bingoWeaponText: boolean = false;

    theme: string = 'default';
    language: string = '';

    bingoCount: number = 0;
    doneCount: number = 0;

    constructor(data: localStorageType = storageManager.getLocalStorageData()) {
        Object.assign(this, data);
        if (!this.language) this.language = detectLanguage();
        storageManager.saveLocalStorageData(this);
    }

    reloadLocalStorage = () => {
        Object.assign(this, storageManager.getLocalStorageData());
    }
}

export let bingoData = new BingoData();
