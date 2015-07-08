'use strict';

var jsonClient = require('json-client');

var HAProxyClient = module.exports = function (serviceId, opts) {
	if (!(this instanceof HAProxyClient))
		return new HAProxyClient(serviceId, opts);

	opts = opts || {};
	opts.haproxyRestBase = opts.haproxyRestBase || process.env.HAPROXY_REST_BASE_URI;

	this.client = jsonClient(opts.haproxyRestBase);
	this.options = opts;
};

HAProxyClient.prototype.getFrontends = function () {
	return this.client('get', 'frontends');
};

HAProxyClient.prototype.getFrontend = function (id) {
	return this.client('get', 'frontends/' + encodeURIComponent(id));
};

HAProxyClient.prototype.putFrontend = function (id, opts) {
	var frontend = opts || {};
	frontend.bind = frontend.bind;
	frontend.mode = frontend.mode || "tcp";
	frontend.key = id;
	frontend.keepalive = frontend.keepalive || "default";
	frontend.backend = frontend.backend || (id + "backend");
	frontend.natives = frontend.natives || [];
	frontend.rules = frontend.rules || [];

	return this.client('put', 'frontends/' + encodeURIComponent(id), null, null, frontend);
};

HAProxyClient.prototype.deleteFrontend = function(id) {
	return this.client('delete', 'frontends/' + encodeURIComponent(id));
};

HAProxyClient.prototype.getBackends = function () {
	return this.client('get', 'backends');
};

HAProxyClient.prototype.getBackend = function (id) {
	return this.client('get', 'backends/' + encodeURIComponent(id));
};

HAProxyClient.prototype.putBackend = function (id, opts) {
	var backend = opts || {};
	backend.type = backend.type || "static";
	backend.mode = backend.mode || "tcp";
	backend.key = id;
	backend.natives = backend.natives || [];
	backend.members = backend.members || [];

	return this.client('put', 'backends/' + encodeURIComponent(id), null, null, backend);
};

HAProxyClient.prototype.deleteBackend = function(id) {
	return this.client('delete', 'backends/' + encodeURIComponent(id));
};
