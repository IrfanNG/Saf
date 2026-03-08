export interface Prayer {
    id: string;
    title: string;
    category: "Doa Harian" | "Doa Ramadan" | "Doa Selepas Solat" | "Niat Solat" | "Kesejahteraan" | "Zikir";
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

    // --- DOA SELEPAS SOLAT ---
    {
        id: "doa-selepas-solat-1",
        title: "Doa Selepas Solat (Asas)",
        category: "Doa Selepas Solat",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ. يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ",
        transliteration: "Alhamdulillahi rabbil 'alamin...",
        translation: "Praise be to Allah, Lord of the worlds... O our Lord, to You is due all praise as is appropriate to the Majesty of Your Face and the Greatness of Your Authority...",
    },

    // --- NIAT SOLAT ---
    {
        id: "niat-subuh",
        title: "Niat Solat Subuh",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhas-subhi rak'ataini ada'an lillahi ta'ala",
        translation: "I intend to perform the obligatory Subuh prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-zohor",
        title: "Niat Solat Zohor",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhaz-zuhri arba'a rak'atin ada'an lillahi ta'ala",
        translation: "I intend to perform the obligatory Zohor prayer, four rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-asar",
        title: "Niat Solat Asar",
        category: "Niat Solat",
        arabic: "أُصَلِّي fَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-'asri arba'a rak'atin ada'an lillahi ta'ala",
        translation: "I intend to perform the obligatory Asar prayer, four rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-maghrib",
        title: "Niat Solat Maghrib",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-maghribi thalatha rak'atin ada'an lillahi ta'ala",
        translation: "I intend to perform the obligatory Maghrib prayer, three rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-isyak",
        title: "Niat Solat Isyak",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-'isha'i arba'a rak'atin ada'an lillahi ta'ala",
        translation: "I intend to perform the obligatory Isyak prayer, four rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-tarawih",
        title: "Niat Solat Tarawih",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-tarawihi rak'ataini lillahi ta'ala",
        translation: "I intend to perform the Sunnah Tarawih prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-witir",
        title: "Niat Solat Witir (1 Rakaat)",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ الْوِتْرِ رَكْعَةً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatal-witri rak'atan lillahi ta'ala",
        translation: "I intend to perform the Sunnah Witir prayer, one rak'ah, for the sake of Allah.",
    },
    {
        id: "niat-dhuha",
        title: "Niat Solat Dhuha",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatadh-dhuha rak'ataini lillahi ta'ala",
        translation: "I intend to perform the Sunnah Dhuha prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-tahajjud",
        title: "Niat Solat Tahajjud",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-tahajjudi rak'ataini lillahi ta'ala",
        translation: "I intend to perform the Sunnah Tahajjud prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-taubat",
        title: "Niat Solat Taubat",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-taubati rak'ataini lillahi ta'ala",
        translation: "I intend to perform the Sunnah Taubat prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-hari-raya-fitri",
        title: "Niat Solat Aidilfitri",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ عِيدِ الْفِطْرِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnata 'idil-fitri rak'ataini lillahi ta'ala",
        translation: "I intend to perform the Sunnah Aidilfitri prayer, two rak'ahs, for the sake of Allah.",
    },
    {
        id: "niat-jenazah",
        title: "Niat Solat Jenazah",
        category: "Niat Solat",
        arabic: "أُصَلِّي عَلَى هَذَا الْمَيِّتِ أَرْبَعَ تَكْبِيرَاتٍ فَرْضَ كِفَايَةٍ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli 'ala hadhal-mayyiti arba'a takbiratin fardha kifayatin lillahi ta'ala",
        translation: "I intend to perform the prayer over this deceased person, four takbirs, fardhu kifayah, for the sake of Allah.",
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

    // --- ZIKIR ---
    {
        id: "zikir-ayat-kursi",
        title: "Ayat Kursi",
        category: "Zikir",
        arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
    },
];
