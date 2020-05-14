import { message } from 'danger';
import report from './report.json';

const sizeToKilobyteString = (size: number) => {
	const kilobytes = size / 1000;

	return `${kilobytes} KB`;
};

const createMarkdownTable = () => {
	report.map(bundle => {
		const gzipSize = sizeToKilobyteString(bundle.gzipSize);
		const parsedSize = sizeToKilobyteString(bundle.parsedSize);

		message(`Gzipped: ${gzipSize}`);
		message(`Minified: ${parsedSize}`);
	});
};

createMarkdownTable();
