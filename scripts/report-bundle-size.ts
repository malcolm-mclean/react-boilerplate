import { markdown, warn } from 'danger';
import report from '../report.json';
import baseReport from '../base-report.json';
import { Bundle } from './utils/report-bundle-size/types/Bundle';
import {
	createComparisonTableMarkdown,
	createSimpleTableMarkdown,
	filterBundles,
	getBundlesInCommon,
	formatBundles
} from './utils/report-bundle-size';

const interpretBundles = (newBundles: Bundle[], oldBundles: Bundle[]) => {
	const bundlesToCompare = getBundlesInCommon(newBundles, oldBundles);
	const newBundlesOnly = filterBundles(newBundles, oldBundles);
	const oldBundlesOnly = filterBundles(oldBundles, newBundles);

	const noBundlesToReport =
		!bundlesToCompare.length &&
		!newBundlesOnly.length &&
		!oldBundlesOnly.length;

	if (noBundlesToReport) {
		return warn('No bundles to report on');
	}

	// https://github.com/danger/danger-js/issues/1014
	if (bundlesToCompare.length) {
		markdown(createComparisonTableMarkdown(bundlesToCompare, oldBundles));
	}

	if (newBundlesOnly.length) {
		markdown(createSimpleTableMarkdown(newBundlesOnly));
	}

	if (oldBundlesOnly.length) {
		markdown(createSimpleTableMarkdown(oldBundlesOnly, false));
	}
};

const newBundles = formatBundles(report);
const oldBundles = formatBundles(baseReport);

interpretBundles(newBundles, oldBundles);
