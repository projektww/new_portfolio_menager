import { Asset, Category } from '@/types/portfolio';

export function exportToCSV(
  assets: Asset[], 
  categories: Category[],
  getCategoryTotal: (categoryId: string) => number
) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const activeCategories = categories.filter(c => c.isActive !== false);
  const inactiveCategories = categories.filter(c => c.isActive === false);
  
  // Calculate totals
  const activeTotalValue = activeCategories.reduce((sum, cat) => sum + getCategoryTotal(cat.id), 0);
  const inactiveTotalValue = inactiveCategories.reduce((sum, cat) => sum + getCategoryTotal(cat.id), 0);
  const totalValue = activeTotalValue + inactiveTotalValue;
  
  // Calculate profits and contributions
  let totalAnnualProfit = 0;
  let totalMonthlyContribution = 0;
  let activeAssetCount = 0;
  let inactiveAssetCount = 0;
  
  assets.forEach(asset => {
    const category = categoryMap.get(asset.categoryId);
    if (category) {
      if (category.isActive !== false) {
        totalAnnualProfit += (asset.amount * category.interestRate) / 100;
        totalMonthlyContribution += asset.monthlyContribution || 0;
        activeAssetCount++;
      } else {
        inactiveAssetCount++;
      }
    }
  });

  // Calculate weighted average interest rate
  let weightedSum = 0;
  assets.forEach(asset => {
    const category = categoryMap.get(asset.categoryId);
    if (category && category.isActive !== false && activeTotalValue > 0) {
      weightedSum += (asset.amount / activeTotalValue) * category.interestRate;
    }
  });
  const weightedAverageRate = activeTotalValue > 0 ? weightedSum : 0;

  // Find largest asset
  const largestAsset = assets.reduce((max, asset) => 
    asset.amount > (max?.amount || 0) ? asset : max, 
    null as Asset | null
  );

  // Find best performing category
  let bestCategory: { name: string; profit: number } | null = null;
  activeCategories.forEach(cat => {
    const catProfit = (getCategoryTotal(cat.id) * cat.interestRate) / 100;
    if (!bestCategory || catProfit > bestCategory.profit) {
      bestCategory = { name: cat.name, profit: catProfit };
    }
  });

  // Create CSV content
  const rows: string[][] = [];
  
  // Header section
  rows.push(['═══════════════════════════════════════════════════════════════════════════════════════']);
  rows.push(['', '', '', 'MÓJ PORTFEL - SZCZEGÓŁOWY RAPORT', '', '', '']);
  rows.push(['', '', '', `Data wygenerowania: ${new Date().toLocaleDateString('pl-PL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, '', '', '']);
  rows.push(['═══════════════════════════════════════════════════════════════════════════════════════']);
  rows.push(['']);
  
  // Main portfolio summary
  rows.push(['PODSUMOWANIE PORTFELA']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  rows.push(['Całkowita wartość portfela:', `${totalValue.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Wartość aktywnych inwestycji:', `${activeTotalValue.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Wartość nieaktywnych inwestycji:', `${inactiveTotalValue.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['']);
  rows.push(['Liczba wszystkich aktywów:', `${assets.length}`]);
  rows.push(['Liczba aktywnych aktywów:', `${activeAssetCount}`]);
  rows.push(['Liczba nieaktywnych aktywów:', `${inactiveAssetCount}`]);
  rows.push(['']);
  rows.push(['Aktywne kategorie:', `${activeCategories.length}`]);
  rows.push(['Nieaktywne kategorie:', `${inactiveCategories.length}`]);
  rows.push(['']);
  
  // Profit calculations
  rows.push(['PROJEKCJA ZYSKÓW']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  rows.push(['Szacowany zysk roczny:', `${totalAnnualProfit.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Szacowany zysk miesięczny:', `${(totalAnnualProfit / 12).toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Szacowany zysk dzienny:', `${(totalAnnualProfit / 365).toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Średnia ważona stopa zwrotu:', `${weightedAverageRate.toFixed(2).replace('.', ',')}%`]);
  rows.push(['']);
  
  // Contribution summary
  rows.push(['DOPŁATY']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  rows.push(['Suma dopłat miesięcznych:', `${totalMonthlyContribution.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['Suma dopłat rocznych:', `${(totalMonthlyContribution * 12).toFixed(2).replace('.', ',')} zł`]);
  rows.push(['']);
  
  // Future projections
  const projections = [1, 2, 5, 10];
  rows.push(['PROGNOZA WARTOŚCI PORTFELA']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  projections.forEach(years => {
    let projectedValue = activeTotalValue;
    for (let y = 0; y < years; y++) {
      projectedValue = projectedValue * (1 + weightedAverageRate / 100) + (totalMonthlyContribution * 12);
    }
    const growthAmount = projectedValue - activeTotalValue;
    const growthPercent = activeTotalValue > 0 ? (growthAmount / activeTotalValue) * 100 : 0;
    rows.push([
      `Za ${years} ${years === 1 ? 'rok' : years < 5 ? 'lata' : 'lat'}:`,
      `${projectedValue.toFixed(2).replace('.', ',')} zł`,
      `(+${growthAmount.toFixed(2).replace('.', ',')} zł`,
      `+${growthPercent.toFixed(1).replace('.', ',')}%)`
    ]);
  });
  rows.push(['']);
  
  // Key insights
  rows.push(['STATYSTYKI KLUCZOWE']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  if (largestAsset) {
    const largestAssetCat = categoryMap.get(largestAsset.categoryId);
    rows.push(['Największa pozycja:', `${largestAsset.name} (${largestAssetCat?.name || 'Nieznana'})`, `${largestAsset.amount.toFixed(2).replace('.', ',')} zł`]);
  }
  if (bestCategory) {
    rows.push(['Najbardziej dochodowa kategoria:', bestCategory.name, `+${bestCategory.profit.toFixed(2).replace('.', ',')} zł/rok`]);
  }
  const averageAssetValue = assets.length > 0 ? totalValue / assets.length : 0;
  rows.push(['Średnia wartość aktywa:', `${averageAssetValue.toFixed(2).replace('.', ',')} zł`]);
  rows.push(['']);
  
  // Active categories section
  if (activeCategories.length > 0) {
    rows.push(['AKTYWNE KATEGORIE']);
    rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
    rows.push(['Kategoria', 'Wartość', 'Udział w portfelu', 'Oprocentowanie', 'Zysk roczny', 'Zysk mies.', 'Dopłaty mies.', 'Liczba aktywów']);
    
    // Sort by value
    const sortedActiveCategories = [...activeCategories].sort((a, b) => 
      getCategoryTotal(b.id) - getCategoryTotal(a.id)
    );
    
    sortedActiveCategories.forEach(cat => {
      const catTotal = getCategoryTotal(cat.id);
      const catPercentage = totalValue > 0 ? (catTotal / totalValue) * 100 : 0;
      const catProfit = (catTotal * cat.interestRate) / 100;
      const catAssets = assets.filter(a => a.categoryId === cat.id);
      const catContribution = catAssets.reduce((sum, a) => sum + (a.monthlyContribution || 0), 0);
      
      rows.push([
        cat.name,
        `${catTotal.toFixed(2).replace('.', ',')} zł`,
        `${catPercentage.toFixed(1).replace('.', ',')}%`,
        `${cat.interestRate}%`,
        `${catProfit.toFixed(2).replace('.', ',')} zł`,
        `${(catProfit / 12).toFixed(2).replace('.', ',')} zł`,
        catContribution > 0 ? `${catContribution.toFixed(2).replace('.', ',')} zł` : '-',
        `${catAssets.length}`,
      ]);
    });
    rows.push(['']);
  }
  
  // Inactive categories section
  if (inactiveCategories.length > 0) {
    rows.push(['NIEAKTYWNE KATEGORIE (wykluczone z obliczeń)']);
    rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
    rows.push(['Kategoria', 'Wartość', 'Oprocentowanie', 'Potencjalny zysk roczny', 'Liczba aktywów', 'Status']);
    
    inactiveCategories.forEach(cat => {
      const catTotal = getCategoryTotal(cat.id);
      const catProfit = (catTotal * cat.interestRate) / 100;
      const catAssets = assets.filter(a => a.categoryId === cat.id);
      rows.push([
        cat.name,
        `${catTotal.toFixed(2).replace('.', ',')} zł`,
        `${cat.interestRate}%`,
        `${catProfit.toFixed(2).replace('.', ',')} zł`,
        `${catAssets.length}`,
        'Nieaktywna',
      ]);
    });
    rows.push(['']);
  }
  
  // Detailed assets section
  rows.push(['SZCZEGÓŁOWA LISTA AKTYWÓW']);
  rows.push(['───────────────────────────────────────────────────────────────────────────────────────']);
  rows.push(['Kategoria', 'Status', 'Nazwa aktywa', 'Kwota', 'Oprocentowanie', 'Zysk roczny', 'Zysk mies.', 'Dopłata mies.', 'Dzień dopłaty', 'Suma dopłat (szac.)', 'Data dodania']);
  
  // Sort assets by category and then by value
  const sortedAssets = [...assets].sort((a, b) => {
    const catA = categoryMap.get(a.categoryId)?.name || '';
    const catB = categoryMap.get(b.categoryId)?.name || '';
    if (catA !== catB) return catA.localeCompare(catB);
    return b.amount - a.amount;
  });
  
  let currentCategory = '';
  sortedAssets.forEach(asset => {
    const category = categoryMap.get(asset.categoryId);
    const categoryName = category?.name || 'Nieznana';
    const isActive = category?.isActive !== false;
    const assetProfit = category ? (asset.amount * category.interestRate) / 100 : 0;
    
    // Calculate estimated total contributions since creation
    const monthsSinceCreation = Math.max(1, Math.floor(
      (new Date().getTime() - new Date(asset.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    ));
    const estimatedTotalContributions = (asset.monthlyContribution || 0) * monthsSinceCreation;
    
    // Add separator between categories
    if (categoryName !== currentCategory && currentCategory !== '') {
      rows.push(['', '', '', '', '', '', '', '', '', '', '']);
    }
    currentCategory = categoryName;
    
    rows.push([
      categoryName,
      isActive ? 'Aktywna' : 'Nieaktywna',
      asset.name,
      `${asset.amount.toFixed(2).replace('.', ',')} zł`,
      category ? `${category.interestRate}%` : '-',
      `${assetProfit.toFixed(2).replace('.', ',')} zł`,
      `${(assetProfit / 12).toFixed(2).replace('.', ',')} zł`,
      asset.monthlyContribution ? `${asset.monthlyContribution.toFixed(2).replace('.', ',')} zł` : '-',
      asset.contributionDay ? `${asset.contributionDay}` : '-',
      estimatedTotalContributions > 0 ? `${estimatedTotalContributions.toFixed(2).replace('.', ',')} zł` : '-',
      new Date(asset.createdAt).toLocaleDateString('pl-PL'),
    ]);
  });
  
  rows.push(['']);
  rows.push(['═══════════════════════════════════════════════════════════════════════════════════════']);
  rows.push(['', '', '', 'Koniec raportu', '', '', '']);
  rows.push(['', '', '', 'Wygenerowano przez Mój Portfel - projektENTER.pl', '', '', '']);
  rows.push(['═══════════════════════════════════════════════════════════════════════════════════════']);
  
  // Build CSV string
  const csvContent = rows.map(row => row.join(';')).join('\n');
  
  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `moj-portfel_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
