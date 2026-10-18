type Message = { ja: string; en: string };
type Vars = Record<string, string | number>;

const messages: Record<string, Message> = {
    slot_save_confirm:   { ja: 'スロット{{n}}にデータを上書き保存します。', en: 'Data will be overwritten and saved in Slot {{n}}.' },
    slot_save_fail:      { ja: '現在のデータを取得できなかったため保存できませんでした。', en: 'Unable to save as the current data could not be retrieved.' },
    slot_no_selection:   { ja: 'スロットが選択されていません。', en: 'No slot selected.' },
    slot_load_confirm:   { ja: 'スロット{{n}}からデータを復元します。現在のデータは失われます。', en: 'Do you want to restore data from Slot {{n}}? Current data will be lost.' },
    slot_load_empty:     { ja: 'スロット{{n}}にはデータがありませんでした。', en: 'There is no data in slot {{n}}.' },
    slot_load_fail:      { ja: '読み込みに失敗しました。', en: 'Failed to load.' },
    export_success:      {
        ja: 'jsonファイルの書き出しに成功しました。\nこのファイルをインポートから読み込むことで現在の状態を復元できます。\n\n※ データスロットのデータは含みません。データスロットもバックアップしたい場合はスロットからロードした後にそれぞれ個別に書き出して下さい。',
        en: 'JSON file export successful.\nYou can restore the current state by importing this file.\n\n※ Data slot information is not included. If you want to back up data slots, please export them individually after loading.',
    },
    import_confirm:      { ja: 'バックアップファイルからデータをロードします。現在のデータは失われます。', en: 'You are about to load data from a backup file. Loading this data will overwrite your current data. Are you sure you want to proceed?' },
    import_success:      { ja: 'ファイルの読み込みに成功しました。', en: 'File loaded successfully.' },
    import_fail:         { ja: 'ファイルの読み込みに失敗しました。', en: 'Failed to read the file.' },
    bingo_regen_confirm: { ja: '現在の進行状況は消えますが、本当にビンゴカードを作り直しても良いですか？', en: 'The current progress will be lost. Are you sure you want to regenerate the Bingo card?' },
};

export function t(key: string, lang: string, vars: Vars = {}): string {
    const entry = messages[key];
    if (!entry) return key;
    let text = lang === 'ja' ? entry.ja : entry.en;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
    return text;
}
