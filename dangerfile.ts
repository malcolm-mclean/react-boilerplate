import { markdown } from 'danger';
import report from './report.json';
import baseReport from './base-report.json';

const sizeToKilobyteString = (size: number) => {
	const kilobytes = size / 1000;

	return `${kilobytes} KB`;
};

const cleanBundleLabel = (label: string) => {
	const nameStartIndex = label.lastIndexOf('/') + 1;
	const nameEndIndex = label.indexOf('.');

	return label.slice(nameStartIndex, nameEndIndex);
};

const createRowsMarkdown = () => {
	let rowsMarkdown = '';

	report.map(bundle => {
		const bundleName = cleanBundleLabel(bundle.label);
		const gzipSize = sizeToKilobyteString(bundle.gzipSize);
		const parsedSize = sizeToKilobyteString(bundle.parsedSize);

		rowsMarkdown += `${bundleName} | ${gzipSize} | ${parsedSize}\n`;
	});

	return rowsMarkdown.trim();
};

const createTableMarkdown = () => {
	const headerMarkdown =
		'**Bundle** | **Gzip Size** | **Parsed Size**\n--- | --- | ---\n';

	const rows = createRowsMarkdown();

	markdown(`${headerMarkdown}${rows}`);
};

const createBaseRowsMarkdown = () => {
	let rowsMarkdown = '';

	baseReport.map(bundle => {
		const bundleName = cleanBundleLabel(bundle.label);
		const gzipSize = sizeToKilobyteString(bundle.gzipSize);
		const parsedSize = sizeToKilobyteString(bundle.parsedSize);

		rowsMarkdown += `${bundleName} | ${gzipSize} | ${parsedSize}\n`;
	});

	return rowsMarkdown.trim();
};

const createBaseTableMarkdown = () => {
	const headerMarkdown =
		'**Bundle** | **Gzip Size** | **Parsed Size**\n--- | --- | ---\n';

	const rows = createBaseRowsMarkdown();

	markdown(`${headerMarkdown}${rows}`);
};

createBaseTableMarkdown();
createTableMarkdown();
