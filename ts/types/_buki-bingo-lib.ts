export interface bingoType {
    row: number;
    column: number;
    item: string;
    done: boolean;
}

export interface localStorageType {
    myBingo: bingoType[];
    centerItem: string;
    bingoCols: number;
    bingoRows: number;
    bingoBackground: string;
    bingoEffect: boolean;
    bingoWeaponText: boolean;
    theme: string;
    language: string;
    weaponGrizzco: boolean;
    weaponMinor: boolean;
    weaponScope: boolean;
    weaponHero: boolean;
}
