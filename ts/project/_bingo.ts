import { storageManager } from '../common/_local_storage';
import { Backup } from '../common/_backup';
import { ImageExporter } from '../common/_image_exporter';
import { MenuManager } from '../common/_menu_manager';
import { attachHandler } from '../common/function/_attach_handler';
import { getElement } from '../common/function/_get_element';
import { t } from '../common/_i18n';
import { bingoData } from './_bingo_data';
import { bingoSettings } from './_bingo_settings';
import { BingoRender } from './_bingo_render';
import { BingoCreator } from './_bingo_creator';
import { Backup as BackupAlias } from '../common/_backup';
import { checkBingo } from './function/_check_bingo';
import { playBingoEffect } from './function/_play_bingo_effect';

class Bingo {
    initBingo = () => {
        bingoData.doneCount = BingoRender.renderBingoCard(this.click, 'js-bingo__table');
        bingoData.bingoCount = checkBingo();
        bingoSettings.restore();

        // ビンゴ再生成ボタン
        Array.from(document.getElementsByClassName('js-createBingoCard__buttons')).forEach(el => {
            attachHandler(el as HTMLElement, this.regenerate);
        });

        // 武器名表示
        attachHandler('js-settingsOptions__bingoWeaponText', () => {
            const el = getElement('js-settingsOptions__bingoWeaponText') as HTMLInputElement;
            bingoSettings.applyCheckboxValue(el, 'bingoWeaponText', true, 'js-bingo__table', 'js-showWeaponTxt');
        }, 'change');

        // ビンゴエフェクト
        attachHandler('js-settingsOptions__bingoEffect', () => {
            const el = getElement('js-settingsOptions__bingoEffect') as HTMLInputElement;
            bingoSettings.applyCheckboxValue(el, 'bingoEffect', true);
        }, 'change');

        // ブキフィルタ
        Array.from(document.getElementsByName('settingsWeapons')).forEach(el => {
            attachHandler(el as HTMLElement, () =>
                bingoSettings.updateWeaponsFilter('js-weaponsNumber-text', 'settingsWeapons')
            );
        });

        // カードデザイン
        Array.from(document.getElementsByName('settingsBingoBackground') as NodeListOf<HTMLInputElement>).forEach(radio => {
            attachHandler(radio.id, () => bingoSettings.applyBingoBackground(radio.value, true));
        });

        // テーマ
        Array.from(document.getElementsByName('settingsTheme') as NodeListOf<HTMLInputElement>).forEach(radio => {
            attachHandler(radio.id, () => bingoSettings.applyTheme(radio.value, true));
        });

        // 言語
        Array.from(document.getElementsByName('settingsLanguage') as NodeListOf<HTMLInputElement>).forEach(radio => {
            attachHandler(radio.id, () => bingoSettings.applyLanguage(radio.value, true));
        });

        // 中央マス選択ダイアログ
        attachHandler('js-settingsCenterItem__centerGrizzco-label', () => MenuManager.openDialog('js-centerGrizzco__dialog'));
        attachHandler('js-settingsCenterItem__centerWeapon-label', () => MenuManager.openDialog('js-centerWeapon__dialog'));

        // バックアップ
        attachHandler('js-saveDataSlot-button', () => Backup.saveToSlot(bingoData.language));
        attachHandler('js-loadDataSlot-button', () => Backup.loadFromSlot(bingoData.language, this.reloadSettings));
        attachHandler('js-saveJson-button', () => Backup.exportFile(bingoData.language, 'buki-bingo_export'));
        attachHandler('js-loadJson-button', () => Backup.importFile(bingoData.language, this.reloadSettings));

        // 画像出力
        attachHandler('js-downloadImg-button', () =>
            ImageExporter.exportImage('js-bingo__box', 'bingo', 'js-downloadImg-button')
        );
    }

    private reloadSettings = () => {
        bingoData.reloadLocalStorage();
        bingoData.doneCount = BingoRender.renderBingoCard(this.click, 'js-bingo__table');
        bingoData.bingoCount = checkBingo();
        bingoSettings.restore();
    }

    private click = (element: HTMLElement, itemIndex: number) => {
        if (element.classList.toggle('is-done')) {
            bingoData.myBingo[itemIndex].done = true;
            bingoData.doneCount++;
        } else {
            bingoData.myBingo[itemIndex].done = false;
            bingoData.doneCount--;
        }

        const bingoCount = checkBingo();

        if (bingoData.bingoEffect && bingoCount > bingoData.bingoCount) {
            playBingoEffect('js-confetti');
            if (
                bingoData.theme !== 'transparent' &&
                bingoData.theme !== 'green' &&
                bingoData.doneCount >= bingoData.myBingo.length
            ) {
                playBingoEffect('js-confetti');
                MenuManager.openDialog('js-compleat__dialog');
                playBingoEffect('js-confetti');
            }
        }

        bingoData.bingoCount = bingoCount;
        storageManager.saveLocalStorageData(bingoData.myBingo, undefined, 'myBingo');
    }

    private regenerate = () => {
        if (bingoData.doneCount > 0) {
            if (!window.confirm(t('bingo_regen_confirm', bingoData.language))) return;
        }
        bingoSettings.applyBingoSettings();
        bingoData.myBingo = BingoCreator.createNewBingo();
        bingoData.doneCount = BingoRender.renderBingoCard(this.click, 'js-bingo__table');
        bingoData.bingoCount = checkBingo();
        MenuManager.closeMenu();
    }
}

export let bingo = new Bingo();
