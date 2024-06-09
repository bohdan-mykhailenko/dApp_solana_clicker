import Link from "next/link";
import { Trans as Translation } from "react-i18next/TransWithoutContext";

import { applicationLanguages, useTranslationServer } from "@repo/ui/i18n";

interface LanguageSwitcherProps {
  language: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = async ({
  language,
}) => {
  const { t } = await useTranslationServer(language, "footer");

  return (
    <footer style={{ marginTop: 50 }}>
      <Translation i18nKey="languageSwitcher" t={t}>
        Switch from <strong>{language}</strong> to:{" "}
      </Translation>

      {applicationLanguages
        .filter((applicationLanguage) => language !== applicationLanguage)
        .map((applicationLanguage, index) => {
          return (
            <span key={applicationLanguage}>
              {index > 0 && " or "}
              <Link href={`/${applicationLanguage}`}>
                {applicationLanguage}
              </Link>
            </span>
          );
        })}
    </footer>
  );
};
