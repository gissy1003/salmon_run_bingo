import { getElement } from '../common/function/_get_element';
import { bingoData } from './_bingo_data';
import { BingoCenterItem } from './_bingo_center_item';
import { BingoCreator } from './_bingo_creator';
import { bukiLib, Buki } from './data/_weapons-list';

type CellClickCallback = (element: HTMLElement, itemIndex: number) => void;

export class BingoRender {

    // 中央ブキ選択フォーム描写
    static renderCenterWeaponSelector(elementId: string, list: Buki[], language = bingoData.language) {
        const boxEle = getElement('js-' + elementId + '__box');
        if (!boxEle) return;

        boxEle.innerText = '';

        const aspectRatio = window.innerWidth / (window.innerHeight * 0.8);
        let numCols = 1;
        for (numCols = 1; ; numCols++) {
            if (numCols / (list.length / numCols) > aspectRatio) break;
        }
        if (numCols < 4) numCols = 4;
        const numRows = Math.ceil(list.length / numCols);

        let index = 0;
        for (let row = 0; row < numRows; row++) {
            const rowEle = document.createElement('div');
            rowEle.className = 'p-bukiBox__tr';

            for (let column = 0; column < numCols; column++) {
                const cellEle = document.createElement('div');
                cellEle.className = 'p-bukiBox__td';

                const img = document.createElement('img');
                img.className = 'p-bukiBox__img';
                img.width = 100;
                img.height = 100;
                img.src = './img/weapons/--.webp';

                if (index < list.length) {
                    const { id, lid, ja, en } = list[index];
                    img.src = `./img/weapons/${id}.webp`;
                    const label = language === 'en' ? en : ja;
                    img.alt = label;
                    img.title = label;
                    cellEle.id = `js-weapon-${id}`;
                    cellEle.addEventListener('click', () => BingoCenterItem.setCenterWeapon(lid, [ja, en], elementId));
                }

                cellEle.appendChild(img);
                rowEle.appendChild(cellEle);
                index++;
            }
            boxEle.appendChild(rowEle);
        }
    }


    // ビンゴカード描写
    static renderBingoCard(
        callback: CellClickCallback,
        elementId: string,
        myBingo = bingoData.myBingo,
        bingoRows = bingoData.bingoRows,
        bingoCols = bingoData.bingoCols,
        language = bingoData.language,
    ): number {
        const tableEle = getElement(elementId);
        if (!tableEle) return 0;

        tableEle.innerHTML = '';
        let doneCount = 0;
        if (myBingo.length < 1) myBingo = BingoCreator.createNewBingo();

        for (let row = 0; row < bingoRows; row++) {
            const rowEle = document.createElement('div');
            rowEle.className = 'p-bingo__tr';

            for (let column = 0; column < bingoCols; column++) {
                const itemIndex = bingoCols * row + column;
                if (myBingo.length < itemIndex + 1) continue;

                const itemName = myBingo[itemIndex].item;
                let itemLid: number;
                if (itemName === 'squid') {
                    itemLid = -11;
                } else if (itemName.startsWith('weapon')) {
                    itemLid = parseInt(itemName.substring(6));
                } else if (itemName.startsWith('item')) {
                    itemLid = parseInt(itemName.substring(4));
                } else {
                    itemLid = -10;
                }

                const item: Buki = bukiLib[itemLid];
                const name = language === 'ja' ? item.ja : item.en;

                const cellEle = document.createElement('div');
                cellEle.id = `${row}-${column}`;
                cellEle.className = 'p-bingo__td';
                cellEle.title = name;
                if (myBingo[itemIndex].done) {
                    cellEle.classList.add('is-done');
                    doneCount++;
                }
                cellEle.addEventListener('click', () => callback(cellEle, itemIndex));

                const img = document.createElement('img');
                img.src = `./img/weapons/${item.id}.webp`;
                img.className = 'p-bingo__weaponImg';
                img.width = 100;
                img.height = 100;
                img.alt = name;
                img.title = name;
                if (itemLid < 0) img.classList.add('p-bingo__weaponImg-free');

                const nameEle = document.createElement('span');
                nameEle.className = 'p-bingo__weaponName';
                const jaSpan = document.createElement('span');
                jaSpan.lang = 'ja';
                jaSpan.innerText = item.ja;
                const enSpan = document.createElement('span');
                enSpan.lang = 'en';
                enSpan.innerText = item.en;
                nameEle.appendChild(jaSpan);
                nameEle.appendChild(enSpan);

                cellEle.appendChild(img);
                if (itemLid > -1) cellEle.appendChild(nameEle);
                rowEle.appendChild(cellEle);
            }
            tableEle.appendChild(rowEle);
        }
        return doneCount;
    }
}
