class ApiError extends Error {
	status;
	fails;

	constructor(status, message, fails = undefined) {
		super(message)
		this.status = status
		this.fails = fails;
	}
}

module.exports = ApiError