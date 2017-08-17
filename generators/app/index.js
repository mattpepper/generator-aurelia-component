'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('aurelia-component') + ' generator!'
    ));


    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your component name',
      default : 'index'
    },
    {
      type: 'confirm',
      name: 'createComponentFolder',
      message: 'Create a component folder?',
      default: true
    },
    {
      type    : 'input',
      name    : 'componentDir',
      message : 'The component folder',
      when: ((answers) => {
        return answers.createComponentFolder;
      })
    }]).then(props => {

      props.componentPath = !!props.componentDir ? `${props.componentDir}/` : '';

      this.log('name', props.name);
      this.log('dir', props.componentDir);
      this.log('path', props.componentPath);

      this.props = props;
    });
  }

  writing() {
    const componentName = this.props.name,
      capitalizedName = componentName.replace(/(-| [A-Z])?([a-z0-9_])-?([a-z0-9_]+)/gi, ((m, p1, p2, p3)=> {
        return `${p2.toUpperCase()}${p3.toLowerCase()}`;
      })),
      path = this.props.componentPath;

    this.fs.copyTpl(
      this.templatePath('vm.js'),
      this.destinationPath(`${path}${componentName}.js`),
      { ComponentName: capitalizedName }
    );

    this.fs.copyTpl(
      this.templatePath('view.html'),
      this.destinationPath(`${path}${componentName}.html`),
      { ComponentName: componentName }
    );

    this.fs.copyTpl(
      this.templatePath('style.scss'),
      this.destinationPath(`${path}${componentName}.scss`),
      { ComponentName: componentName }
    );
  }

  install() {
    this.installDependencies();
  }


};
