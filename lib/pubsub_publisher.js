const assert = require('assert');
const PubSub = require('@google-cloud/pubsub');

const SYSTEM_ALERT_PUBSUB_TOPIC = 'system-alerts';
const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;

class GooglePubSubPublisher {
	constructor({ logger, topic, bot_name } = {}) {
		assert(logger);
		assert(bot_name);
		this.logger = logger;
		this.bot_name = bot_name;
		this.pubsubClient = new PubSub({
			projectId: GOOGLE_PROJECT_ID
		});
		this.publisher = topic ? this.pubsubClient.topic(topic).publisher() : null;
		this.system_alert_publisher = this.pubsubClient.topic(SYSTEM_ALERT_PUBSUB_TOPIC).publisher();
	}

	publish_message(data) {
		if (!this.publisher) {
			const msg = `GooglePubSubPublisher asked to publish on an intance with no topic defined`;
			this.publish_system_alert(msg);
			throw new Error(msg);
		}

		const dataBuffer = Buffer.from(JSON.stringify(data));

		this.publisher
			.publish(dataBuffer, { origin: this.bot_name })
			.then((messageId) => {
				health_monitor.set_healthy('pubsub_publish', true);
				this.logger.debug(`Message ${messageId} published.`);
			})
			.catch((err) => {
				health_monitor.set_healthy('pubsub_publish', false);
				console.error('ERROR:', err);
			});
	}

	publish_system_alert(data) {
		const json = JSON.stringify(data);
		const dataBuffer = Buffer.from(json);
		this.logger.debug(`Publishing System Alert: ${json}`);

		if (process.env.NO_SYSTEM_MESSAGES) {
			this.logger.info(`SYS_MSG: ${json}`);
			return;
		}

		this.system_alert_publisher
			.publish(dataBuffer, { origin: this.bot_name })
			.then((messageId) => {
				health_monitor.set_healthy('system-alerts-publisher', true);
				this.logger.debug(`System Alert ${messageId} published`);
			})
			.catch((err) => {
				health_monitor.set_healthy('system-alerts-publisher', false);
				this.logger.error('ERROR publishing system alert:', err);
			});
	}
}

module.exports = GooglePubSubPublisher;
