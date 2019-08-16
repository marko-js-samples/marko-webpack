module.exports = {
  onInput: function({ steps = [] }) {
    this.state = {
      steps,
      activeIndex: Math.max(0, steps.findIndex(s => s.active))
    };
  },

  handleStepClick(index) {
    if (this.state.activeIndex === index) {
      return;
    }

    let defaultPrevented = false;

    this.emit("beforeChange", {
      step: this.state.steps[this.state.activeIndex],
      preventDefault: () => defaultPrevented = true
    });

    if (defaultPrevented) {
      return;
    }

    this.state.activeIndex = index;
    this.emit("change", {
      name: this.state.steps[index].name,
      index
    });
  }
};
