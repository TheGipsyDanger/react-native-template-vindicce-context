const {
  viewExists,
  componentExists,
  getNavigators,
  navigatorExists,
  navigatorExistsForViews,
  reduxExists,
} = require('./src/utils/componentExists');

module.exports = plop => {
  plop.setGenerator('View', {
    description: 'Create a new Function View',
    prompts:
      getNavigators().length > 0
        ? [
            {
              type: 'list',
              name: 'navigator',
              message: 'Belongs to which example?',
              default: getNavigators()[0],
              choices: () => getNavigators(),
            },
            {
              type: 'input',
              name: 'name',
              message: 'What should it be called?',
              default: 'Home View',
              validate: (value, otherValues) => {
                if (/.+/.test(value)) {
                  if (otherValues.navigator != 'Default') {
                    return navigatorExistsForViews(
                      value,
                      'components',
                      otherValues.navigator
                    )
                      ? 'A component or container with this name already exists'
                      : true;
                  } else {
                    return viewExists(value)
                      ? 'A component or container with this name already exists'
                      : true;
                  }
                }
                return 'The name is required';
              },
            },
          ]
        : [
            {
              type: 'input',
              name: 'name',
              message: 'What should it be called?',
              default: 'Home View',
              validate: value => {
                if (/.+/.test(value)) {
                  return viewExists(value)
                    ? 'A component or container with this name already exists'
                    : true;
                }
                return 'The name is required';
              },
            },
          ],
    actions: data => {
      let notNavigator = data.navigator == null || data.navigator == 'Default';

      let path = notNavigator
        ? 'src/views/{{pascalCase name}}/Layout/index.tsx'
        : 'src/views/{{pascalCase navigator}}/{{pascalCase name}}/Layout/index.tsx';

      let pathStyles =
        data.navigator == 'Default'
          ? 'src/views/{{pascalCase name}}/Layout/styles.ts'
          : 'src/views/{{pascalCase navigator}}/{{pascalCase name}}/Layout/styles.ts';

      let componentTemplate = notNavigator
        ? './__templates__/view/view_layout_index.js.hbs'
        : './__templates__/view/view_layout_index_to_navigator.js.hbs';

      let pathToIndex = notNavigator
        ? 'src/views/{{pascalCase name}}/index.tsx'
        : 'src/views/{{pascalCase navigator}}/{{pascalCase name}}/index.tsx';

      let pathToIndexData = notNavigator
        ? 'src/views/{{pascalCase name}}/data.ts'
        : 'src/views/{{pascalCase navigator}}/{{pascalCase name}}/data.ts';

      let componentTemplateIndex =
        './__templates__/function/functionIndex.js.hbs';

      let componentTemplateStyles = './__templates__/view/styles.js.hbs';
      let pathIndex = 'src/views/index.ts';
      let patternImport = /\/\/ Import views here\n/g;
      let patternInsert = /\/\/ Insert views here\n/g;
      let componentTemplateImport = './__templates__/common/importView.hbs';

      const actions =
        data.navigator == null || data.navigator == 'Default'
          ? [
              {
                type: 'add',
                path: path,
                templateFile: componentTemplate,
              },
              {
                type: 'add',
                path: pathStyles,
                templateFile: componentTemplateStyles,
              },
              {
                type: 'add',
                path: pathToIndex,
                templateFile: './__templates__/view/view_index.js.hbs',
              },
              {
                type: 'add',
                path: pathToIndexData,
                templateFile: './__templates__/view/data.js.hbs',
              },
              {
                type: 'modify',
                path: pathIndex,
                pattern: patternImport,
                templateFile: './__templates__/view/import_view.js.hbs',
              },
            ]
          : [
              {
                type: 'add',
                path: path,
                templateFile: componentTemplate,
              },
              {
                type: 'add',
                path: pathStyles,
                templateFile: componentTemplateStyles,
              },
              {
                type: 'add',
                path: pathToIndex,
                templateFile: './__templates__/view/view_index.js.hbs',
              },
              {
                type: 'add',
                path: pathToIndexData,
                templateFile: './__templates__/view/data.js.hbs',
              },
            ];
      return actions;
    },
  });
  plop.setGenerator('Component', {
    description: 'Create a new Component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        default: 'Button',
        validate: value => {
          if (/.+/.test(value)) {
            return componentExists(value)
              ? 'A component or container with this name already exists'
              : true;
          }
          return 'The name is required';
        },
      },
    ],
    actions: data => {
      let patternImport = /\/\/ Import component here\n/g;

      const actions = [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/Layout/index.tsx',
          templateFile:
            './__templates__/components/component_layout_index.js.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/Layout/styles.ts',
          templateFile: './__templates__/components/styles.js.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/index.tsx',
          templateFile: './__templates__/components/component_index.js.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/data.ts',
          templateFile: './__templates__/components/data.js.hbs',
        },
        {
          type: 'modify',
          path: 'src/components/index.ts',
          pattern: patternImport,
          templateFile: './__templates__/components/import_component.js.hbs',
        },
      ];

      return actions;
    },
  });
  plop.setGenerator('Hooks', {
    description: 'Create a new Redux',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        default: 'PesonRedux',
        validate: value => {
          if (/.+/.test(value)) {
            return reduxExists(value)
              ? 'A component or container with this name already exists'
              : true;
          }
          return 'The name is required';
        },
      },
    ],
    actions: () => {
      const actions = [
        {
          type: 'add',
          path: 'src/hooks/{{pascalCase name}}.tsx',
          templateFile: './__templates__/hooks/new_hook.js.hbs',
        },
        {
          type: 'modify',
          path: 'src/hooks/index.ts',
          pattern: /\/\/ Import hooks here\n/g,
          templateFile: './__templates__/hooks/import_export_hooks.js.hbs',
        },
      ];
      return actions;
    },
  });
  plop.setGenerator('Flow', {
    description: 'Create a new Flow navigation',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'What type of navigation?',
        default: 'StackNavigation',
        choices: () => ['StackNavigation'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        default: 'Settings',
        validate: value => {
          if (/.+/.test(value)) {
            return navigatorExists(value)
              ? 'A component or container with this name already exists'
              : true;
          }
          return 'The name is required';
        },
      },
    ],
    actions: data => {
      const actions = [
        {
          type: 'add',
          path: 'src/views/{{pascalCase name}}Navigator/index.tsx',
          templateFile: './__templates__/flow/index_flow.jbs.hbs',
        },
        {
          type: 'add',
          path:
            'src/views/{{pascalCase name}}Navigator/{{pascalCase name}}/Layout/index.tsx',
          templateFile:
            './__templates__/flow/flow_navigator_layout_index.js.hbs',
        },
        {
          type: 'add',
          path:
            'src/views/{{pascalCase name}}Navigator/{{pascalCase name}}/Layout/styles.ts',
          templateFile: './__templates__/flow/styles.js.hbs',
        },
        {
          type: 'add',
          path:
            'src/views/{{pascalCase name}}Navigator/{{pascalCase name}}/index.tsx',
          templateFile: './__templates__/flow/flow_navigator_index.js.hbs',
        },
        {
          type: 'add',
          path:
            'src/views/{{pascalCase name}}Navigator/{{pascalCase name}}/data.ts',
          templateFile: './__templates__/flow/data.js.hbs',
        },
        {
          type: 'modify',
          path: 'src/views/index.ts',
          pattern: /\/\/ Import views here\n/g,
          templateFile: './__templates__/flow/import_view.js.hbs',
        },
      ];

      return actions;
    },
  });
};