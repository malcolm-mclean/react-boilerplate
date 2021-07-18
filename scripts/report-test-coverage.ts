import { codeCoverage, PluginOptions } from 'danger-plugin-code-coverage';

const defaultPluginOptions: PluginOptions[] = [
	{
		title: 'Code Coverage in this PR',
		ignoreCoveragePattern: [
			'.js',
			'.yml',
			'.json',
			'.md',
			'.lock',
			'.html',
			'.config.',
			'gitignore',
			'prettier',
			'report-'
		],
		coverageFilesPath: 'coverage/coverage-final.json'
	}
];

codeCoverage(defaultPluginOptions);
