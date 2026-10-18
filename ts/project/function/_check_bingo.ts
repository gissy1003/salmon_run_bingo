import { bingoData } from '../_bingo_data';
import { getElement } from '../../common/function/_get_element';

export function checkBingo(
    myBingo = bingoData.myBingo,
    bingoRows = bingoData.bingoRows,
    bingoCols = bingoData.bingoCols,
) {
    // リセット
    for (let index = 0; index < myBingo.length; index++) {
        const itemEle = getElement(myBingo[index].row + '-' + myBingo[index].column);
        if (itemEle) {
            itemEle.classList.remove('is-reach');
            itemEle.classList.remove('is-bingo');
        }
    }

    const bingoGroups: { [key: number]: string }[] = [];
    const reachGroups: { [key: number]: string }[] = [];

    // 横
    for (let row = 0; row < bingoRows; row++) {
        const group: { [key: number]: string } = {};
        let doneCount = 0;
        for (let column = 0; column < bingoCols; column++) {
            const index = row * bingoCols + column;
            group[index] = row + '-' + column;
            if (myBingo[index].done) doneCount++;
        }
        if (doneCount === bingoCols - 1) reachGroups.push(group);
        else if (doneCount === bingoCols) bingoGroups.push(group);
    }

    // 縦
    for (let column = 0; column < bingoCols; column++) {
        const group: { [key: number]: string } = {};
        let doneCount = 0;
        for (let row = 0; row < bingoRows; row++) {
            const index = row * bingoCols + column;
            group[index] = row + '-' + column;
            if (myBingo[index].done) doneCount++;
        }
        if (doneCount === bingoRows - 1) reachGroups.push(group);
        else if (doneCount === bingoRows) bingoGroups.push(group);
    }

    // 斜め（正方形のときのみ）
    if (bingoRows === bingoCols) {
        const groupLTRB: { [key: number]: string } = {};
        let doneCountLTRB = 0;
        const groupRTLB: { [key: number]: string } = {};
        let doneCountRTLB = 0;
        for (let row = 0; row < bingoRows; row++) {
            const indexLTRB = row * bingoCols + row;
            groupLTRB[indexLTRB] = row + '-' + row;
            if (myBingo[indexLTRB].done) doneCountLTRB++;

            const indexRTLB = row * bingoCols + (bingoRows - 1 - row);
            groupRTLB[indexRTLB] = row + '-' + (bingoRows - 1 - row);
            if (myBingo[indexRTLB].done) doneCountRTLB++;
        }
        if (doneCountLTRB === bingoRows - 1) reachGroups.push(groupLTRB);
        else if (doneCountLTRB === bingoRows) bingoGroups.push(groupLTRB);
        if (doneCountRTLB === bingoRows - 1) reachGroups.push(groupRTLB);
        else if (doneCountRTLB === bingoRows) bingoGroups.push(groupRTLB);
    }

    // マスに色付け
    bingoGroups.forEach(group => {
        for (const index in group) {
            const itemEle = getElement(group[index as unknown as number]);
            if (itemEle) itemEle.classList.add('is-bingo');
        }
    });
    reachGroups.forEach(group => {
        for (const index in group) {
            const itemEle = getElement(group[index as unknown as number]);
            if (itemEle && !itemEle.classList.contains('is-done')) itemEle.classList.add('is-reach');
        }
    });

    // ビンゴメッセージ
    const messageObjs = [
        {
            elementId: 'js-bingo__messageBox-bingo',
            singularJa: 'BINGO', singularEn: 'BINGO',
            pluralJa: 'BINGOs', pluralEn: 'BINGOs',
            counts: bingoGroups.length,
        },
        {
            elementId: 'js-bingo__messageBox-reach',
            singularJa: 'リーチ', singularEn: 'Reach',
            pluralJa: 'リーチ', pluralEn: 'Reaches',
            counts: reachGroups.length,
        },
    ];

    messageObjs.forEach(obj => {
        const jaEle = getElement(obj.elementId + '__ja');
        const enEle = getElement(obj.elementId + '__en');
        if (!jaEle || !enEle) return;

        if (obj.counts > 0) {
            const exclamations = '!'.repeat(obj.counts);
            if (obj.counts > 1) {
                jaEle.innerText = `${obj.counts} ${obj.pluralJa} ${exclamations}`;
                enEle.innerText = `${obj.counts} ${obj.pluralEn} ${exclamations}`;
            } else {
                jaEle.innerText = `${obj.singularJa} ${exclamations}`;
                enEle.innerText = `${obj.singularEn} ${exclamations}`;
            }
        } else {
            jaEle.innerHTML = '';
            enEle.innerHTML = '';
        }
    });

    return bingoGroups.length;
}
