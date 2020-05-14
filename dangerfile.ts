import { message } from 'danger';
import report from './report.json';

const sizeToKilobyteString = (size: number) => {
	const kilobytes = size / 1000;

	return `${kilobytes} KB`;
};

const cleanBundleLabel = (label: string) => {
	const nameStartIndex = label.lastIndexOf('/');
	const nameEndIndex = label.indexOf('.');

	return label.slice(nameStartIndex, nameEndIndex);
};

const createMarkdownTable = () => {
	report.map(bundle => {
		const bundleName = cleanBundleLabel(bundle.label);
		const gzipSize = sizeToKilobyteString(bundle.gzipSize);
		const parsedSize = sizeToKilobyteString(bundle.parsedSize);

		message(
			`Bundle: ${bundleName} | Gzipped: ${gzipSize} | Parsed: ${parsedSize}`
		);
	});
};

createMarkdownTable();
