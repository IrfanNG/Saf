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
        translation: "Ya Allah, berkatilah rezeki yang Engkau berikan kepada kami dan jauhkanlah kami dari azab api neraka.",
    },
    {
        id: "doa-setelah-makan",
        title: "Doa Setelah Makan",
        category: "Doa Harian",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
        translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang Muslim.",
    },
    {
        id: "doa-tidur",
        title: "Doa Sebelum Tidur",
        category: "Doa Harian",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    },
    {
        id: "doa-bangun-tidur",
        title: "Doa Bangun Tidur",
        category: "Doa Harian",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur",
        translation: "Segala puji bagi Allah yang menghidupkan kami selepas mematikan kami dan kepada-Nya kami akan dikembalikan.",
    },
    {
        id: "doa-ibu-bapa",
        title: "Doa Ibu Bapa",
        category: "Doa Harian",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira",
        translation: "Wahai Tuhanku, ampunilah dosaku dan dosa kedua ibu bapaku, dan kasihanilah mereka sebagaimana mereka mendidikku semasa kecil.",
    },

    // --- DOA RAMADAN ---
    {
        id: "doa-niat-puasa",
        title: "Niat Puasa Ramadan",
        category: "Doa Ramadan",
        arabic: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        transliteration: "Nawaitu sauma ghadin 'an ada'i fardi shahri Ramadhana hadhihis-sanati lillahi ta'ala",
        translation: "Sahaja aku berpuasa esok hari untuk menunaikan fardu bulan Ramadan tahun ini kerana Allah Ta'ala.",
    },
    {
        id: "doa-berbuka-sahih",
        title: "Doa Berbuka (Sahih)",
        category: "Doa Ramadan",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba az-zama'u wabtallati al-'uruqu wa thabata al-ajru in sha' Allah",
        translation: "Telah hilang dahaga, telah basah urat-urat dan telah tetap pahala, insya-Allah.",
    },
    {
        id: "doa-lailatul-qadar",
        title: "Doa Lailatul Qadar",
        category: "Doa Ramadan",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        translation: "Ya Allah, sesungguhnya Engkau Maha Pengampun dan amat suka mengampun, maka ampunilah aku.",
    },

    // --- DOA SELEPAS SOLAT ---
    {
        id: "doa-selepas-solat-1",
        title: "Doa Selepas Solat (Asas)",
        category: "Doa Selepas Solat",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ. يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ",
        transliteration: "Alhamdulillahi rabbil 'alamin...",
        translation: "Segala puji bagi Allah Tuhan sekalian alam... Wahai Tuhan kami, bagi-Mu segala puji sebagaimana yang layak dengan kemuliaan Zat-Mu dan keagungan kekuasaan-Mu...",
    },

    // --- NIAT SOLAT ---
    {
        id: "niat-subuh",
        title: "Niat Solat Subuh",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhas-subhi rak'ataini ada'an lillahi ta'ala",
        translation: "Sahaja aku solat fardu Subuh dua rakaat tunai kerana Allah Ta'ala.",
    },
    {
        id: "niat-zohor",
        title: "Niat Solat Zohor",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhaz-zuhri arba'a rak'atin ada'an lillahi ta'ala",
        translation: "Sahaja aku solat fardu Zohor empat rakaat tunai kerana Allah Ta'ala.",
    },
    {
        id: "niat-asar",
        title: "Niat Solat Asar",
        category: "Niat Solat",
        arabic: "أُصَلِّي fَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-'asri arba'a rak'atin ada'an lillahi ta'ala",
        translation: "Sahaja aku solat fardu Asar empat rakaat tunai kerana Allah Ta'ala.",
    },
    {
        id: "niat-maghrib",
        title: "Niat Solat Maghrib",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-maghribi thalatha rak'atin ada'an lillahi ta'ala",
        translation: "Sahaja aku solat fardu Maghrib tiga rakaat tunai kerana Allah Ta'ala.",
    },
    {
        id: "niat-isyak",
        title: "Niat Solat Isyak",
        category: "Niat Solat",
        arabic: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli fardhal-'isha'i arba'a rak'atin ada'an lillahi ta'ala",
        translation: "Sahaja aku solat fardu Isyak empat rakaat tunai kerana Allah Ta'ala.",
    },
    {
        id: "niat-tarawih",
        title: "Niat Solat Tarawih",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-tarawihi rak'ataini lillahi ta'ala",
        translation: "Sahaja aku solat sunat Tarawih dua rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-witir",
        title: "Niat Solat Witir (1 Rakaat)",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ الْوِتْرِ رَكْعَةً لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatal-witri rak'atan lillahi ta'ala",
        translation: "Sahaja aku solat sunat Witir satu rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-dhuha",
        title: "Niat Solat Dhuha",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatadh-dhuha rak'ataini lillahi ta'ala",
        translation: "Sahaja aku solat sunat Dhuha dua rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-tahajjud",
        title: "Niat Solat Tahajjud",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-tahajjudi rak'ataini lillahi ta'ala",
        translation: "Sahaja aku solat sunat Tahajjud dua rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-taubat",
        title: "Niat Solat Taubat",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnatat-taubati rak'ataini lillahi ta'ala",
        translation: "Sahaja aku solat sunat Taubat dua rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-hari-raya-fitri",
        title: "Niat Solat Aidilfitri",
        category: "Niat Solat",
        arabic: "أُصَلِّي سُنَّةَ عِيدِ الْفِطْرِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli sunnata 'idil-fitri rak'ataini lillahi ta'ala",
        translation: "Sahaja aku solat sunat Aidilfitri dua rakaat kerana Allah Ta'ala.",
    },
    {
        id: "niat-jenazah",
        title: "Niat Solat Jenazah",
        category: "Niat Solat",
        arabic: "أُصَلِّي عَلَى هَذَا الْمَيِّتِ أَرْبَعَ تَكْبِيرَاتٍ فَرْضَ كِفَايَةٍ لِلَّهِ تَعَالَى",
        transliteration: "Ushalli 'ala hadhal-mayyiti arba'a takbiratin fardha kifayatin lillahi ta'ala",
        translation: "Sahaja aku solat ke atas mayat ini empat takbir fardu kifayah kerana Allah Ta'ala.",
    },

    // --- KESEJAHTERAAN ---
    {
        id: "doa-murah-rezeki",
        title: "Doa Murah Rezeki",
        category: "Kesejahteraan",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",
        transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbalan",
        translation: "Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik dan amal yang diterima.",
    },
    {
        id: "doa-penerang-hati",
        title: "Doa Penerang Hati",
        category: "Kesejahteraan",
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        transliteration: "Rabbish-rahli sadri wa yassirli amri wahlul 'uqdatan min lisani yafqahu qauli",
        translation: "Wahai Tuhanku, lapangkanlah bagiku dadaku, dan mudahkanlah bagiku tugasku, dan lepaskanlah simpulan dari lidahku, supaya mereka faham perkataanku.",
    },

    // --- ZIKIR ---
    {
        id: "zikir-ayat-kursi",
        title: "Ayat Kursi",
        category: "Zikir",
        arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهما وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
        translation: "Allah, tiada Tuhan melainkan Dia, Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi...",
    },
    {
        id: "zikir-pagi-1",
        title: "Zikir Pagi (Tasbih)",
        category: "Zikir",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        transliteration: "Subhanallahi wa bihamdih, subhanallahil 'azim",
        translation: "Maha Suci Allah dan segala puji bagi-Nya, Maha Suci Allah yang Maha Agung.",
    },
];
