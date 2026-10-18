import { storageManager } from '../common/_local_storage';
import { Buki, freeItemsList, bukiLib } from './data/_weapons-list';
import { filterBukiList } from './function/_weapons-filter';
import { bingoData } from './_bingo_data';
import { bingoType } from '../types/_buki-bingo-lib';

export class BingoCreator {
    static createNewBingo = (
        bukiList: Buki[] = filterBukiList(bingoData.weaponGrizzco, bingoData.weaponMinor, bingoData.weaponScope, bingoData.weaponHero),
        centerItem: string = bingoData.centerItem,
        bingoRows: number = bingoData.bingoRows,
        bingoCols: number = bingoData.bingoCols,
    ): bingoType[] => {
        let list = bukiList.concat();

        // 中央マス決定
        let centerItemObj = freeItemsList[0];
        if (centerItem.startsWith('weapon')) {
            const centerLid = parseInt(centerItem.substring(6));
            centerItemObj = bukiLib[centerLid];
            list = list.filter(b => b.lid !== centerLid);
        } else if (centerItem === 'random') {
            centerItemObj = list.splice(Math.floor(Math.random() * list.length), 1)[0];
        } else if (centerItem === 'squid') {
            centerItemObj = freeItemsList[1];
        }

        // ブキが不足している場合はfreeで埋める
        const filler = (centerItem === 'squid' || centerItemObj.lid % 10 !== 0)
            ? freeItemsList[1]
            : freeItemsList[0];
        while (list.length < bingoRows * bingoCols - 1) {
            list.push(filler);
        }

        const centerRow = Math.ceil(bingoRows / 2) - 1;
        const centerColumn = Math.ceil(bingoCols / 2) - 1;

        const newBingo: bingoType[] = [];
        for (let row = 0; row < bingoRows; row++) {
            for (let column = 0; column < bingoCols; column++) {
                let buki: Buki;
                if (row === centerRow && column === centerColumn) {
                    buki = centerItemObj;
                } else {
                    buki = list.splice(Math.floor(Math.random() * list.length), 1)[0];
                }
                newBingo.push({ row, column, item: 'weapon' + buki.lid, done: false });
            }
        }

        bingoData.myBingo = newBingo;
        storageManager.saveLocalStorageData(newBingo, undefined, 'myBingo');
        return newBingo;
    }
}
