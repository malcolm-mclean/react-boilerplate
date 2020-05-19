import { markdown } from 'danger';
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
	const kilobytes = (size / 1000).toFixed(2);

	if (parseFloat(kilobytes) > 1000) {
		const megabytes = (size / 1000000).toFixed(2);

		return `${megabytes} MB`;
	}

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

const compareSizeAsPercentage = (newSize: number, oldSize: number) => {
	const prefix = newSize > oldSize ? '🔼 +' : '🔽 -';
	const decimal = Math.abs((newSize - oldSize) / oldSize);
	const percentage = (decimal * 100).toFixed(2);

	return `${prefix}${percentage}%`;
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

	newBundles.forEach(newBundle => {
		const matchingBundle = oldBundles.find(
			ob => ob.label === newBundle.label
		);

		const newSize = newBundle.gzipSize;
		const oldSize = matchingBundle.gzipSize;

		if (isSizeDiffSignificant(newSize, oldSize)) {
			const bundleName = newBundle.label;
			const sizeDiff = compareSizeInBytes(newSize, oldSize);
			const percentDiff = compareSizeAsPercentage(newSize, oldSize);
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
		'Bundle | Size Diff (Gzip) | % Diff | Old Size | New Size\n--- | --- | --- | --- | ---\n';
	const tableRows = createComparisonRows(newBundles, oldBundles);

	markdown(title);
	markdown(`${tableHeader}${tableRows}`);
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

interpretBundles(reportToBundles(report), reportToBundles(baseReport));
