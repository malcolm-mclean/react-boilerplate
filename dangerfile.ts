import { markdown, warn } from 'danger';
import report from './report.json';
import baseReport from './base-report.json';

interface Bundle {
	label: string;
	statSize: number;
	parsedSize: number;
	gzipSize: number;
	// group intentionally left out
}

const translateSize = (size: number) => {
	if (size < 1000) {
		return `${size} B`;
	}

	if (size > 1000000) {
		const megabytes = (size / 1000000).toFixed(2);

		return `${megabytes} MB`;
	}

	const kilobytes = (size / 1000).toFixed(2);

	return `${kilobytes} KB`;
};

const cleanBundleLabel = (label: string) => {
	const nameStartIndex = label.lastIndexOf('/') + 1;
	const nameEndIndex = label.indexOf('.');

	return label.slice(nameStartIndex, nameEndIndex);
};

const reportToBundles = (report: any[]): Bundle[] => {
	if (!Array.isArray(report)) {
		fail('Bundle report is in an unexpected format');
	}

	const bundles: Bundle[] = report.map(bundle => {
		return {
			label: cleanBundleLabel(bundle.label),
			statSize: bundle.statSize,
			parsedSize: bundle.parsedSize,
			gzipSize: bundle.gzipSize,
		};
	});

	return bundles;
};

const compareSizeInBytes = (newSize: number, oldSize: number) => {
	const sizeDiff = newSize - oldSize;

	return translateSize(sizeDiff);
};

const compareSizeAsPercent = (newSize: number, oldSize: number) => {
	const prefix = newSize > oldSize ? '+' : '-';
	const decimal = Math.abs((newSize - oldSize) / oldSize);
	const percent = (decimal * 100).toFixed(2);

	return `${prefix}${percent}%`;
};

const isSizeDiffSignificant = (newSize: number, oldSize: number) => {
	const sizeDiff = Math.abs(newSize - oldSize);

	return sizeDiff > 20;
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
		? '#### New bundles in this PR:'
		: '#### Removed bundles in this PR:';
	const tableHeader =
		'Bundle | Size | Minified | Gzipped\n--- | --- | --- | ---\n';
	const tableRows = createSimpleRows(bundles);

	markdown(title);
	markdown(`${tableHeader}${tableRows}`);
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
		'Bundle | Size Diff | % Diff | Old Size | New Size\n--- | --- | --- | --- | ---\n';
	const tableRows = createComparisonRows(newBundles, oldBundles);

	if (!tableRows) {
		return markdown('No significant bundle size changes in this PR ✅');
	}

	markdown(title);
	markdown(`${tableHeader}${tableRows}`);
	markdown('_Size differences calculated using gzip bundle size_');
};

const interpretBundles = (newBundles: Bundle[], oldBundles: Bundle[]) => {
	const newBundlesToCompare = newBundles.filter(nb =>
		oldBundles.some(ob => ob.label === nb.label)
	);
	const bundlesOnlyInNew = newBundles.filter(
		nb => !oldBundles.some(ob => ob.label === nb.label)
	);
	const bundlesOnlyInOld = oldBundles.filter(
		ob => !newBundles.some(nb => nb.label === ob.label)
	);

	const noBundlesToReport =
		!newBundlesToCompare.length &&
		!bundlesOnlyInNew.length &&
		!bundlesOnlyInOld.length;

	if (noBundlesToReport) {
		return warn('No bundles to report on');
	}

	if (newBundlesToCompare.length) {
		createComparisonBundleTable(newBundlesToCompare, oldBundles);
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
