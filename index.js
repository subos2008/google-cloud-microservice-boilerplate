const bot_name = 'my-service-name';

var logger;
if (process.env.PLAIN_LOGGING !== undefined) {
	const Logger = require('./lib/faux_logger');
	logger = new Logger();
} else {
	var bunyan = require('bunyan');
	var logger = bunyan.createLogger({
		name: bot_name,
		streams: [
			{
				stream: process.stderr,
				level: 'warn'
			},
			{
				stream: process.stdout,
				level: 'info'
			}
		]
	});
}
logger.info(`${bot_name} restarting`);

const assert = require('assert');

const GooglePubSubPublisher = require('./lib/pubsub_publisher');
const HealthMonitor = require('./lib/health_monitor');
`
TODO - system-alert doesn't set origin so we get an empty : at the start of the Telegram restarded message
TODO - does it go unhealthy when the network is disconnected?
`;

health_monitor = new HealthMonitor({ logger, bot_name });

// , topic: GOOGLE_PUBSUB_TOPIC
const message_publisher = new GooglePubSubPublisher({ logger, bot_name });

message_publisher.publish_system_alert(`${bot_name}: restarted`);

(async () => {
	try {
		// insert service code here
	} catch (e) {
		logger.error(e.stack);
		message_publisher.publish_system_alert(`${bot_name}: exception at top level: ${e}`);
		logger.error('Will exit in 1 second');
		setTimeout(() => process.exit(1), 1000);
	}
})();
