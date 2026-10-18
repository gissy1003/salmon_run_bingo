import { localStorageType } from '../types/_buki-bingo-lib';
import { storageManager } from '../common/_local_storage';
import { getElement } from './function/_get_element';
import { getFileTimestamp } from './function/_get_file_timestamp';
import { t } from './_i18n';

type ReloadCallback = () => void;

export class Backup {

    static saveToSlot(language: string = 'ja') {
        for (let index = 1; index <= 3; index++) {
            const slotRadio = getElement('js-saveDataSlot--' + index) as HTMLInputElement | null;
            if (!slotRadio || !slotRadio.checked) continue;

            if (!window.confirm(t('slot_save_confirm', language, { n: index }))) return;

            const current = storageManager.getLocalStorageData();
            if (current) {
                storageManager.saveLocalStorageData(current, storageManager.key + '-' + index);
            } else {
                window.alert(t('slot_save_fail', language));
            }
            return;
        }
        window.alert(t('slot_no_selection', language));
    }

    static loadFromSlot(language: string = 'ja', callback: ReloadCallback): boolean {
        for (let index = 1; index <= 3; index++) {
            const slotRadio = getElement('js-saveDataSlot--' + index) as HTMLInputElement | null;
            if (!slotRadio || !slotRadio.checked) continue;

            if (!window.confirm(t('slot_load_confirm', language, { n: index }))) return false;

            const slotData = storageManager.getLocalStorageData(storageManager.key + '-' + index);
            if (!slotData.myBingo || slotData.myBingo.length < 1) {
                window.alert(t('slot_load_empty', language, { n: index }));
                return false;
            }

            if (!Backup.mergeAndApply(slotData, storageManager.getLocalStorageData(), callback)) {
                window.alert(t('slot_load_fail', language));
            }
            return true;
        }
        window.alert(t('slot_no_selection', language));
        return false;
    }

    static exportFile(language: string = 'ja', fileName: string = 'export') {
        const jsonData = JSON.stringify(storageManager.getLocalStorageData(), null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const fileNameWithDate = `${fileName}_${getFileTimestamp()}.json`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileNameWithDate;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.alert(t('export_success', language));
    }

    static importFile(language: string = 'ja', callback: ReloadCallback) {
        const loadJsonInput = getElement('js-loadJson-input') as HTMLInputElement | null;
        if (!loadJsonInput) return;

        if (!window.confirm(t('import_confirm', language))) return;

        const fileChangeListener = (event: Event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed: localStorageType = JSON.parse(e.target!.result as string);
                    if (!Backup.mergeAndApply(parsed, storageManager.getLocalStorageData(), callback)) {
                        throw new Error('mergeAndApply failed');
                    }
                    window.alert(t('import_success', language));
                } catch (error) {
                    window.alert(t('import_fail', language));
                    console.error('Error while parsing JSON file:', error);
                }
                input.value = '';
                loadJsonInput.removeEventListener('change', fileChangeListener);
            };
            reader.readAsText(file);
        };

        loadJsonInput.addEventListener('change', fileChangeListener);
        loadJsonInput.click();
    }

    static mergeAndApply(
        incoming: localStorageType,
        current: localStorageType,
        callback: ReloadCallback,
    ): boolean {
        if (!incoming || !current) return false;

        const merged: localStorageType = { ...current };
        (Object.keys(current) as (keyof localStorageType)[]).forEach(key => {
            if (key in incoming && typeof incoming[key] === typeof current[key]) {
                (merged[key] as localStorageType[typeof key]) = incoming[key] as localStorageType[typeof key];
            }
        });

        storageManager.saveLocalStorageData(merged);
        callback();
        return true;
    }
}
