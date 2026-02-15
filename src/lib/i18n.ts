export type Language = 'pl' | 'en';

export const translations = {
  pl: {
    // Header
    appName: 'Mój Portfel',
    openApp: 'Otwórz aplikację',
    
    // Hero
    badge: '100% darmowe • Bez rejestracji • Prywatność gwarantowana',
    heroTitle1: 'Śledź wartość swojego',
    heroTitle2: 'portfela inwestycyjnego',
    heroDescription: 'Proste narzędzie do zarządzania wszystkimi Twoimi inwestycjami. Obliczaj zyski, planuj dopłaty i monitoruj wzrost swojego majątku.',
    startFree: 'Zacznij za darmo',
    learnMore: 'Dowiedz się więcej',
    
    // Dashboard preview
    portfolioValue: 'Wartość portfela',
    thisYear: 'w tym roku',
    monthlyProfit: 'Zysk miesięczny',
    
    // Features
    featuresTitle: 'Wszystko czego potrzebujesz',
    featuresSubtitle: 'Kompletny zestaw narzędzi do zarządzania Twoim portfelem inwestycyjnym',
    
    feature1Title: 'Wszystkie inwestycje w jednym miejscu',
    feature1Desc: 'Śledź swoje lokaty, obligacje, akcje, fundusze i inne aktywa w przejrzystym panelu.',
    feature2Title: 'Prognoza zysków',
    feature2Desc: 'Automatyczne obliczanie przewidywanych zysków na podstawie oprocentowania każdej pozycji.',
    feature3Title: 'Wizualizacja portfela',
    feature3Desc: 'Interaktywne wykresy pokazujące strukturę Twojego portfela i rozkład aktywów.',
    feature4Title: 'Powiadomienia o dopłatach',
    feature4Desc: 'Automatyczne przypomnienia o zbliżających się terminach regularnych wpłat.',
    feature5Title: 'Symulacja przyszłości',
    feature5Desc: 'Sprawdź jak będzie wyglądał Twój portfel za 1, 5 lub 10 lat z uwzględnieniem dopłat.',
    feature6Title: 'Bezpieczeństwo danych',
    feature6Desc: 'Twoje dane pozostają na Twoim urządzeniu. Pełna kontrola nad prywatnością.',
    
    // Benefits
    benefitsTitle: 'Dlaczego warto korzystać z Mój Portfel?',
    benefitsSubtitle: 'Stworzyliśmy narzędzie, które jest proste w obsłudze, ale jednocześnie wyposażone we wszystkie funkcje potrzebne do efektywnego zarządzania inwestycjami.',
    benefit1: 'Darmowe konto bez ograniczeń',
    benefit2: 'Brak ukrytych opłat',
    benefit3: 'Nieograniczona liczba kategorii',
    benefit4: 'Eksport do CSV i arkuszy kalkulacyjnych',
    benefit5: 'Automatyczne obliczanie zysków',
    benefit6: 'Tryb ciemny i jasny',
    tryNow: 'Wypróbuj teraz',
    
    // Stats
    forecast1Year: 'Prognoza (1 rok)',
    monthlyContributions: 'Dopłaty mies.',
    
    // CTA
    ctaTitle: 'Zacznij śledzić swoje inwestycje już dziś',
    ctaSubtitle: 'Dołącz do tysięcy osób, które już korzystają z Mój Portfel do zarządzania swoim majątkiem.',
    noRegistration: 'Bez rejestracji • Bez karty kredytowej • 100% za darmo',
    
    // Footer
    features: 'Funkcje',
    app: 'Aplikacja',
    madeBy: 'Made by',
    locationTag: '— strony internetowe Poznań',
    
    // Categories (landing)
    catStocks: 'Giełda',
    catBonds: 'Obligacje',
    catDeposits: 'Lokaty',
    catFunds: 'Fundusze',
    catCrypto: 'Kryptowaluty',
    catSavings: 'Oszczędności',

    // ============ APP TRANSLATIONS ============
    
    // Dashboard header
    newCategory: 'Nowa kategoria',
    addAsset: 'Dodaj aktywo',
    
    // TotalValue
    showValues: 'Pokaż wartości',
    hideValues: 'Ukryj wartości',
    positionSingular: 'pozycja',
    positionFew: 'pozycje',
    positionMany: 'pozycji',
    inCategories: 'w',
    categorySingular: 'kategorii',
    categoryPlural: 'kategoriach',
    averageAnnual: 'Średnia: {rate}% rocznie',
    
    // Categories section
    categories: 'Kategorie',
    sortBy: 'Sortuj:',
    sortValue: 'Wartość',
    sortMonthlyContribution: 'Dopłaty miesięczne',
    sortInterestRate: 'Oprocentowanie',
    sortProfit: 'Zysk roczny',
    categoriesCount: 'kategorii',
    inactiveCategories: 'Nieaktywne kategorie',
    
    // Overview section
    overview: 'Przegląd',
    
    // Portfolio Chart
    portfolioStructure: 'Struktura portfela',
    addAssetsToSeeStructure: 'Dodaj aktywa, aby zobaczyć strukturę portfela',
    unknown: 'Nieznane',
    categoriesLabel: 'kategorii',
    
    // History Panel
    recentChanges: 'Ostatnie zmiany',
    noHistory: 'Brak historii zmian',
    justNow: 'Przed chwilą',
    minutesAgo: '{n} min temu',
    hoursAgo: '{n} godz. temu',
    daysAgo: '{n} dni temu',
    
    // Stats Panel
    portfolioStats: 'Statystyki portfela',
    forecast1YearLabel: 'Prognoza za 1 rok',
    monthlyContributionsLabel: 'Dopłaty miesięczne',
    perYear: '/rok',
    largestPosition: 'Największa pozycja',
    averageValue: 'Średnia wartość',
    bestCategory: 'Najlepszy: {name}',
    
    // Forecast Panel
    forecastTitle: 'Prognoza wartości portfela',
    addAssetsToSeeForecast: 'Dodaj aktywa, aby zobaczyć prognozę',
    selectPeriod: 'Wybierz okres prognozy',
    statsFor: 'Statystyki dla {period}',
    historyAndForecast: '{months} mies. historii • Prognoza na {period}',
    forecastFor: 'Prognoza na {period}',
    changePeriod: 'Zmień okres',
    year1: '1 rok',
    years5: '5 lat',
    years10: '10 lat',
    shortTerm: 'Krótkoterminowa',
    mediumTerm: 'Średnioterminowa',
    longTerm: 'Długoterminowa',
    initialValue: 'Wartość początkowa',
    after: 'Za {period}',
    interestProfit: 'Zysk z odsetek',
    totalContributions: 'Suma dopłat',
    totalGrowth: 'Wzrost całkowity',
    seeChart: 'Zobacz wykres',
    start: 'Początek',
    growth: 'Wzrost',
    portfolioValueLabel: 'Wartość portfela',
    forecastLabel: 'Prognoza',
    contributionsSum: 'Suma wpłat',
    today: 'Dziś',
    
    // Contribution Notifications
    contributionReminders: 'Przypomnienia o dopłatach',
    overdueDays: 'Zaległe {n} dni',
    todayContribution: 'Dziś dopłata!',
    tomorrow: 'Jutro',
    inDays: 'Za {n} dni',
    confirm: 'Zatwierdź',
    dayOfMonth: '{n}. dnia',
    
    // User Panel
    myAccount: 'Moje konto',
    profile: 'Profil',
    exportToCSV: 'Eksportuj do CSV',
    settings: 'Ustawienia',
    help: 'Pomoc',
    logout: 'Wyloguj się',
    userPanel: 'Panel użytkownika',
    dataExported: 'Dane wyeksportowane do pliku CSV',
    
    // Add Asset Dialog
    editAsset: 'Edytuj aktywo',
    addNewAsset: 'Dodaj nowe aktywo',
    selectCategoryForAsset: 'Wybierz kategorię dla aktywa:',
    cancel: 'Anuluj',
    amount: 'Kwota (PLN)',
    positionName: 'Nazwa pozycji',
    positionNamePlaceholder: 'np. Akcje PKO BP',
    monthlyContributionOptional: 'Miesięczna dopłata (opcjonalnie)',
    perMonth: '/miesiąc',
    contributionDay: 'Dzień dopłaty',
    noReminder: 'Brak przypomnienia',
    back: 'Wstecz',
    saveChanges: 'Zapisz zmiany',
    interestRateLabel: 'Oprocentowanie: {rate}%',
    yearlyRate: '{rate}% rocznie',
    change: 'Zmień',
    
    // Category Dialog
    editCategory: 'Edytuj kategorię',
    newCategoryTitle: 'Nowa kategoria',
    categoryName: 'Nazwa kategorii',
    categoryNamePlaceholder: 'np. Kryptowaluty',
    annualInterestRate: 'Oprocentowanie roczne',
    color: 'Kolor',
    icon: 'Ikona',
    addCategory: 'Dodaj kategorię',
    save: 'Zapisz',
    next: 'Dalej',
    deleteCategory: 'Usunąć kategorię?',
    deleteCategoryDescription: 'Ta akcja usunie kategorię "{name}" wraz ze wszystkimi aktywami w niej zawartymi. Tej operacji nie można cofnąć.',
    deleteCategoryConfirm: 'Usuń kategorię',
    
    // Category Card
    yearlyProfit: 'Zysk roczny',
    monthlyContributionShort: 'Dopłata mies.',
    firstAsset: 'Dodaj pierwszy asset',
    emptyCategory: 'Brak aktywów w kategorii',
    editAssetTooltip: 'Edytuj',
    deleteAssetTooltip: 'Usuń',
    showInactive: 'Pokaż nieaktywne',
    hideInactive: 'Ukryj',
    activate: 'Aktywuj',
    deactivate: 'Dezaktywuj',
    delete: 'Usuń',
    edit: 'Edytuj',
    addAssetShort: 'Dodaj',
    contributedTotal: 'Wpłacono łącznie',
    ofPortfolio: 'portfela',
    
    // Contribution confirmed toast
    contributionConfirmed: 'Dopłata zatwierdzona',
    contributionConfirmedDesc: 'Dodano {amount} do {asset} ({category})',
    
    // Auth
    login: 'Zaloguj się',
    register: 'Zarejestruj się',
    loginOrRegister: 'Zaloguj się',
    adminPanel: 'Panel admina',

    // History page
    allChanges: 'Wszystkie zmiany',
    filterByType: 'Typ',
    filterAll: 'Wszystkie',
    filterAdded: 'Dodane',
    filterUpdated: 'Edytowane',
    filterDeleted: 'Usunięte',
    showAll: 'Zobacz wszystko',
    loadMore: 'Załaduj więcej',
    noMoreHistory: 'Brak więcej wpisów',

    // Admin
    roleAdmin: 'Administrator',
    roleUser: 'Użytkownik',
    roleModerator: 'Moderator',
    accountFree: 'Bezpłatne',
    accountPremium: 'Premium',
    changeRole: 'Zmień rolę',
    changeStatus: 'Zmień status',
    sortByName: 'Nazwa',
    sortByDate: 'Data rejestracji',
    sortByValue: 'Wartość portfela',
    sortByRole: 'Rola',
    currencySettings: 'Waluta',
    exchangeRate: 'Kurs wymiany',
    refreshRate: 'Odśwież kurs',
  },
  en: {
    // Header
    appName: 'My Portfolio',
    openApp: 'Open App',
    
    // Hero
    badge: '100% Free • No Registration • Privacy Guaranteed',
    heroTitle1: 'Track the value of your',
    heroTitle2: 'investment portfolio',
    heroDescription: 'A simple tool for managing all your investments. Calculate profits, plan contributions, and monitor your wealth growth.',
    startFree: 'Start for Free',
    learnMore: 'Learn More',
    
    // Dashboard preview
    portfolioValue: 'Portfolio Value',
    thisYear: 'this year',
    monthlyProfit: 'Monthly Profit',
    
    // Features
    featuresTitle: 'Everything You Need',
    featuresSubtitle: 'A complete toolkit for managing your investment portfolio',
    
    feature1Title: 'All Investments in One Place',
    feature1Desc: 'Track your deposits, bonds, stocks, funds, and other assets in a clear dashboard.',
    feature2Title: 'Profit Forecasting',
    feature2Desc: 'Automatic calculation of expected profits based on each position\'s interest rate.',
    feature3Title: 'Portfolio Visualization',
    feature3Desc: 'Interactive charts showing your portfolio structure and asset distribution.',
    feature4Title: 'Contribution Reminders',
    feature4Desc: 'Automatic reminders about upcoming regular payment dates.',
    feature5Title: 'Future Simulation',
    feature5Desc: 'See what your portfolio will look like in 1, 5, or 10 years with contributions included.',
    feature6Title: 'Data Security',
    feature6Desc: 'Your data stays on your device. Full control over your privacy.',
    
    // Benefits
    benefitsTitle: 'Why Use My Portfolio?',
    benefitsSubtitle: 'We created a tool that is easy to use, yet equipped with all the features needed for effective investment management.',
    benefit1: 'Free account with no limits',
    benefit2: 'No hidden fees',
    benefit3: 'Unlimited categories',
    benefit4: 'Export to CSV and spreadsheets',
    benefit5: 'Automatic profit calculation',
    benefit6: 'Dark and light mode',
    tryNow: 'Try Now',
    
    // Stats
    forecast1Year: 'Forecast (1 year)',
    monthlyContributions: 'Monthly Contrib.',
    
    // CTA
    ctaTitle: 'Start Tracking Your Investments Today',
    ctaSubtitle: 'Join thousands of people who already use My Portfolio to manage their wealth.',
    noRegistration: 'No registration • No credit card • 100% free',
    
    // Footer
    features: 'Features',
    app: 'App',
    madeBy: 'Made by',
    locationTag: '— websites Poznań',
    
    // Categories (landing)
    catStocks: 'Stocks',
    catBonds: 'Bonds',
    catDeposits: 'Deposits',
    catFunds: 'Funds',
    catCrypto: 'Cryptocurrency',
    catSavings: 'Savings',

    // ============ APP TRANSLATIONS ============
    
    // Dashboard header
    newCategory: 'New Category',
    addAsset: 'Add Asset',
    
    // TotalValue
    showValues: 'Show values',
    hideValues: 'Hide values',
    positionSingular: 'position',
    positionFew: 'positions',
    positionMany: 'positions',
    inCategories: 'in',
    categorySingular: 'category',
    categoryPlural: 'categories',
    averageAnnual: 'Average: {rate}% annually',
    
    // Categories section
    categories: 'Categories',
    sortBy: 'Sort:',
    sortValue: 'Value',
    sortMonthlyContribution: 'Monthly contributions',
    sortInterestRate: 'Interest rate',
    sortProfit: 'Annual profit',
    categoriesCount: 'categories',
    inactiveCategories: 'Inactive categories',
    
    // Overview section
    overview: 'Overview',
    
    // Portfolio Chart
    portfolioStructure: 'Portfolio Structure',
    addAssetsToSeeStructure: 'Add assets to see portfolio structure',
    unknown: 'Unknown',
    categoriesLabel: 'categories',
    
    // History Panel
    recentChanges: 'Recent Changes',
    noHistory: 'No change history',
    justNow: 'Just now',
    minutesAgo: '{n} min ago',
    hoursAgo: '{n} hours ago',
    daysAgo: '{n} days ago',
    
    // Stats Panel
    portfolioStats: 'Portfolio Statistics',
    forecast1YearLabel: '1 Year Forecast',
    monthlyContributionsLabel: 'Monthly Contributions',
    perYear: '/year',
    largestPosition: 'Largest Position',
    averageValue: 'Average Value',
    bestCategory: 'Best: {name}',
    
    // Forecast Panel
    forecastTitle: 'Portfolio Value Forecast',
    addAssetsToSeeForecast: 'Add assets to see forecast',
    selectPeriod: 'Select forecast period',
    statsFor: 'Statistics for {period}',
    historyAndForecast: '{months} months history • Forecast for {period}',
    forecastFor: 'Forecast for {period}',
    changePeriod: 'Change period',
    year1: '1 year',
    years5: '5 years',
    years10: '10 years',
    shortTerm: 'Short-term',
    mediumTerm: 'Medium-term',
    longTerm: 'Long-term',
    initialValue: 'Initial Value',
    after: 'After {period}',
    interestProfit: 'Interest Profit',
    totalContributions: 'Total Contributions',
    totalGrowth: 'Total Growth',
    seeChart: 'See Chart',
    start: 'Start',
    growth: 'Growth',
    portfolioValueLabel: 'Portfolio Value',
    forecastLabel: 'Forecast',
    contributionsSum: 'Total Deposits',
    today: 'Today',
    
    // Contribution Notifications
    contributionReminders: 'Contribution Reminders',
    overdueDays: 'Overdue {n} days',
    todayContribution: 'Due today!',
    tomorrow: 'Tomorrow',
    inDays: 'In {n} days',
    confirm: 'Confirm',
    dayOfMonth: 'Day {n}',
    
    // User Panel
    myAccount: 'My Account',
    profile: 'Profile',
    exportToCSV: 'Export to CSV',
    settings: 'Settings',
    help: 'Help',
    logout: 'Log Out',
    userPanel: 'User Panel',
    dataExported: 'Data exported to CSV file',
    
    // Add Asset Dialog
    editAsset: 'Edit Asset',
    addNewAsset: 'Add New Asset',
    selectCategoryForAsset: 'Select a category for the asset:',
    cancel: 'Cancel',
    amount: 'Amount (USD)',
    positionName: 'Position Name',
    positionNamePlaceholder: 'e.g. Apple Stocks',
    monthlyContributionOptional: 'Monthly Contribution (optional)',
    perMonth: '/month',
    contributionDay: 'Contribution Day',
    noReminder: 'No reminder',
    back: 'Back',
    saveChanges: 'Save Changes',
    interestRateLabel: 'Interest rate: {rate}%',
    yearlyRate: '{rate}% annually',
    change: 'Change',
    
    // Category Dialog
    editCategory: 'Edit Category',
    newCategoryTitle: 'New Category',
    categoryName: 'Category Name',
    categoryNamePlaceholder: 'e.g. Cryptocurrency',
    annualInterestRate: 'Annual Interest Rate',
    color: 'Color',
    icon: 'Icon',
    addCategory: 'Add Category',
    save: 'Save',
    next: 'Next',
    deleteCategory: 'Delete Category?',
    deleteCategoryDescription: 'This action will delete the category "{name}" along with all assets it contains. This cannot be undone.',
    deleteCategoryConfirm: 'Delete Category',
    
    // Category Card
    yearlyProfit: 'Annual Profit',
    monthlyContributionShort: 'Monthly Contrib.',
    firstAsset: 'Add first asset',
    emptyCategory: 'No assets in category',
    editAssetTooltip: 'Edit',
    deleteAssetTooltip: 'Delete',
    showInactive: 'Show inactive',
    hideInactive: 'Hide',
    activate: 'Activate',
    deactivate: 'Deactivate',
    delete: 'Delete',
    edit: 'Edit',
    addAssetShort: 'Add',
    contributedTotal: 'Total contributed',
    ofPortfolio: 'of portfolio',
    
    // Contribution confirmed toast
    contributionConfirmed: 'Contribution Confirmed',
    contributionConfirmedDesc: 'Added {amount} to {asset} ({category})',
    
    // Auth
    login: 'Sign In',
    register: 'Register',
    loginOrRegister: 'Sign In',
    adminPanel: 'Admin Panel',

    // History page
    allChanges: 'All Changes',
    filterByType: 'Type',
    filterAll: 'All',
    filterAdded: 'Added',
    filterUpdated: 'Updated',
    filterDeleted: 'Deleted',
    showAll: 'View all',
    loadMore: 'Load more',
    noMoreHistory: 'No more entries',

    // Admin
    roleAdmin: 'Administrator',
    roleUser: 'User',
    roleModerator: 'Moderator',
    accountFree: 'Free',
    accountPremium: 'Premium',
    changeRole: 'Change role',
    changeStatus: 'Change status',
    sortByName: 'Name',
    sortByDate: 'Registration date',
    sortByValue: 'Portfolio value',
    sortByRole: 'Role',
    currencySettings: 'Currency',
    exchangeRate: 'Exchange rate',
    refreshRate: 'Refresh rate',
  }
} as const;

export type TranslationKey = keyof typeof translations['pl'];

export function getTranslations(lang: Language) {
  return translations[lang];
}

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[lang][key] as string;
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }
  return text;
}

export function formatCurrencyByLang(amount: number, lang: Language): string {
  if (lang === 'en') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 4); // Approximate USD conversion for display
  }
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getPositionLabel(count: number, lang: Language): string {
  if (lang === 'en') {
    return count === 1 ? translations.en.positionSingular : translations.en.positionMany;
  }
  if (count === 1) return translations.pl.positionSingular;
  if (count >= 2 && count <= 4) return translations.pl.positionFew;
  return translations.pl.positionMany;
}

export function getCategoryLabel(count: number, lang: Language): string {
  if (lang === 'en') {
    return count === 1 ? translations.en.categorySingular : translations.en.categoryPlural;
  }
  return count === 1 ? translations.pl.categorySingular : translations.pl.categoryPlural;
}

export function getDateLocale(lang: Language): string {
  return lang === 'en' ? 'en-US' : 'pl-PL';
}
