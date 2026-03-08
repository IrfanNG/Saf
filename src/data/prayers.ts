export interface Prayer {
    id: string;
    title: string;
    category: "Doa Harian" | "Doa Ramadan";
    arabic: string;
    transliteration: string;
    translation: string;
}

export const prayers: Prayer[] = [
    {
        id: "doa-sebelum-makan",
        title: "Doa Sebelum Makan",
        category: "Doa Harian",
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Allahumma barik lana fima razaqtana waqina 'adhaban-nar",
        translation: "O Allah! Bless us in what You have provided us with and save us from the punishment of the Fire.",
    },
    {
        id: "doa-setelah-makan",
        title: "Doa Setelah Makan",
        category: "Doa Harian",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
        translation: "Praise be to Allah Who has fed us and given us drink, and made us Muslims.",
    },
    {
        id: "doa-tidur",
        title: "Doa Sebelum Tidur",
        category: "Doa Harian",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "In Your name, O Allah, I die and I live.",
    },
    {
        id: "doa-bangun-tidur",
        title: "Doa Bangun Tidur",
        category: "Doa Harian",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
        translation: "Praise be to Allah Who gave us life after He had caused us to die and to Him is the return.",
    },
    {
        id: "doa-masuk-tandas",
        title: "Doa Masuk Tandas",
        category: "Doa Harian",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith",
        translation: "O Allah, I seek refuge with You from all offensive and wicked things (evil spirits).",
    },
    {
        id: "doa-keluar-tandas",
        title: "Doa Keluar Tandas",
        category: "Doa Harian",
        arabic: "غُفْرَانَكَ",
        transliteration: "Ghufranak",
        translation: "I seek Your forgiveness.",
    },
    {
        id: "doa-ibu-bapa",
        title: "Doa Ibu Bapa",
        category: "Doa Harian",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira",
        translation: "My Lord, forgive me and my parents, and have mercy on them as they brought me up when I was small.",
    },
    {
        id: "doa-niat-puasa",
        title: "Niat Puasa Ramadan",
        category: "Doa Ramadan",
        arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        transliteration: "Nawaitu sauma ghadin 'an ada'i fardi shahri Ramadhana hadhihis-sanati lillahi ta'ala",
        translation: "I intend to fast tomorrow for the sake of Allah to perform the obligatory duty of the month of Ramadan this year.",
    },
    {
        id: "doa-berbuka-puasa",
        title: "Doa Berbuka Puasa",
        category: "Doa Ramadan",
        arabic: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
        transliteration: "Allahumma laka sumtu wa bika amantu wa 'ala rizqika aftartu",
        translation: "O Allah, for You I have fasted and in You I believe, and with Your provision I have broken my fast.",
    },
    {
        id: "doa-berbuka-sahih",
        title: "Doa Berbuka (Sahih)",
        category: "Doa Ramadan",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba az-zama'u wabtallati al-'uruqu wa thabata al-ajru in sha' Allah",
        translation: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    },
    {
        id: "doa-lailatul-qadar",
        title: "Doa Lailatul Qadar",
        category: "Doa Ramadan",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        translation: "O Allah, You are Most Forgiving and You love forgiveness, so forgive me.",
    },
];
