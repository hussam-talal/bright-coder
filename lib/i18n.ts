import { I18nManager } from 'react-native'; // استيراد I18nManager
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import * as Updates from 'expo-updates'; 

const resources = {
  en: {
    translation: {
      Welcome: "Welcome",
      Profile: "Profile",
      Notifications: "Notifications",
      Home: "Home",
      Settings: "Settings",
      Dashboard: "Dashboard",
      Classes: "Classes",
      Messages: "Messages",
      Games: "Games",
      Tutorials: "Tutorials",
      Progress: "Progress",
      Lessons: "Lessons",
      Activities: "Activities",
      Control: "Control",
    },
  },
  ar: {
    translation: {
      Welcome: "مرحبًا",
      Profile: "الملف الشخصي",
      Notifications: "الإشعارات",
      Home: "الرئيسية",
      Settings: "الإعدادات",
      Dashboard: "لوحة القيادة",
      Classes: "الفصول",
      Messages: "الرسائل",
      Games: "الألعاب",
      Tutorials: "الدروس",
      Progress: "التقدم",
      Lessons: "الدروس",
      Activities: "الأنشطة",
      Control: "التحكم",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// وظيفة لتغيير اللغة وضبط الاتجاه
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language); 
  const isRTL = language === 'ar'; 

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL); 
    Updates.reloadAsync();
}
};

export default i18n;
