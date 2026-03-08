export interface Prayer {
    id: string;
    title: string;
    category: "Doa Harian" | "Doa Ramadan" | "Doa Solat" | "Kesejahteraan" | "Zikir";
    arabic: string;
    transliteration: string;
    translation: string;
}

export const prayers: Prayer[] = [
    // --- DOA HARIAN ---
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
        id: "doa-ibu-bapa",
        title: "Doa Ibu Bapa",
        category: "Doa Harian",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira",
        translation: "My Lord, forgive me and my parents, and have mercy on them as they brought me up when I was small.",
    },

    // --- DOA RAMADAN ---
    {
        id: "doa-niat-puasa",
        title: "Niat Puasa Ramadan",
        category: "Doa Ramadan",
        arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        transliteration: "Nawaitu sauma ghadin 'an ada'i fardi shahri Ramadhana hadhihis-sanati lillahi ta'ala",
        translation: "I intend to fast tomorrow for the sake of Allah to perform the obligatory duty of the month of Ramadan this year.",
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

    // --- DOA SOLAT ---
    {
        id: "doa-iftitah",
        title: "Doa Iftitah",
        category: "Doa Solat",
        arabic: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلاً...",
        transliteration: "Allahu Akbaru Kabira, walhamdu lillahi kathira...",
        translation: "Allah is Great, Most Great, and praise be to Allah in abundance...",
    },
    {
        id: "doa-qunut",
        title: "Doa Qunut",
        category: "Doa Solat",
        arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ...",
        transliteration: "Allahumma-hdini fiman hadayt, wa 'afini fiman 'afayt...",
        translation: "O Allah, guide me among those You have guided, and grant me wellbeing among those You have granted wellbeing...",
    },
    {
        id: "doa-solat-dhuha",
        title: "Doa Solat Dhuha",
        category: "Doa Solat",
        arabic: "اللَّهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ وَالْبَهَاءَ بَهَاؤُكَ...",
        transliteration: "Allahumma inna-dduha'a duha'uk, wal-baha'a baha'uk...",
        translation: "O Allah, the dawn is Your dawn, the radiance is Your radiance...",
    },
    {
        id: "doa-solat-istikharah",
        title: "Doa Solat Istikharah",
        category: "Doa Solat",
        arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ...",
        transliteration: "Allahumma inni astakhiruka bi'ilmika wa astaqdiruka biqudratika...",
        translation: "O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power...",
    },

    // --- KESEJAHTERAAN (Suggestion 2) ---
    {
        id: "doa-murah-rezeki",
        title: "Doa Murah Rezeki",
        category: "Kesejahteraan",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
        transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbalan",
        translation: "O Allah, I ask You for beneficial knowledge, goodly provision and acceptable deeds.",
    },
    {
        id: "doa-penerang-hati",
        title: "Doa Penerang Hati",
        category: "Kesejahteraan",
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        transliteration: "Rabbish-rahli sadri wa yassirli amri wahlul 'uqdatan min lisani yafqahu qauli",
        translation: "My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech.",
    },
    {
        id: "doa-ketenangan",
        title: "Doa Ketenangan Hati",
        category: "Kesejahteraan",
        arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
        transliteration: "Ya Hayyu Ya Qayyum birahmatika astaghith",
        translation: "O Ever Living One, O Self-Sustaining One, in Your mercy I seek relief.",
    },

    // --- ZIKIR (Suggestion 5) ---
    {
        id: "zikir-pagi-1",
        title: "Zikir Pagi (Tasbih)",
        category: "Zikir",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "Subhanallahi wa bihamdih, subhanallahil 'azim",
        translation: "Glory be to Allah and all praise is due to Him, Glory be to Allah the Supreme.",
    },
    {
        id: "zikir-ayat-kursi",
        title: "Ayat Kursi",
        category: "Zikir",
        arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence...",
    },
];
