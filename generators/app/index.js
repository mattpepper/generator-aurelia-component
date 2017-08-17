'use strict';
const NameHelper = require('./NameHelper');

const Generator = require('yeoman-generator')
  , chalk = require('chalk')
  , yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('aurelia-component') + ' generator!'
    ));

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your component name',
      default: 'index'
    },
      {
        type: 'confirm',
        name: 'createComponentFolder',
        message: 'Create a component folder?',
        default: true,
        when: ((answers) => {
          return answers.name === 'index';
        })

      },
      {
        type: 'input',
        name: 'componentDir',
        message: 'The component folder',
        when: ((answers) => {
          return answers.createComponentFolder;
        })
      },
      {
        type: 'list',
        name: 'conventionClassName',
        message: 'Choose your component class naming convention',
        choices: [
          'PascalCase',
          'camelCase'
        ]
      },
      {
        type: 'list',
        name: 'conventionFileName',
        message: 'Choose your file naming convention',
        choices: [
          'hyphen-delimited',
          'PascalCase',
          'camelCase'
        ]
      }
    ]).then(props => {


      const helper = new NameHelper();
      props.fileName = helper.convertString(props.name, props.conventionFileName);
      props.className = props.name === 'index' ?
        helper.convertString(props.componentDir, props.conventionClassName):
        helper.convertString(props.name, props.conventionClassName);
      props.folder = !!props.componentDir ? helper.convertString(props.componentDir, props.conventionFileName) : '';


      props.componentPath = !!props.componentDir ? `${props.folder}/` : '';

      this.log('name', props.name);
      this.log('class', props.className);
      this.log('file', props.fileName);
      this.log('dir', props.componentDir);
      this.log('folder', props.folder);
      this.log('path', props.componentPath);


      this.props = props;
    });
  }

  writing() {
    const path = `${this.props.componentPath}${this.props.fileName}`;

    this.fs.copyTpl(
      this.templatePath('vm.js'),
      this.destinationPath(`${path}.js`),
      {
        ComponentName: this.props.className,
        FileName: this.props.fileName
      }

    );

    this.fs.copyTpl(
      this.templatePath('view.html'),
      this.destinationPath(`${path}.html`),
      {
        ComponentName: !!this.props.folder ? this.props.folder : this.props.fileName,
        FileName: this.props.fileName
      }
    );

    this.fs.copyTpl(
      this.templatePath('style.scss'),
      this.destinationPath(`${path}.scss`),
      {
        ComponentName: this.props.className,
        FileName: this.props.fileName
      }
    );
  }
};
