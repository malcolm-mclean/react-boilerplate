import { markdown, warn, fail } from 'danger';
import report from './report.json';
import baseReport from './base-report.json';

interface Bundle {
	label: string;
	statSize: number;
	parsedSize: number;
	gzipSize: number;
}

const translateSize = (size: number, prefix = '') => {
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

const getSizeDiffPrefix = (newSize: number, oldSize: number) => {
	return newSize >= oldSize ? '+' : '-';
};

const compareSizeInBytes = (newSize: number, oldSize: number) => {
	const sizeDiff = newSize - oldSize;

	return translateSize(sizeDiff, getSizeDiffPrefix(newSize, oldSize));
};

const compareSizeAsPercent = (newSize: number, oldSize: number) => {
	const prefix = getSizeDiffPrefix(newSize, oldSize);
	const lesserSize = newSize < oldSize ? newSize : oldSize;
	const greaterSize = newSize >= oldSize ? newSize : oldSize;
	const percent = ((greaterSize / lesserSize) * 100).toFixed(2);

	return `${prefix}${percent}%`;
};

const isSizeDiffSignificant = (newSize: number, oldSize: number) => {
	const sizeDiff = Math.abs(newSize - oldSize);

	return sizeDiff > 20;
};

// https://github.com/danger/danger-js/issues/1014
const createMessageString = (markdownArgs: string[]): string => {
	const markdownString = markdownArgs.join('\n');
	return markdownString.trim();
};

const cleanBundleLabel = (label: string) => {
	const nameStartIndex = label.lastIndexOf('/') + 1;
	const nameEndIndex = label.indexOf('.');

	return label.slice(nameStartIndex, nameEndIndex);
};

const reportToBundles = (report: unknown[]): Bundle[] => {
	if (!Array.isArray(report)) {
		fail('Bundle report is in an unexpected format');
	}

	const bundles: Bundle[] = report.map(bundle => {
		return {
			label: cleanBundleLabel(bundle.label),
			statSize: bundle.statSize,
			parsedSize: bundle.parsedSize,
			gzipSize: bundle.gzipSize
		};
	});

	return bundles;
};

const createSimpleRows = (bundles: Bundle[]) => {
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

const createSimpleBundleTable = (bundles: Bundle[], isAddingBundles = true) => {
	const title = isAddingBundles
		? '### New bundles in this PR:'
		: '### Removed bundles in this PR:';
	const tableHeader =
		'Bundle | Size | Minified | Gzipped\n--- | --- | --- | ---';
	const tableRows = createSimpleRows(bundles);

	markdown(createMessageString([title, tableHeader, tableRows]));
};

const createComparisonRows = (newBundles: Bundle[], oldBundles: Bundle[]) => {
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

const createComparisonBundleTable = (
	newBundles: Bundle[],
	oldBundles: Bundle[]
) => {
	const title = '### Bundles changed in this PR:';
	const tableHeader =
		'Bundle | Size Diff | % Diff | Old Size | New Size\n--- | --- | --- | --- | ---';
	const tableRows = createComparisonRows(newBundles, oldBundles);
	const disclaimer = '\n_Size differences calculated using gzip bundle size_';

	if (!tableRows) {
		return markdown('No significant bundle size changes in this PR ✅');
	}

	markdown(createMessageString([title, tableHeader, tableRows, disclaimer]));
};

const getBundlesInCommon = (bundlesA: Bundle[], bundlesB: Bundle[]) => {
	const bundlesToCompare = bundlesA.filter(a =>
		bundlesB.some(b => b.label === a.label)
	);

	return bundlesToCompare;
};

const filterBundles = (filterKeep: Bundle[], filterOut: Bundle[]) => {
	const filteredBundles = filterKeep.filter(
		k => !filterOut.some(o => o.label === k.label)
	);

	return filteredBundles;
};

const interpretBundles = (newBundles: Bundle[], oldBundles: Bundle[]) => {
	const bundlesToCompare = getBundlesInCommon(newBundles, oldBundles);
	const bundlesOnlyInNew = filterBundles(newBundles, oldBundles);
	const bundlesOnlyInOld = filterBundles(oldBundles, newBundles);

	const noBundlesToReport =
		!bundlesToCompare.length &&
		!bundlesOnlyInNew.length &&
		!bundlesOnlyInOld.length;

	if (noBundlesToReport) {
		return warn('No bundles to report on');
	}

	if (bundlesToCompare.length) {
		createComparisonBundleTable(bundlesToCompare, oldBundles);
	}

	if (bundlesOnlyInNew.length) {
		createSimpleBundleTable(bundlesOnlyInNew);
	}

	if (bundlesOnlyInOld.length) {
		createSimpleBundleTable(bundlesOnlyInOld, false);
	}
};

const newBundles = reportToBundles(report);
const oldBundles = reportToBundles(baseReport);

interpretBundles(newBundles, oldBundles);
