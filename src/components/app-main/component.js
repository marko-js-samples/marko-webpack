const raptorPubsub = require('raptor-pubsub');
const button = require('../app-button');
const checkbox = require('../app-checkbox');
const progressBar = require('../app-progress-bar');
const extend = require('raptor-util/extend');

const buttonSizes = ['small', 'normal', 'large'];
const buttonVariants = ['primary', 'secondary'];

let currentButtonSize = 0;
let currentButtonVariant = 0;

module.exports = {
  onInput: function({
      buttonSize = 'small',
      buttonVariant = 'primary',
      checked = {
        foo: false,
        bar: true,
        baz: false
      } }) {
    const now = Date().toString();

    this.state = {
      buttonSize,
      buttonVariant,
      checked,
      overlayVisible: false,
      dynamicTabs: [
        { timestamp: now },
        { timestamp: now }
      ]
    };
  },

  handleCheckboxToggle: function({ data, checked }) {
    const { name } = data;

    // We treat complex objects stored in the state as immutable
    // since only a shallow compare is done to see if the state
    // has changed. Instead of modifying the "checked" object,
    // we create a new object with the updated state of what is
    // checked.
    const newChecked = extend({}, this.state.checked);
    newChecked[name] = checked;
    this.state.checked = newChecked;
  },

  /**
   * This demonstrates how to provide a custom state transition handler to avoid
   * a full rerender.
   */
  update_overlayVisible: function(overlayVisible) {
    this.getComponent('overlay').setVisibility(overlayVisible);
  },

  handleShowOverlayButtonClick: function() {
    this.getComponent('overlay').show();
  },

  handleOverlayHide: function() {
    // Synchronize the updated state of the overlay
    this.setState('overlayVisible', false);
  },

  handleOverlayShow: function() {
    this.setState('overlayVisible', true);
  },

  handleShowNotificationButtonClick: function() {
    raptorPubsub.emit('notification', {
      message: 'This is a notification'
    });
  },

  handleOverlayOk: function() {
    raptorPubsub.emit('notification', {
      message: 'You clicked the “Done” button!'
    });
  },

  handleOverlayCancel: function() {
    raptorPubsub.emit('notification', {
      message: 'You clicked the “Cancel” button!'
    });
  },

  handleRenderButtonClick: function() {
    button.renderSync({ label: 'Hello World' })
      .appendTo(this.getEl('renderTarget'));
  },

  handleRenderCheckboxButtonClick: function() {
    checkbox.renderSync({
        label: 'Hello World',
        checked: true
      })
      .appendTo(this.getEl('renderTarget'));
  },

  handleRenderProgressBarButtonClick: function() {
    progressBar.renderSync({
        steps: [
          { label: 'Step 1' },
          { label: 'Step 2' },
          {
            label: 'Step 3',
            active: true
          },
          { label: 'Step 4' }
        ]
      })
      .appendTo(this.getEl('renderTarget'));
  },

  handleChangeButtonSizeClick: function() {
    var nextButtonSize = buttonSizes[++currentButtonSize % buttonSizes.length];
    this.state.buttonSize = nextButtonSize;
  },

  handleChangeButtonVariantClick: function() {
    var nextButtonVariant = buttonVariants[++currentButtonVariant % buttonVariants.length];
    this.state.buttonVariant = nextButtonVariant;
  },

  handleToggleCheckboxButtonClick: function() {
    this.getComponent('toggleCheckbox').toggle();
  },

  handleAddTabButtonClick: function() {
    this.state.dynamicTabs = this.state.dynamicTabs.concat({
      timestamp: Date().toString()
    });
  }
};
