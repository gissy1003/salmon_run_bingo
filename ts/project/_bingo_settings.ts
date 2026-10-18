import { storageManager } from '../common/_local_storage';
import { getElement } from '../common/function/_get_element';
import { bingoData, BingoData } from './_bingo_data';
import { BingoCenterItem } from './_bingo_center_item';
import { BingoRender } from './_bingo_render';
import { bukiLib, bukiListGrizzco } from './data/_weapons-list';
import { filterBukiList } from './function/_weapons-filter';

type SettingApplyFn = (value: string) => void;
type CheckboxApplyFn = (dataKey: string, element: HTMLInputElement) => void;

class BingoSettings {

    restore = () => {
        this.restoreRadio('centerItem', 'settingsCenterItem', v => this.applyCenterItem(v));
        this.restoreRadio('bingoCols', 'settingsSize');
        this.restoreRadio('bingoBackground', 'settingsBingoBackground', v => this.applyBingoBackground(v));
        this.restoreRadio('theme', 'settingsTheme', v => this.applyTheme(v));
        this.restoreRadio('language', 'settingsLanguage', v => this.applyLanguage(v));

        this.restoreCheckbox('bingoEffect', 'settingsOptions__bingoEffect');
        this.restoreCheckbox('bingoWeaponText', 'settingsOptions__bingoWeaponText',
            (dataKey, element) => this.applyCheckboxValue(
                element, dataKey as 'bingoWeaponText', undefined, 'js-bingo__table', 'js-showWeaponTxt'
            )
        );
        this.restoreCheckbox('weaponGrizzco', 'settingsWeapons__grizzco');
        this.restoreCheckbox('weaponMinor', 'settingsWeapons__minor');
        this.restoreCheckbox('weaponScope', 'settingsWeapons__scope');
        this.restoreCheckbox('weaponHero', 'settingsWeapons__hero');

        bingoSettings.updateWeaponsFilter('js-weaponsNumber-text', 'settingsWeapons');
        BingoRender.renderCenterWeaponSelector('centerGrizzco', bukiListGrizzco.concat());
    }


    applyBingoSettings = () => {
        // 中央
        const centerRadios = Array.from(document.getElementsByName('settingsCenterItem')) as HTMLInputElement[];
        centerRadios.forEach(radio => {
            if (radio.checked) bingoData.centerItem = radio.value;
        });

        // 大きさ
        const sizeRadios = Array.from(document.getElementsByName('settingsSize')) as HTMLInputElement[];
        sizeRadios.forEach(radio => {
            if (!radio.checked) return;
            if (radio.value === 'all') {
                bingoData.bingoCols = 7;
                bingoData.bingoRows = 9;
            } else {
                bingoData.bingoCols = parseInt(radio.value);
                bingoData.bingoRows = parseInt(radio.value);
            }
        });

        // ブキオプション
        const weaponCheckboxes = Array.from(document.getElementsByName('settingsWeapons')) as HTMLInputElement[];
        const weaponKeyMap: Record<string, 'weaponGrizzco' | 'weaponMinor' | 'weaponScope' | 'weaponHero'> = {
            grizzco: 'weaponGrizzco',
            minor:   'weaponMinor',
            scope:   'weaponScope',
            hero:    'weaponHero',
        };
        weaponCheckboxes.forEach(cb => {
            const key = weaponKeyMap[cb.value];
            if (key) bingoData[key] = cb.checked;
        });

        storageManager.saveLocalStorageData({
            centerItem:    bingoData.centerItem,
            bingoCols:     bingoData.bingoCols,
            bingoRows:     bingoData.bingoRows,
            weaponGrizzco: bingoData.weaponGrizzco,
            weaponMinor:   bingoData.weaponMinor,
            weaponScope:   bingoData.weaponScope,
            weaponHero:    bingoData.weaponHero,
        });
    }


    applyBingoBackground = (value: string, shouldSave = false) => {
        this.applySetting('js-bingo__box', 'className', 'js-card__' + value, 'bingoBackground', value, shouldSave);
    }

    applyTheme = (value: string, shouldSave = false) => {
        this.applySetting(document.body, 'className', 'theme-' + value, 'theme', value, shouldSave);
    }

    applyLanguage = (value: string, shouldSave = false) => {
        this.applySetting(document.body, 'lang', value, 'language', value, shouldSave);
    }


    private applySetting = (
        element: HTMLElement | string,
        elemKey: 'className' | 'lang',
        elmValue: string,
        dataKey: 'bingoBackground' | 'theme' | 'language',
        dataValue: string,
        shouldSave = false,
    ) => {
        const target = getElement(element);
        if (!target) return;
        target[elemKey] = elmValue;
        bingoData[dataKey] = dataValue;
        if (shouldSave) storageManager.saveLocalStorageData(dataValue, undefined, dataKey);
    }


    private applyCenterItem = (value: string) => {
        if (!value.startsWith('weapon')) return;
        const itemId = parseInt(value.substring(6));
        const item = bukiLib[itemId];
        const elementId = itemId >= 20000 ? 'centerGrizzco' : 'centerWeapon';
        BingoCenterItem.setCenterWeapon(item.lid, [item.ja, item.en], elementId);
    }


    applyCheckboxValue = (
        inputEle: HTMLInputElement,
        dataKey: 'bingoWeaponText' | 'bingoEffect',
        shouldSave = false,
        element?: HTMLElement | string,
        className?: string,
    ) => {
        if (!(dataKey in bingoData)) return;

        if (element && className) {
            const target = getElement(element);
            if (!target) return;
            if (inputEle.checked) target.classList.add(className);
            else target.classList.remove(className);
        }

        bingoData[dataKey] = inputEle.checked;
        if (shouldSave) storageManager.saveLocalStorageData(inputEle.checked, undefined, dataKey);
    }


    updateWeaponsFilter = (elementId: string, inputName: string) => {
        const targetEle = getElement(elementId);
        const checkboxes = Array.from(document.getElementsByName(inputName)) as HTMLInputElement[];
        if (!targetEle || checkboxes.length !== 4) return;

        const checked = checkboxes.map(cb => cb.checked);
        const bukiList = filterBukiList(...(checked as [boolean, boolean, boolean, boolean]));
        targetEle.innerText = String(bukiList.length);

        const checkedForSelect: [boolean, boolean, boolean, boolean] = [false, checked[1], checked[2], checked[3]];
        BingoRender.renderCenterWeaponSelector('centerWeapon', filterBukiList(...checkedForSelect));
    }


    private restoreRadio = (
        dataKey: keyof BingoData,
        radioName: string,
        applyFn?: SettingApplyFn,
    ) => {
        if (!(dataKey in bingoData)) return;
        const radios = Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="${radioName}"]`));
        radios.forEach(radio => {
            if (String(bingoData[dataKey]) === radio.value) radio.checked = true;
        });
        if (applyFn) applyFn(String(bingoData[dataKey]));
    }


    private restoreCheckbox = (
        dataKey: 'bingoEffect' | 'bingoWeaponText' | 'weaponGrizzco' | 'weaponMinor' | 'weaponScope' | 'weaponHero',
        checkboxId: string,
        applyFn?: CheckboxApplyFn,
    ) => {
        if (!(dataKey in bingoData)) return;
        const checkbox = getElement('js-' + checkboxId) as HTMLInputElement | null;
        if (!checkbox) return;
        checkbox.checked = bingoData[dataKey] as boolean;
        if (applyFn) applyFn(dataKey, checkbox);
    }
}

export const bingoSettings = new BingoSettings();
