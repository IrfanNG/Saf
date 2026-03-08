export interface Prayer {
    id: string;
    title: string;
    category: "Doa Harian" | "Doa Ramadan" | "Doa Selepas Solat" | "Kesejahteraan" | "Zikir";
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

    // --- DOA SELEPAS SOLAT ---
    {
        id: "doa-selepas-solat-1",
        title: "Doa Selepas Solat (Asas)",
        category: "Doa Selepas Solat",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ. يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ",
        transliteration: "Alhamdulillahi rabbil 'alamin... Ya Rabbana lakal hamdu kama yanbaghi lijalali wajhika wa 'azimi sultanik...",
        translation: "Praise be to Allah, Lord of the worlds... O our Lord, to You is due all praise as is appropriate to the Majesty of Your Face and the Greatness of Your Authority...",
    },
    {
        id: "doa-selepas-solat-2",
        title: "Doa Memohon Petunjuk & Rahmat",
        category: "Doa Selepas Solat",
        arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ، وَنَعُوذُ بِكَ مِنْ سَخَطِكَ وَالنَّارِ. اللَّهُمَّ إِنَّا نَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ",
        transliteration: "Allahumma inna nas'aluka ridhaka wal-jannah, wa na'udhu bika min sakhatika wan-nar...",
        translation: "O Allah, we ask You for Your pleasure and Paradise, and we seek refuge in You from Your wrath and the Fire...",
    },
    {
        id: "doa-selepas-solat-3",
        title: "Doa Kebaikan Dunia Akhirat",
        category: "Doa Selepas Solat",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
        translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    },

    // --- KESEJAHTERAAN ---
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

    // --- ZIKIR ---
    {
        id: "zikir-ayat-kursi",
        title: "Ayat Kursi",
        category: "Zikir",
        arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard...",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
    },
    {
        id: "zikir-pagi-1",
        title: "Zikir Pagi (Tasbih)",
        category: "Zikir",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "Subhanallahi wa bihamdih, subhanallahil 'azim",
        translation: "Glory be to Allah and all praise is due to Him, Glory be to Allah the Supreme.",
    },
];
