const raptorPubsub = require("raptor-pubsub");

let nextId = 0;

module.exports = {
  onInput({ notifications = [] }) {
    this.state = {
      notifications
    };
  },

  onMount() {
    const self = this;

    this.subscribeTo(raptorPubsub).on("notification",
      ({ message }) => self.addNotification(message)
    );
  },

  addNotification(message) {
    const id = `notification${nextId++}`;

    this.state.notifications = [{
        message,
        id
      }].concat(this.state.notifications);

    setTimeout(() => this.removeNotification(id), 3000);
  },

  removeNotification(notificationId) {
    this.getComponent(notificationId).fadeOut(() => {
      this.state.notifications = this.state.notifications
        .filter(({ id }) => id !== notificationId);
    });
  }
};
