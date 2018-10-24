const assert = require('assert');
const PORT = process.env.PORT || 80; // for the /health server

class HealthMonitor {
	constructor({ logger, bot_name } = {}) {
		assert(logger);
		assert(bot_name);
		this.logger = logger;
		this.bot_name = bot_name;
		this.ready = false;
		this.healthy = {};
		const express = require('express');
		const app = express();
		app.get('/health', (request, response) => {
			const status = JSON.stringify(this.healthy);
			if (this._check_healthy()) {
				response.send('healthy\n' + status);
			} else {
				response.status(500).send('nope\n' + status);
			}
		});
		app.get('/ready', (request, response) => {
			if (this.ready) {
				response.send('ready');
			} else {
				response.status(500).send('nope');
			}
		});
		app.get('/', (request, response) => {
			response.send(this.bot_name);
		});

		app.listen(PORT, (err) => {
			if (err) {
				return this.logger.error('something bad happened', err);
			}

			this.logger.info(`server is listening on ${PORT}`);
		});
	}

	_check_healthy() {
		const values = Object.values(this.healthy);
		if (values.length === 0) {
			return false;
		}
		// all truthy
		return values.every((v) => v);
	}

	set_ready(value) {
		this.ready = value;
	}
	set_healthy(key, value) {
		if (key in this.healthy) {
			if (value !== this.healthy[key]) {
				if (value === true) {
					this.logger.info(`HealthMonitor: Sub-system reporting as healthy: ${key}`);
				} else {
					this.logger.warn(`HealthMonitor: Sub-system reporting as UNHEALTHY: ${key}`);
				}
			}
		} else {
			const func = value === true ? this.logger.info.bind(this.logger) : this.logger.warn.bind(this.logger);
			func(`HealthMonitor: Sub-system ${key} adding itself with healthy=${value}`);
		}

		this.healthy[key] = value;
		// Healthy => ready
		if (value && !this.ready) {
			this.ready = true;
		}
	}
}

module.exports = HealthMonitor;
