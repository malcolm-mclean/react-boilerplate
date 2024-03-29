import { Bundle } from './types/Bundle';

export const translateSize = (size: number, prefix = '') => {
	const absoluteSize = Math.abs(size);

	if (absoluteSize < 1000) {
		return `${prefix}${absoluteSize} B`;
	}

	if (absoluteSize >= 1000000) {
		const megabytes = (absoluteSize / 1000000).toFixed(2);

		return `${prefix}${megabytes} MB`;
	}

	const kilobytes = (absoluteSize / 1000).toFixed(2);

	return `${prefix}${kilobytes} KB`;
};

export const getSizeDiffPrefix = (newSize: number, oldSize: number) => {
	return newSize >= oldSize ? '+' : '-';
};

export const compareSizeInBytes = (newSize: number, oldSize: number) => {
	const prefix = getSizeDiffPrefix(newSize, oldSize);
	const sizeDiff = newSize - oldSize;

	return translateSize(sizeDiff, prefix);
};

export const compareSizeAsPercent = (newSize: number, oldSize: number) => {
	const prefix = getSizeDiffPrefix(newSize, oldSize);
	const decimal = Math.abs((newSize - oldSize) / oldSize);
	const percent = (decimal * 100).toFixed(2);

	return `${prefix}${percent}%`;
};

export const isSizeDiffSignificant = (newSize: number, oldSize: number) => {
	const sizeDiff = Math.abs(newSize - oldSize);

	return sizeDiff > 20;
};

export const getBundleName = (label: string) => {
	const nameStartIndex = label.lastIndexOf('/') + 1;
	const nameEndIndex = label.indexOf('.');

	return label.slice(nameStartIndex, nameEndIndex);
};

export const formatBundles = (report: unknown[]): Bundle[] => {
	if (!Array.isArray(report)) {
		throw new Error('Bundle report is in an unexpected format');
	}

	const bundles: Bundle[] = report.map(bundle => {
		return {
			label: getBundleName(bundle.label),
			statSize: bundle.statSize,
			parsedSize: bundle.parsedSize,
			gzipSize: bundle.gzipSize
		};
	});

	return bundles;
};

export const getBundlesInCommon = (bundlesA: Bundle[], bundlesB: Bundle[]) => {
	const bundlesToCompare = bundlesA.filter(a =>
		bundlesB.some(b => b.label === a.label)
	);

	return bundlesToCompare;
};

export const filterBundles = (filterKeep: Bundle[], filterOut: Bundle[]) => {
	const filteredBundles = filterKeep.filter(
		k => !filterOut.some(o => o.label === k.label)
	);

	return filteredBundles;
};

export const composeCommentMarkdown = (markdownLines: string[]): string => {
	const markdownString = markdownLines.join('\n');
	return markdownString.trim();
};

export const createSimpleRows = (bundles: Bundle[]) => {
	let rows = '';

	bundles.forEach(bundle => {
		const bundleName = bundle.label;
		const size = translateSize(bundle.statSize);
		const minifiedSize = translateSize(bundle.parsedSize);
		const gzipSize = translateSize(bundle.gzipSize);

		rows += `${bundleName} | ${size} | ${minifiedSize} | ${gzipSize}\n`;
	});

	return rows.trim();
};

export const createSimpleTableMarkdown = (
	bundles: Bundle[],
	isAddingBundles = true
) => {
	const title = isAddingBundles
		? '### New bundles in this PR:'
		: '### Removed bundles in this PR:';
	const tableHeader =
		'Bundle | Size | Minified | Gzipped\n--- | --- | --- | ---';
	const tableRows = createSimpleRows(bundles);

	return composeCommentMarkdown([title, tableHeader, tableRows]);
};

export const createComparisonRows = (
	newBundles: Bundle[],
	oldBundles: Bundle[]
) => {
	let rows = '';

	newBundles.forEach(bundle => {
		const matchingBundle = oldBundles.find(ob => ob.label === bundle.label);

		const newSize = bundle.gzipSize;
		const oldSize = matchingBundle.gzipSize;

		if (isSizeDiffSignificant(newSize, oldSize)) {
			const bundleName = bundle.label;
			const sizeDiff = compareSizeInBytes(newSize, oldSize);
			const percentDiff = compareSizeAsPercent(newSize, oldSize);
			const oldSizeString = translateSize(oldSize);
			const newSizeString = translateSize(newSize);

			rows += `${bundleName} | ${sizeDiff} | ${percentDiff} | ${oldSizeString} | ${newSizeString}\n`;
		}
	});

	return rows.trim();
};

export const createComparisonTableMarkdown = (
	newBundles: Bundle[],
	oldBundles: Bundle[]
) => {
	const title = '### Bundles changed in this PR:';
	const tableHeader =
		'Bundle | Size Diff | % Diff | Old Size | New Size\n--- | --- | --- | --- | ---';
	const tableRows = createComparisonRows(newBundles, oldBundles);
	const disclaimer = '\n_Size differences calculated using gzip bundle size_';

	if (!tableRows) {
		return 'No significant bundle size changes in this PR ✅';
	}

	return composeCommentMarkdown([title, tableHeader, tableRows, disclaimer]);
};
