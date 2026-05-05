// Translation dictionary for the app.
// Default locale is Arabic ("ar"); English ("en") is the secondary toggle.

export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export type Dict = Record<string, string>;

const ar: Dict = {
  // ── Generic actions ──────────────────────────────────────────────────────
  "action.continue": "متابعة",
  "action.start": "ابدأ",
  "action.begin": "ابدأ",
  "action.requesting": "جارٍ الطلب…",
  "action.pause": "إيقاف مؤقت",
  "action.resume": "متابعة",
  "action.skip": "تخطّي",
  "action.restart": "إعادة",
  "action.end": "إنهاء",
  "action.done": "تم",
  "action.close": "إغلاق",
  "action.hide": "إخفاء",
  "action.show": "إظهار",
  "action.about": "تعريف",
  "action.openMushaf": "افتح المصحف",
  "action.continueReading": "متابعة القراءة",
  "action.voiceTrainer": "مدرّب الحفظ",
  "action.startTraining": "ابدأ التدريب",
  "action.startReciting": "ابدأ التلاوة",
  "action.trainAgain": "تدرّب مرة أخرى",
  "action.openInReading": "افتح في وضع القراءة",
  "action.previous": "السابق",
  "action.next": "التالي",
  "action.play": "تشغيل",
  "action.tafsir": "التفسير",
  "action.bookmark": "إشارة مرجعية",
  "action.memorize": "حفظ",
  "action.allSurahs": "كل السور",
  "action.openTrainer": "افتح المدرّب",
  "action.tryInAlFatihah": "جرّب في الفاتحة",
  "action.try": "جرّب →",
  "action.soon": "قريبًا",
  "action.switchToWritten": "تحويل إلى وضع النص المكتوب",
  "action.restartMic": "إعادة تشغيل الميكروفون",
  "action.openInReadingShort": "افتح هذه الآية في وضع القراءة",

  // ── Theme ────────────────────────────────────────────────────────────────
  "theme.light": "فاتح",
  "theme.dark": "داكن",
  "theme.toLight": "التحويل إلى الوضع الفاتح",
  "theme.toDark": "التحويل إلى الوضع الداكن",

  // ── Language toggle ──────────────────────────────────────────────────────
  "lang.toEnglish": "English",
  "lang.toArabic": "العربية",
  "lang.switchTo": "التبديل إلى {name}",

  // ── Navigation ───────────────────────────────────────────────────────────
  "nav.surahs": "السور",
  "nav.mushaf": "المصحف",
  "nav.listen": "الاستماع",
  "nav.hifz": "الحفظ",
  "nav.trainer": "المدرّب",
  "nav.search": "البحث",
  "nav.qiraat": "القراءات",
  "nav.read": "القراءة",
  "nav.train": "التدريب",
  "nav.live": "مباشر",
  "nav.tagline": "اقرأ، استمع، احفظ.",
  "nav.builtWithReverence": "صُنع بخشوع.",

  // ── Home page ────────────────────────────────────────────────────────────
  "home.appAlt": "نور — تطبيق القرآن",
  "home.stat.streak": "تتابع",
  "home.stat.streak.value": "{n} {unit}",
  "home.unit.day": "يوم",
  "home.unit.days": "يومًا",
  "home.stat.memorized": "المحفوظ",
  "home.stat.memorized.value": "{n} آية",
  "home.stat.continue": "متابعة",
  "home.stat.ready": "ابدأ",
  "home.stat.ready.value": "اختر سورة",
  "home.surahs.title": "السور",
  "home.surahs.count": "١١٤ سورة",
  "home.tabs.all": "الكل",
  "home.tabs.meccan": "مكية",
  "home.tabs.medinan": "مدنية",
  "home.tabs.memorizing": "قيد الحفظ",
  "home.search.placeholder": "ابحث بالاسم أو الرقم أو المعنى الإنجليزي…",
  "home.empty": "لا توجد سور مطابقة.",

  // ── Surah card ───────────────────────────────────────────────────────────
  "surah.type.meccan": "مكية",
  "surah.type.medinan": "مدنية",
  "surah.ayahs": "{n} آية",

  // ── Mushaf page ──────────────────────────────────────────────────────────
  "mushaf.crumb.home": "الرئيسية",
  "mushaf.crumb.page": "المصحف · صفحة {n}",
  "mushaf.previousPage": "الصفحة السابقة",
  "mushaf.nextPage": "الصفحة التالية",
  "mushaf.page": "صفحة",
  "mushaf.jumpToSurah": "اذهب إلى سورة…",
  "mushaf.jumpToSurahAria": "الانتقال إلى سورة",
  "mushaf.viewMode": "وضع العرض",
  "mushaf.scanned": "مصوّرة",
  "mushaf.written": "مكتوبة",
  "mushaf.scannedTitle": "مصحف المدينة المصوّر",
  "mushaf.writtenTitle": "نصّ يونيكود مكتوب",
  "mushaf.listenInQiraah": "استمع بهذه القراءة",
  "mushaf.noAudio": "لا توجد تلاوة",
  "mushaf.listenShort": "استمع",
  "mushaf.aboutThisView": "عن هذا العرض",
  "mushaf.about.scannedExplain":
    "استخدم وضع «المصوّرة» لعرض مصحف المدينة الرسمي من مجمع الملك فهد لطباعة المصحف الشريف (انقر للتكبير). أو انتقل إلى وضع «المكتوبة» لنصٍّ قابل للتحديد بصيغة يونيكود — مفيد عند بطء تحميل الصورة.",
  "mushaf.about.diffsExplain":
    "عند اختيار قراءة غير حفص تُلوَّن الكلمات: الأحمر = كلمة أو حروف مختلفة، الأخضر = نفس الحروف بصوت مختلف (مدّ، همز، إمالة، حركة، إدغام، نقل، إظهار). انقر أي تلوين لقراءة الملاحظة.",
  "mushaf.audio.unavailableTitle": "تعذّر تحميل صورة هذه الصفحة.",
  "mushaf.audio.unavailableHint": "قد يكون مزوِّد الصور بطيئًا أو هذه الصفحة غير متوفرة.",
  "mushaf.variants": "متغيّر",
  "mushaf.variantsPlural": "متغيّرات",
  "mushaf.zoom": "تكبير",

  // ── Listen page ──────────────────────────────────────────────────────────
  "listen.title": "الاستماع",
  "listen.arabicTitle": "استمع",
  "listen.description": "تلاوة متواصلة عبر السور بأصوات قُرّاء متعدّدين.",
  "listen.nowPlaying": "يُتلى الآن",
  "listen.ayah": "آية {n}",
  "listen.reciter": "القارئ",
  "listen.reciterAria": "القارئ",
  "listen.pickSurah": "اختر سورة",
  "listen.filterPlaceholder": "تصفية السور…",
  "listen.openInReading": "افتح هذه الآية في وضع القراءة",
  "listen.autoNext": "تشغيل تلقائي",
  "listen.progressAria": "التقدّم",
  "listen.volumeAria": "مستوى الصوت",

  // ── Search page ──────────────────────────────────────────────────────────
  "search.title": "البحث",
  "search.arabicTitle": "بحث",
  "search.description": "ابحث عن أي سورة بالاسم أو أي آية بكلمة عربية أو ترجمة.",
  "search.placeholder": "رحمن  ·  mercy  ·  Al-Baqarah  ·  2:255",
  "search.scope.surah": "سورة",
  "search.scope.ayah": "آية",
  "search.lang.both": "الكل",
  "search.lang.ar": "عربي",
  "search.lang.en": "إنجليزي",
  "search.building": "جارٍ بناء فهرس البحث… {n}%",
  "search.empty.title": "ابحث في ٦٢٣٦ آية و١١٤ اسم سورة.",
  "search.empty.hint": "البحث العربي يتجاهل التشكيل واختلاف الألف تلقائيًا.",
  "search.noMatches": "لا توجد نتائج.",
  "search.surahMeta": "{english} · {n} آية",

  // ── Hifz dashboard ───────────────────────────────────────────────────────
  "hifz.title": "الحفظ",
  "hifz.arabicTitle": "حفظ",
  "hifz.description": "تابع ما حفظته، راجع ما يَفْلِت منك، وابدأ جلسة تدريب صوتي.",
  "hifz.streak.label": "سلسلة الأيام",
  "hifz.streak.best": "الأفضل: {n}",
  "hifz.streak.todayGoal": "هدف اليوم",
  "hifz.streak.todayProgress": "{m} / {goal} دقيقة",
  "hifz.memorized.label": "المحفوظ",
  "hifz.memorized.of": "من {total} آية · {pct}%",
  "hifz.dailyGoal.label": "الهدف اليومي",
  "hifz.dailyGoal.unit": "دقيقة",
  "hifz.dailyGoal.aria": "دقائق الهدف",
  "hifz.inProgress": "قيد الحفظ",
  "hifz.completed": "السور المُكْتَملة",
  "hifz.inProgress.memorizedOf": "{n}/{total} محفوظة",
  "hifz.inProgress.train": "ابدأ تدريبها",
  "hifz.recentSessions": "الجلسات الأخيرة",
  "hifz.noSessions": "لا توجد جلسات بعد. جرّب المدرّب الصوتي.",
  "hifz.cleanFraction": "{correct}/{total} بدون مساعدة",
  "hifz.bookmarks": "الإشارات المرجعية",
  "hifz.noBookmarks": "لا توجد إشارات مرجعية.",
  "hifz.allSurahs": "كل السور",
  "hifz.empty.title": "لا توجد سور قيد الحفظ بعد.",
  "hifz.empty.body":
    "اضغط الدائرة بجانب أي آية لتحديدها كمحفوظة، أو ادخل المدرّب مباشرة.",

  // ── Voice Trainer ────────────────────────────────────────────────────────
  "trainer.title": "مدرّب الحفظ الصوتي",
  "trainer.arabicTitle": "مدرّب الحفظ",
  "trainer.description": "اقرأ من حفظك، وستظهر الكلمات تباعًا كلّما نطقتها صحيحة.",
  "trainer.crumb.hifz": "الحفظ",
  "trainer.support.ok":
    "التعرّف الصوتي مفعَّل. أفضل دقّة على متصفّح Chrome في الكمبيوتر مع سمّاعة برأسية.",
  "trainer.support.unsupported":
    "المتصفّح لا يدعم Web Speech API. جرّب Chrome أو Edge أو Safari لاستخدام المدرّب الصوتي. يمكنك متابعة الحفظ بدون صوت.",
  "trainer.couldNotLoad": "تعذّر تحميل السورة: {msg}",
  "trainer.surah": "السورة",
  "trainer.surahAria": "السورة",
  "trainer.ayahRange": "نطاق الآيات",
  "trainer.ayahsAvailable": "{n} آية متاحة",
  "trainer.hidingStyle": "أسلوب الإخفاء",
  "trainer.hide.blur": "ضباب",
  "trainer.hide.blur.sub": "أسهل · الكلمات ظاهرة لكن مضبَّبة",
  "trainer.hide.dashes": "شرطات",
  "trainer.hide.dashes.sub": "متوسّط · شرطات بطول كلِّ كلمة",
  "trainer.hide.boxes": "صناديق",
  "trainer.hide.boxes.sub": "الأصعب · استرجاع كامل",
  "trainer.strictness": "الدقّة",
  "trainer.strictness.lenient": "متساهل",
  "trainer.strictness.lenient.sub": "يقبل النُطق المتقارب",
  "trainer.strictness.strict": "صارم",
  "trainer.strictness.strict.sub": "يطلب تطابقًا قريبًا من التام",
  "trainer.hint.title": "سياسة التلميح",
  "trainer.hint.desc":
    "إظهار أوّل حرف بعد {a} من السكوت على الكلمة، وكشفها كاملة بعد {b}.",
  "trainer.hint.seconds": "{n} ث",
  "trainer.hint.label": "تلميح: تبدأ بـ",
  "trainer.cursor": "{cursor} / {total}",
  "trainer.live.listening": "ينصِت",
  "trainer.live.idle": "متوقّف",
  "trainer.live.recognized": "{n} {label} مُتعرّف عليها",
  "trainer.live.phrase": "عبارة",
  "trainer.live.phrases": "عبارات",
  "trainer.live.placeholder":
    "اقرأ بصوت مرتفع — ستظهر الكلمات هنا ثم تنكشف على الصفحة بالأسفل.",
  "trainer.notSupported":
    "التعرّف الصوتي غير متاح في هذا المتصفّح. على الـ iPhone افتح هذه الصفحة في Safari (iOS 14.5 وأحدث)، وعلى Android استخدم Chrome. يمكنك استخدام متابعة الحفظ بدون ميكروفون.",
  "trainer.beginHint":
    "اضغط «ابدأ» في الأعلى واسمح بالميكروفون لتبدأ التلاوة. سيطلب المتصفّح الإذن مرّة واحدة على الهاتف — وافِق وسوف تبدأ التلاوة.",
  "trainer.permissionDenied":
    "تم منع الميكروفون. اضغط أيقونة القفل في شريط العنوان (أو إعدادات المتصفّح في الهاتف) وأعد تفعيل الميكروفون لهذا الموقع، ثم اضغط «ابدأ» مرة أخرى.",
  "trainer.speechError": "خطأ في التعرّف الصوتي: {err}. جرّب إيقاف/استئناف.",
  "trainer.ayatRange": "الآيات {from}–{to}",
  "trainer.skipWord": "تخطّي الكلمة",
  "trainer.restartAyah": "إعادة الآية",
  "trainer.endSession": "إنهاء الجلسة",
  "trainer.beginRecit": "ابدأ التلاوة",
  "trainer.sessionDone": "اكتملت الجلسة · ما شاء الله",

  // ── Session report ───────────────────────────────────────────────────────
  "report.complete": "اكتملت الجلسة",
  "report.accuracyOn": "دقّة على {surah} {from}–{to}",
  "report.firstTry": "أوّل مرة",
  "report.afterHint": "بعد التلميح",
  "report.skipped": "تُخُطِّيَت",
  "report.revealed": "مكشوفة",
  "report.suggestNext": "الجلسة المقترحة التالية",
  "report.suggestBody": "أعد الآيات الـ{n} التي تعثّرت فيها أكثر:",
  "report.struggleAyah": "الآية {n} · {pct}%",

  // ── Tafsir ───────────────────────────────────────────────────────────────
  "tafsir.title": "التفسير",
  "tafsir.unavailable": "التفسير غير متوفر لهذه الآية.",

  // ── Reading controls ────────────────────────────────────────────────────
  "reading.arabicSize": "حجم النص العربي",
  "reading.translation": "الترجمة",
  "reading.tafsir": "التفسير",
  "reading.reciter": "القارئ",
  "reading.playWhole": "تشغيل السورة كاملة",
  "reading.fontSizeAria": "حجم الخط العربي",

  // ── Qira'at picker ───────────────────────────────────────────────────────
  "qiraatPicker.choose": "اختر قراءة",
  "qiraatPicker.tier.verified": "موثَّقة",
  "qiraatPicker.tier.soon": "قريبًا",
  "qiraatPicker.tier.future": "روايات قادمة",
  "qiraatPicker.diff": "{n} اختلاف",

  // ── Qiraat page ──────────────────────────────────────────────────────────
  "qiraat.title": "القراءات العشر",
  "qiraat.arabicTitle": "القراءات العشر",
  "qiraat.description":
    "القراءات العشر المتواترة للقرآن الكريم، يَنقُل كلًّا منها راويان موثوقان.",
  "qiraat.tabs.about": "تعريف",
  "qiraat.tabs.imams": "الأئمّة العشرة",
  "qiraat.tabs.madd": "الصوت والمدّ",
  "qiraat.tabs.differences": "جرّب رواية",
  "qiraat.about.heading": "قرآنٌ واحد، أصواتٌ متعدّدة",
  "qiraat.about.body1":
    "أُنزل القرآن على سبعة أحرف تيسيرًا لحفظه على قبائل العرب. ومنها برزت القراءات الكَنَسيّة: عشر قراءات صحيحة متواترة، حُفظت بأسانيد متّصلة بالنبيّ ﷺ.",
  "qiraat.about.body2":
    "رواية حفص عن عاصم هي الأشهر اليوم، إلا أنّ كلّ قراءة من العشر صحيحة. والاختلافات في الغالب لطيفة — حركة أو حرف أو شدّة — ولا تُغيّر المعنى تقريبًا.",
  "qiraat.about.qarisCount.title": "١٠ قُرّاء",
  "qiraat.about.qarisCount.body": "عشرة أئمّة كبار صارت قراءاتهم هي العشر المتواترة.",
  "qiraat.about.ruwah.title": "٢٠ راويًا",
  "qiraat.about.ruwah.body": "لكلّ قارئ راويان موثوقان من تلامذته.",
  "qiraat.about.subtle.title": "اختلافات لطيفة",
  "qiraat.about.subtle.body": "في الغالب حركات وتغييرات حرفية يسيرة — لا في المعنى.",
  "qiraat.diff.intro":
    "اختر رواية في الأسفل، ثم افتح أي سورة — ستُلوَّن الكلمات المختلفة عن حفص بالأحمر الخافت. انقر الكلمة الملوَّنة لرؤية المتغيّر ونوعه.",

  // ── Bismillah & headers ──────────────────────────────────────────────────
  "common.tafsirOf": "التفسير {s}:{a}",

  // ── Toaster messages ─────────────────────────────────────────────────────
  "toast.unmarked": "أُلغي تحديد {s}:{a}",
  "toast.memorized": "محفوظ {s}:{a} ✓",

  // ── Mushaf chip ──────────────────────────────────────────────────────────
  "ayah.label": "آية",
  "ayah.aria": "آية {n}",

  // ── Mic indicator ────────────────────────────────────────────────────────
  "mic.listening": "ينصِت…",
  "mic.idle": "متوقّف",

  // ── Diff panel ───────────────────────────────────────────────────────────
  "diff.banner.compare": "مقارنة",
  "diff.banner.between": "حفص ↔ {name}",
  "diff.banner.words": "{n} كلمة",
  "diff.banner.audio": "{n} صوتية",
  "diff.banner.onPage": "في هذه الصفحة",
  "diff.surahAyah": "سورة {s} · آية {a}",
  "diff.variants": "{n} متغيّر",
  "diff.legend":
    "كلمة = نصّ مختلف؛ صوت = نفس الحروف بصوت مختلف (مدّ، همز، إمالة، نقل). انقر للحصول على الملاحظة.",
  "diff.hafs": "حفص",
  "diff.audio": "صوت",
  "diff.variant": "متغيّر",
  "diff.wordHash": "كلمة #{n}",
  "diff.audibleHint":
    "تُسمع في التلاوة — نفس الحروف على الصفحة، صوت أو طول مختلف.",
  "diff.noVariants":
    "لا توجد اختلافات موثَّقة لهذه الصفحة في بياناتنا لرواية {name}. تصفّح صفحات أخرى لرؤية المقارنات.",

  // ── Diff types ───────────────────────────────────────────────────────────
  "diffType.harakah": "تغيُّر حركة",
  "diffType.imalah": "إمالة · ميلان الصوت",
  "diffType.idgham": "إدغام",
  "diffType.izhar": "إظهار",
  "diffType.hamz": "همز · تخفيف أو مدّ",
  "diffType.naql": "نقل · نقل الحركة",
  "diffType.madd": "مدّ · إطالة",
  "diffType.word": "كلمة مختلفة",
  "diffType.other": "متغيّر آخر",

  // ── Qira'at audio player ─────────────────────────────────────────────────
  "qaPlayer.listening": "استماع · {name}",
  "qaPlayer.noAudio": "لا توجد تلاوة منشورة لهذه القراءة بعد. قريبًا.",
  "qaPlayer.reciter": "القارئ",
  "qaPlayer.ayahOnPage": "آية على هذه الصفحة",
  "qaPlayer.ayahFraction": "({i} / {total})",
  "qaPlayer.surahLine": "سورة {n}",
  "qaPlayer.fromStart": "(تشغيل من بداية السورة)",
  "qaPlayer.error":
    "تعذّر تحميل الصوت. قد يكون المزوّد بطيئًا أو هذه الرواية لا تحتوي تسجيلًا لهذه السورة.",

  // ── Diff overlay ─────────────────────────────────────────────────────────
  "overlay.hafs": "حفص",
  "overlay.audio": "صوت",
  "overlay.variant": "متغيّر",
  "overlay.surahAyah": "سورة {s} · آية {a}",
  "overlay.noAudioYet": "لا تلاوة بعد",
  "overlay.useMainPlayer": "استخدم مشغّل الاستماع الرئيسي",
  "overlay.playIn": "تشغيل بصوت {name}",

  // ── Madd comparison ──────────────────────────────────────────────────────
  "madd.heading": "ما تسمعه ولا تراه على الصفحة",
  "madd.section.audible": "اختلافات مسموعة",
  "madd.body1Pre": "أكبر اختلافات بين ",
  "madd.body1Mid": " و",
  "madd.body1Post":
    " ليست في الكلمات المكتوبة، بل في كم تُمدّ الحروف. وتُعرف هذه بـ«المدود». الحركة الواحدة هي مقدار حركة الحرف القصير، والمدّ يطيل الصوت بمقدار عدّة حركات.",
  "madd.body2":
    "الحروف نفسها في الرسم بين القراءتين، لكن قراءة ورش لنفس الصفحة تستغرق وقتًا أطول من قراءة حفص — ذلك هو أثر المدّ.",
  "madd.examples": "أمثلة",
  "madd.other": "خصائص صوتية أخرى",
  "madd.footer":
    "الأزمنة المعروضة هي للأشهر طريقةً في دروس التجويد (ورش من طريق الأزرق، وحفص من طريق الشاطبيّة). يجوز في طرق أخرى مدّةً مختلفة؛ ارجع إلى مُعلِّم مُجاز (سند) لمعرفة التفاصيل.",

  // ── Mushaf-page misc ─────────────────────────────────────────────────────
  "mushaf.surahHeader": "سورة {n}",
};

const en: Dict = {
  // ── Generic actions ──────────────────────────────────────────────────────
  "action.continue": "Continue",
  "action.start": "Start",
  "action.begin": "Begin",
  "action.requesting": "Requesting…",
  "action.pause": "Pause",
  "action.resume": "Resume",
  "action.skip": "Skip",
  "action.restart": "Restart",
  "action.end": "End",
  "action.done": "Done",
  "action.close": "Close",
  "action.hide": "Hide",
  "action.show": "Show",
  "action.about": "About",
  "action.openMushaf": "Open Mushaf",
  "action.continueReading": "Continue Reading",
  "action.voiceTrainer": "Voice Trainer",
  "action.startTraining": "Start Training",
  "action.startReciting": "Start Reciting",
  "action.trainAgain": "Train again",
  "action.openInReading": "Open in reading view",
  "action.previous": "Previous",
  "action.next": "Next",
  "action.play": "Play",
  "action.tafsir": "Tafsir",
  "action.bookmark": "Bookmark",
  "action.memorize": "Memorize",
  "action.allSurahs": "All Surahs",
  "action.openTrainer": "Open Trainer",
  "action.tryInAlFatihah": "Try in Al-Fatihah",
  "action.try": "try →",
  "action.soon": "soon",
  "action.switchToWritten": "Switch to written text view",
  "action.restartMic": "Restart mic",
  "action.openInReadingShort": "Open this ayah in reading view",

  // ── Theme ────────────────────────────────────────────────────────────────
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",

  // ── Language toggle ──────────────────────────────────────────────────────
  "lang.toEnglish": "English",
  "lang.toArabic": "العربية",
  "lang.switchTo": "Switch to {name}",

  // ── Navigation ───────────────────────────────────────────────────────────
  "nav.surahs": "Surahs",
  "nav.mushaf": "Mushaf",
  "nav.listen": "Listen",
  "nav.hifz": "Hifz",
  "nav.trainer": "Trainer",
  "nav.search": "Search",
  "nav.qiraat": "Qira'āt",
  "nav.read": "Read",
  "nav.train": "Train",
  "nav.live": "live",
  "nav.tagline": "Recite, listen, memorize.",
  "nav.builtWithReverence": "Built with reverence.",

  // ── Home page ────────────────────────────────────────────────────────────
  "home.appAlt": "Noor — Quran app",
  "home.stat.streak": "Streak",
  "home.stat.streak.value": "{n} {unit}",
  "home.unit.day": "day",
  "home.unit.days": "days",
  "home.stat.memorized": "Memorized",
  "home.stat.memorized.value": "{n} ayāt",
  "home.stat.continue": "Continue",
  "home.stat.ready": "Ready",
  "home.stat.ready.value": "Pick a surah",
  "home.surahs.title": "Surahs",
  "home.surahs.count": "114 chapters",
  "home.tabs.all": "All",
  "home.tabs.meccan": "Meccan",
  "home.tabs.medinan": "Medinan",
  "home.tabs.memorizing": "Memorizing",
  "home.search.placeholder": "Search by name, number, or English meaning…",
  "home.empty": "No surahs match that.",

  // ── Surah card ───────────────────────────────────────────────────────────
  "surah.type.meccan": "meccan",
  "surah.type.medinan": "medinan",
  "surah.ayahs": "{n} ayāt",

  // ── Mushaf page ──────────────────────────────────────────────────────────
  "mushaf.crumb.home": "Home",
  "mushaf.crumb.page": "Mushaf · Page {n}",
  "mushaf.previousPage": "Previous page",
  "mushaf.nextPage": "Next page",
  "mushaf.page": "Page",
  "mushaf.jumpToSurah": "Jump to surah…",
  "mushaf.jumpToSurahAria": "Jump to surah",
  "mushaf.viewMode": "Page view mode",
  "mushaf.scanned": "Scanned",
  "mushaf.written": "Written",
  "mushaf.scannedTitle": "Scanned King Fahd Mushaf",
  "mushaf.writtenTitle": "Written Unicode text",
  "mushaf.listenInQiraah": "Listen in this Qirā'ah",
  "mushaf.noAudio": "No audio",
  "mushaf.listenShort": "Listen",
  "mushaf.aboutThisView": "About this view",
  "mushaf.about.scannedExplain":
    "Use the Scanned view for the official Mushaf al-Madinah from the King Fahd Quran Printing Complex (tap to zoom). Switch to Written for selectable Unicode text — useful when the scanned page loads slowly.",
  "mushaf.about.diffsExplain":
    "With a non-Hafs Qirā'ah selected, words are highlighted: red = different word/letters, green = same letters but different sound (madd, hamzah, imālah, vowel-mark, idghām, naql, iẓhār). Tap any highlight for the full note.",
  "mushaf.audio.unavailableTitle": "Could not load this page image.",
  "mushaf.audio.unavailableHint": "The mushaf image CDN may be slow or missing this page.",
  "mushaf.variants": "variant",
  "mushaf.variantsPlural": "variants",
  "mushaf.zoom": "Zoom",

  // ── Listen page ──────────────────────────────────────────────────────────
  "listen.title": "Listen",
  "listen.arabicTitle": "استمع",
  "listen.description": "Continuous recitation across surahs with multiple reciters.",
  "listen.nowPlaying": "Now playing",
  "listen.ayah": "Ayah {n}",
  "listen.reciter": "Reciter",
  "listen.reciterAria": "Reciter",
  "listen.pickSurah": "Pick a surah",
  "listen.filterPlaceholder": "Filter surahs…",
  "listen.openInReading": "Open this ayah in reading view",
  "listen.autoNext": "Auto-next",
  "listen.progressAria": "Progress",
  "listen.volumeAria": "Volume",

  // ── Search page ──────────────────────────────────────────────────────────
  "search.title": "Search",
  "search.arabicTitle": "بحث",
  "search.description": "Find any surah by name or any ayah by Arabic word or translation.",
  "search.placeholder": "رحمن  ·  mercy  ·  Al-Baqarah  ·  2:255",
  "search.scope.surah": "Surah",
  "search.scope.ayah": "Ayah",
  "search.lang.both": "Both",
  "search.lang.ar": "AR",
  "search.lang.en": "EN",
  "search.building": "Building search index… {n}%",
  "search.empty.title": "Search across 6,236 ayāt and 114 surah names.",
  "search.empty.hint": "Arabic search ignores tashkeel and alif variants automatically.",
  "search.noMatches": "No matches.",
  "search.surahMeta": "{english} · {n} ayāt",

  // ── Hifz dashboard ───────────────────────────────────────────────────────
  "hifz.title": "Hifz",
  "hifz.arabicTitle": "حفظ",
  "hifz.description":
    "Track what you've memorized, review what slips, and start a voice training session.",
  "hifz.streak.label": "Daily Streak",
  "hifz.streak.best": "Best: {n}",
  "hifz.streak.todayGoal": "Today's goal",
  "hifz.streak.todayProgress": "{m} / {goal} min",
  "hifz.memorized.label": "Memorized",
  "hifz.memorized.of": "of {total} ayāt · {pct}%",
  "hifz.dailyGoal.label": "Daily Goal",
  "hifz.dailyGoal.unit": "min",
  "hifz.dailyGoal.aria": "Goal minutes",
  "hifz.inProgress": "In progress",
  "hifz.completed": "Completed surahs",
  "hifz.inProgress.memorizedOf": "{n}/{total} memorized",
  "hifz.inProgress.train": "Train this",
  "hifz.recentSessions": "Recent sessions",
  "hifz.noSessions": "No sessions yet. Try the voice trainer.",
  "hifz.cleanFraction": "{correct}/{total} clean",
  "hifz.bookmarks": "Bookmarks",
  "hifz.noBookmarks": "No bookmarks yet.",
  "hifz.allSurahs": "All surahs",
  "hifz.empty.title": "No surahs in progress yet.",
  "hifz.empty.body":
    "Tap the circle next to any ayah to mark it memorized, or jump straight into the trainer.",

  // ── Voice Trainer ────────────────────────────────────────────────────────
  "trainer.title": "Voice Trainer",
  "trainer.arabicTitle": "مدرّب الحفظ",
  "trainer.description": "Recite from memory. Words appear as you say them correctly.",
  "trainer.crumb.hifz": "Hifz",
  "trainer.support.ok":
    "Microphone-driven recognition is enabled. Best accuracy in Chrome desktop with a headset.",
  "trainer.support.unsupported":
    "Your browser doesn't support the Web Speech API. Try Chrome, Edge, or Safari for the voice trainer. You can still use Hifz without voice.",
  "trainer.couldNotLoad": "Could not load surah: {msg}",
  "trainer.surah": "Surah",
  "trainer.surahAria": "Surah",
  "trainer.ayahRange": "Ayah range",
  "trainer.ayahsAvailable": "{n} ayāt available",
  "trainer.hidingStyle": "Hiding style",
  "trainer.hide.blur": "Blur",
  "trainer.hide.blur.sub": "Easier · words visible but heavily blurred",
  "trainer.hide.dashes": "Dashes",
  "trainer.hide.dashes.sub": "Medium · placeholders sized like real words",
  "trainer.hide.boxes": "Boxes",
  "trainer.hide.boxes.sub": "Hardest · pure recall",
  "trainer.strictness": "Strictness",
  "trainer.strictness.lenient": "Lenient",
  "trainer.strictness.lenient.sub": "Accepts close pronunciations",
  "trainer.strictness.strict": "Strict",
  "trainer.strictness.strict.sub": "Requires near-exact match",
  "trainer.hint.title": "Hint policy",
  "trainer.hint.desc":
    "Show first letter after {a} of silence on a word, full hint after {b}.",
  "trainer.hint.seconds": "{n}s",
  "trainer.hint.label": "Hint: starts with",
  "trainer.cursor": "{cursor} / {total}",
  "trainer.live.listening": "Listening",
  "trainer.live.idle": "Idle",
  "trainer.live.recognized": "{n} {label} recognized",
  "trainer.live.phrase": "phrase",
  "trainer.live.phrases": "phrases",
  "trainer.live.placeholder":
    "Recite aloud — the words you say will appear here, then reveal on the page below.",
  "trainer.notSupported":
    "Voice recognition isn't available in this browser. On iPhone, open this page in Safari (iOS 14.5+); on Android, use Chrome. Otherwise the Hifz tracker still works without a mic.",
  "trainer.beginHint":
    "Tap Begin above and allow microphone access to start. On phones the browser will ask for mic permission once — accept, and recitation will begin.",
  "trainer.permissionDenied":
    "Microphone access was blocked. Tap the lock icon in your browser's address bar (or your phone's site settings) and re-enable the mic for this site, then tap Begin again.",
  "trainer.speechError": "Speech error: {err}. Try toggling pause/resume.",
  "trainer.ayatRange": "Ayāt {from}–{to}",
  "trainer.skipWord": "Skip word",
  "trainer.restartAyah": "Restart ayah",
  "trainer.endSession": "End session",
  "trainer.beginRecit": "Begin reciting",
  "trainer.sessionDone": "Session complete · Mā shā Allāh",

  // ── Session report ───────────────────────────────────────────────────────
  "report.complete": "Session Complete",
  "report.accuracyOn": "accuracy on {surah} {from}–{to}",
  "report.firstTry": "First try",
  "report.afterHint": "After hint",
  "report.skipped": "Skipped",
  "report.revealed": "Revealed",
  "report.suggestNext": "Suggested next session",
  "report.suggestBody": "Replay the {n} ayāt where you struggled most:",
  "report.struggleAyah": "Ayah {n} · {pct}%",

  // ── Tafsir ───────────────────────────────────────────────────────────────
  "tafsir.title": "Tafsir",
  "tafsir.unavailable": "Tafsir not available for this ayah.",

  // ── Reading controls ────────────────────────────────────────────────────
  "reading.arabicSize": "Arabic size",
  "reading.translation": "Translation",
  "reading.tafsir": "Tafsir",
  "reading.reciter": "Reciter",
  "reading.playWhole": "Play whole surah",
  "reading.fontSizeAria": "Arabic font size",

  // ── Qira'at picker ───────────────────────────────────────────────────────
  "qiraatPicker.choose": "Choose a Qira'ah",
  "qiraatPicker.tier.verified": "Verified",
  "qiraatPicker.tier.soon": "Coming soon",
  "qiraatPicker.tier.future": "Future readings",
  "qiraatPicker.diff": "{n} diff",

  // ── Qiraat page ──────────────────────────────────────────────────────────
  "qiraat.title": "The Ten Qira'āt",
  "qiraat.arabicTitle": "القراءات العشر",
  "qiraat.description":
    "The ten canonical readings of the Qur'ān, each transmitted through two reliable transmitters (ruwāh).",
  "qiraat.tabs.about": "About",
  "qiraat.tabs.imams": "Ten Imāms",
  "qiraat.tabs.madd": "Sound & Madd",
  "qiraat.tabs.differences": "Try a Riwāyah",
  "qiraat.about.heading": "A single Qur'ān, multiple voices",
  "qiraat.about.body1":
    "The Qur'ān was revealed in seven aḥruf — modes of recitation — to ease its memorization across the Arabian tribes. From these emerged the canonical qira'āt: ten authentic, mass-transmitted (mutawātir) readings, each preserved through chains of certified reciters going back to the Prophet ﷺ.",
  "qiraat.about.body2":
    "Hafs 'an 'Āṣim is the most widely printed today, but every other reading is equally valid. Differences are generally subtle — a vowel, a letter, a tashdīd — and almost never change meaning.",
  "qiraat.about.qarisCount.title": "10 Qarīs",
  "qiraat.about.qarisCount.body": "Ten major imāms whose readings became the canonical ten.",
  "qiraat.about.ruwah.title": "20 Ruwāh",
  "qiraat.about.ruwah.body": "Each qarī is transmitted through two reliable students.",
  "qiraat.about.subtle.title": "Subtle Differences",
  "qiraat.about.subtle.body": "Mostly vowels and minor letter shifts — never the message.",
  "qiraat.diff.intro":
    "Pick a Riwāyah below, then open any surah — words that differ from Hafs will be highlighted in faint red. Tap a highlighted word to see the variant and its type.",

  // ── Bismillah & headers ──────────────────────────────────────────────────
  "common.tafsirOf": "Tafsir {s}:{a}",

  // ── Toaster messages ─────────────────────────────────────────────────────
  "toast.unmarked": "Unmarked {s}:{a}",
  "toast.memorized": "Memorized {s}:{a} ✓",

  // ── Mushaf chip ──────────────────────────────────────────────────────────
  "ayah.label": "Ayah",
  "ayah.aria": "Ayah {n}",

  // ── Mic indicator ────────────────────────────────────────────────────────
  "mic.listening": "Listening…",
  "mic.idle": "Idle",

  // ── Diff panel ───────────────────────────────────────────────────────────
  "diff.banner.compare": "Comparing",
  "diff.banner.between": "Hafs ↔ {name}",
  "diff.banner.words": "{n} word{s}",
  "diff.banner.audio": "{n} audio",
  "diff.banner.onPage": "on this page",
  "diff.surahAyah": "Surah {s} · Ayah {a}",
  "diff.variants": "{n} variant{s}",
  "diff.legend":
    "word = different text; audio = same letters, different sound (madd, hamzah, imālah, naql). Tap any for the full note.",
  "diff.hafs": "Hafs",
  "diff.audio": "Audio",
  "diff.variant": "Variant",
  "diff.wordHash": "word #{n}",
  "diff.audibleHint":
    "Heard in recitation — same letters on the page, different sound or length.",
  "diff.noVariants":
    "No verified differences on this page in our dataset for {name}. Browse to other pages to see comparisons.",

  // ── Diff types ───────────────────────────────────────────────────────────
  "diffType.harakah": "Vowel change",
  "diffType.imalah": "Imālah · sound tilt",
  "diffType.idgham": "Idghām · merger",
  "diffType.izhar": "Iẓhār · clear pronunciation",
  "diffType.hamz": "Hamzah · softened/extended",
  "diffType.naql": "Naql · transferred ḥarakah",
  "diffType.madd": "Madd · longer elongation",
  "diffType.word": "Different word",
  "diffType.other": "Other variant",

  // ── Qira'at audio player ─────────────────────────────────────────────────
  "qaPlayer.listening": "Listening · {name}",
  "qaPlayer.noAudio": "No public recording is yet available for this Qirā'ah. Coming soon.",
  "qaPlayer.reciter": "Reciter",
  "qaPlayer.ayahOnPage": "Ayah on this page",
  "qaPlayer.ayahFraction": "({i} / {total})",
  "qaPlayer.surahLine": "Surah {n}",
  "qaPlayer.fromStart": "(plays from start of surah)",
  "qaPlayer.error":
    "Audio could not load. The CDN may be slow or this Riwāyah may not have this surah recorded.",

  // ── Diff overlay ─────────────────────────────────────────────────────────
  "overlay.hafs": "Hafs",
  "overlay.audio": "Audio",
  "overlay.variant": "Variant",
  "overlay.surahAyah": "Surah {s} · Ayah {a}",
  "overlay.noAudioYet": "No audio yet",
  "overlay.useMainPlayer": "Use main Listen player",
  "overlay.playIn": "Play in {name}",

  // ── Madd comparison ──────────────────────────────────────────────────────
  "madd.heading": "What you hear that the page can't show",
  "madd.section.audible": "Audible differences",
  "madd.body1Pre": "The biggest differences between ",
  "madd.body1Mid": " and ",
  "madd.body1Post":
    " are not changes to the written word — they are changes to how long a letter is held. These are called al-mudūd (\"the elongations\"). One ḥarakah is the duration of one short vowel; a madd stretches a long vowel across multiple ḥarakāt.",
  "madd.body2":
    "The mushaf shows the same letters in both readings, but a Warsh recitation of the same page takes noticeably longer than a Hafs one — that's madd at work.",
  "madd.examples": "Examples",
  "madd.other": "Other audible features",
  "madd.footer":
    "Standard timings shown are for the most common ṭarīq taught in tajwīd lessons (Warsh from ṭarīq al-Azraq, Hafs from ṭarīq ash-Shāṭibiyyah). Other ṭuruq permit additional values; consult a qualified teacher (sanad) for specifics.",

  // ── Mushaf-page misc ─────────────────────────────────────────────────────
  "mushaf.surahHeader": "Surah {n}",
};

const dicts: Record<Locale, Dict> = { ar, en };

export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const tpl = dicts[locale]?.[key] ?? dicts.en[key] ?? key;
  if (!params) return tpl;
  return tpl.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k];
    return v === undefined || v === null ? "" : String(v);
  });
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
