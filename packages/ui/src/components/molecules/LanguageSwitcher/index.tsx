import Link from "next/link";

import { applicationLanguages } from "@repo/ui/i18n";

interface LanguageSwitcherProps {
  currentLanguage: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
}) => {
  return (
    <details className="dropdown">
      <summary className="m-1 btn btn-primary uppercase">
        {currentLanguage}
      </summary>

      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-20 flex items-center">
        {applicationLanguages.map((applicationLanguage) => (
          <li key={applicationLanguage} className="uppercase">
            <Link href={`/${applicationLanguage}`}>{applicationLanguage}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
};
