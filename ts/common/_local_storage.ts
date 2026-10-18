import { localStorageType, bingoType } from '../types/_buki-bingo-lib';

const localStorageKey = 'buki-bingo';

class StorageManager {
    key: string = localStorageKey;
    data: localStorageType;

    constructor() {
        this.data = this.getLocalStorageData();
    }

    getLocalStorageData = (key: string = localStorageKey): localStorageType => {
        const jsonData = localStorage.getItem(key);
        if (jsonData) {
            try {
                return { ...JSON.parse(jsonData) } as localStorageType;
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        }
        return this.convertOldData();
    }

    saveLocalStorageData = (
        data: Partial<localStorageType> | localStorageType[keyof localStorageType],
        key: string = localStorageKey,
        objKey: keyof localStorageType | '' = '',
    ) => {
        try {
            const current = this.getLocalStorageData(key === localStorageKey ? key : localStorageKey);
            let next: localStorageType;
            if (objKey) {
                next = { ...current, [objKey]: data };
            } else {
                next = { ...current, ...(data as Partial<localStorageType>) };
            }
            localStorage.setItem(key, JSON.stringify(next));
        } catch (error) {
            console.error('Error while saving object to LocalStorage:', error);
        }
    }

    private convertOldData = (): localStorageType => {
        const myBingoStr = localStorage.getItem('mybingo');
        let centerItem = localStorage.getItem('bingo_center') ?? 'kuma';
        const bingoSizeStr = localStorage.getItem('bingo_size');
        let bingoBackground = localStorage.getItem('bingo_background');
        const bingoEffectStr = localStorage.getItem('bingo_effect');
        const bingoTextStr = localStorage.getItem('bingo_text');

        localStorage.removeItem('mybingo');
        localStorage.removeItem('bingo_center');
        localStorage.removeItem('bingo_size');
        localStorage.removeItem('bingo_background');
        localStorage.removeItem('bingo_effect');
        localStorage.removeItem('bingo_text');

        let bingoCols = 5;
        let bingoRows = 5;
        let theme = 'default';
        const myBingo: bingoType[] = [];

        if (myBingoStr) {
            try {
                const parsed = JSON.parse(myBingoStr);
                if (Array.isArray(parsed)) myBingo.push(...parsed);
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        }

        const bingoSize = bingoSizeStr ? parseInt(bingoSizeStr) : NaN;
        if (!isNaN(bingoSize)) {
            bingoCols = bingoSize;
            bingoRows = bingoSize;
        }

        if (bingoBackground === 'green' || bingoBackground === 'transparent') {
            theme = 'simple';
            bingoBackground = 'simple';
        } else if (bingoBackground === 'ikatako') {
            bingoBackground = 'gray';
        } else if (!bingoBackground || bingoBackground === 'salmon-orange') {
            bingoBackground = 'orange';
        }

        const bingoEffect = bingoEffectStr === 'on';
        const bingoWeaponText = bingoTextStr === 'on';

        const rawLang = (window.navigator.languages?.[0]) ?? window.navigator.language;
        const language = /^ja/i.test(rawLang) ? 'ja' : 'en';

        return {
            myBingo,
            centerItem,
            bingoCols,
            bingoRows,
            bingoBackground: bingoBackground ?? 'orange',
            bingoEffect,
            bingoWeaponText,
            language,
            theme,
            weaponGrizzco: false,
            weaponMinor: false,
            weaponScope: false,
            weaponHero: false,
        };
    }
}

export const storageManager = new StorageManager();
