import { codeCoverage, PluginOptions } from 'danger-plugin-code-coverage';

const defaultPluginOptions: PluginOptions[] = [
	{
		title: '### Code Coverage in this PR',
		ignoreCoveragePattern: [],
		coverageFilesPath: 'coverage/coverage-final.json'
	}
];

codeCoverage(defaultPluginOptions);
